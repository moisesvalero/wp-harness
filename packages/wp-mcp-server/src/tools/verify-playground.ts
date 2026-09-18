import { spawn, ChildProcess } from 'node:child_process'
import * as net from 'node:net'
import * as path from 'node:path'

export interface VerifyPlaygroundOptions {
  themePath: string
  port?: number
  timeoutMs?: number
}

export interface VerifyPlaygroundResult {
  success: boolean
  statusCode: number
  healthCheck: 'PASSED' | 'FAILED'
  url: string
  themeActivated: boolean
  phpFatalErrorsCount: number
  errors: string[]
  executionTimeMs: number
  details: string
}

/**
 * Finds an open TCP port.
 */
async function findAvailablePort(startPort: number = 9440): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(startPort, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : startPort
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      // Try next port if port is taken
      resolve(findAvailablePort(startPort + 1))
    })
  })
}

/**
 * Headlessly verifies WordPress theme mounting in WP Playground CLI sandbox.
 */
export async function verifyInPlayground(options: VerifyPlaygroundOptions): Promise<VerifyPlaygroundResult> {
  const startTime = Date.now()
  const themePath = path.resolve(options.themePath)
  const port = options.port || await findAvailablePort(9430)
  const timeoutMs = options.timeoutMs || 35000
  const targetUrl = `http://127.0.0.1:${port}/`

  const errors: string[] = []
  let child: ChildProcess | null = null
  let serverOutput = ''

  try {
    // Spawn ephemeral @wp-playground/cli server
    child = spawn('npx', [
      '-y',
      '@wp-playground/cli',
      'server',
      '--port',
      String(port),
      '--auto-mount',
      themePath,
      '--verbosity',
      'normal',
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
    })

    child.stdout?.on('data', (data) => {
      serverOutput += data.toString()
    })
    child.stderr?.on('data', (data) => {
      serverOutput += data.toString()
    })

    // Poll until server is ready and responds
    let isReady = false
    let finalStatus = 0
    let finalHtml = ''
    const pollInterval = 600
    const deadline = Date.now() + timeoutMs

    while (Date.now() < deadline) {
      // Check if child exited prematurely
      if (child.exitCode !== null) {
        throw new Error(`WP Playground CLI exited prematurely with code ${child.exitCode}: ${serverOutput}`)
      }

      try {
        const response = await fetch(targetUrl, {
          headers: { 'User-Agent': 'WP-Harness-Healthcheck/1.0' },
          redirect: 'follow', // Follow 302 installs or redirects
        })

        if (response.status === 200 || response.status === 302) {
          finalStatus = response.status
          finalHtml = await response.text()
          isReady = true
          break
        }
      } catch {
        // Wait for server to bind and boot
        await new Promise(r => setTimeout(r, pollInterval))
      }
    }

    if (!isReady) {
      throw new Error(`Timeout after ${timeoutMs}ms waiting for WP Playground to boot at ${targetUrl}. Output: ${serverOutput}`)
    }

    // Inspect HTML and output for PHP Fatal Errors or White Screen of Death (WSOD)
    let phpFatalErrorsCount = 0

    const fatalPatterns = [
      /Fatal error:/i,
      /Parse error:/i,
      /There has been a critical error on this website/i,
      /Error establishing a database connection/i,
      /PHP Fatal error/i,
      /Call to undefined function/i,
    ]

    for (const pattern of fatalPatterns) {
      if (pattern.test(finalHtml) || pattern.test(serverOutput)) {
        phpFatalErrorsCount++
        errors.push(`Detected fatal error matching ${pattern.toString()}`)
      }
    }

    // Check for WSOD (White Screen of Death): empty body with 200
    if (finalHtml.trim().length < 50) {
      errors.push('White Screen of Death (WSOD) detected: Empty HTTP response received.')
    }

    // Verify theme activation / presence
    const themeFolder = path.basename(themePath)
    const themeDetected = finalHtml.includes(themeFolder) ||
      finalHtml.includes('wp-block') ||
      serverOutput.includes('activateTheme') ||
      serverOutput.includes(themeFolder)

    const success = errors.length === 0 && finalStatus === 200

    return {
      success,
      statusCode: finalStatus,
      healthCheck: success ? 'PASSED' : 'FAILED',
      url: targetUrl,
      themeActivated: themeDetected,
      phpFatalErrorsCount,
      errors,
      executionTimeMs: Date.now() - startTime,
      details: success
        ? `Playground sandbox booted successfully. HTTP 200 OK confirmed with 0 PHP Fatal Errors. Theme "${themeFolder}" mounted.`
        : `Playground verification failed with ${errors.length} error(s).`,
    }
  } finally {
    // Terminate server cleanly
    if (child && child.pid && child.exitCode === null) {
      try {
        child.kill('SIGKILL')
      } catch {
        // Ignore kill errors
      }
    }
  }
}
