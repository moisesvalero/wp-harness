import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export interface AuditIssue {
  file: string
  line: number
  severity: 'error' | 'warning'
  rule: string
  message: string
}

export interface AuditResult {
  passed: boolean
  themeJsonValid: boolean
  styleCssValid: boolean
  templatesValid: boolean
  issues: AuditIssue[]
}

/**
 * Validates a WordPress Block Theme against standard WordPress guidelines and security best practices.
 */
export async function auditWordPressTheme(themeDir: string): Promise<AuditResult> {
  const issues: AuditIssue[] = []
  let themeJsonValid = false
  let styleCssValid = false
  let templatesValid = false

  // 1. Check style.css
  const styleCssPath = path.join(themeDir, 'style.css')
  try {
    const styleContent = await fs.readFile(styleCssPath, 'utf8')
    const themeNameMatch = /^(?:[ \t]*<\?php)?[ \t/*#@]*Theme Name:(.*)$/im.exec(styleContent)
    if (themeNameMatch && themeNameMatch[1].trim().length > 0) {
      styleCssValid = true
    } else {
      issues.push({
        file: 'style.css',
        line: 1,
        severity: 'error',
        rule: 'wp-theme-header',
        message: 'Missing or empty "Theme Name:" header in style.css',
      })
    }
  } catch {
    issues.push({
      file: 'style.css',
      line: 1,
      severity: 'error',
      rule: 'wp-missing-style-css',
      message: 'Required file style.css was not found in theme root',
    })
  }

  // 2. Check theme.json
  const themeJsonPath = path.join(themeDir, 'theme.json')
  try {
    const themeJsonContent = await fs.readFile(themeJsonPath, 'utf8')
    const parsed = JSON.parse(themeJsonContent)
    if (parsed.version === 3 || parsed.version === 2) {
      themeJsonValid = true
    } else {
      issues.push({
        file: 'theme.json',
        line: 1,
        severity: 'warning',
        rule: 'wp-theme-json-version',
        message: `theme.json version is ${parsed.version}, recommended version 3 for modern Block Themes`,
      })
      themeJsonValid = true // Still structurally valid
    }
  } catch (err) {
    issues.push({
      file: 'theme.json',
      line: 1,
      severity: 'error',
      rule: 'wp-invalid-theme-json',
      message: `Invalid theme.json: ${(err as Error).message}`,
    })
  }

  // 3. Check templates/index.html
  const indexPath = path.join(themeDir, 'templates', 'index.html')
  try {
    const indexContent = await fs.readFile(indexPath, 'utf8')
    if (indexContent.includes('<!-- wp:')) {
      templatesValid = true
    } else {
      issues.push({
        file: 'templates/index.html',
        line: 1,
        severity: 'error',
        rule: 'wp-fse-block-markup',
        message: 'templates/index.html must contain WordPress block markup (<!-- wp:... -->)',
      })
    }
  } catch {
    issues.push({
      file: 'templates/index.html',
      line: 1,
      severity: 'error',
      rule: 'wp-missing-index-template',
      message: 'templates/index.html is required for Full Site Editing (FSE) block themes',
    })
  }

  // 4. Scan all PHP files for security standards
  const phpFiles = await findPhpFiles(themeDir)
  for (const phpFile of phpFiles) {
    const relativePath = path.relative(themeDir, phpFile)
    const content = await fs.readFile(phpFile, 'utf8')
    const lines = content.split('\n')

    lines.forEach((line, idx) => {
      const lineNum = idx + 1

      // Direct echo of raw superglobals
      if (/(echo|print)\s+.*\$(?:_POST|_GET|_REQUEST|COOKIE)/i.test(line)) {
        issues.push({
          file: relativePath,
          line: lineNum,
          severity: 'error',
          rule: 'wp-security-unescaped-output',
          message: 'Direct output of superglobal without escaping (use esc_html, esc_attr, or wp_kses_post)',
        })
      }

      // Raw $_POST access without sanitization or nonce checking in context
      if (/\$(?:_POST|_GET|_REQUEST)\[['"][^'"]+['"]\]/i.test(line)) {
        if (!/(sanitize_|intval|absint|wp_verify_nonce|check_admin_referer|filter_input|isset|empty)/i.test(line)) {
          // Check if previous lines handled sanitization; flag warning for scrutiny
          issues.push({
            file: relativePath,
            line: lineNum,
            severity: 'warning',
            rule: 'wp-security-unsanitized-input',
            message: 'Superglobal input used without inline sanitization (ensure sanitize_text_field/intval is applied)',
          })
        }
      }

      // Dangerous eval or system execution
      if (/\b(eval|exec|shell_exec|passthru|system)\s*\(/i.test(line)) {
        issues.push({
          file: relativePath,
          line: lineNum,
          severity: 'error',
          rule: 'wp-security-dangerous-function',
          message: 'Forbidden dynamic execution function detected',
        })
      }
    })
  }

  const errors = issues.filter(i => i.severity === 'error')
  return {
    passed: errors.length === 0,
    themeJsonValid,
    styleCssValid,
    templatesValid,
    issues,
  }
}

async function findPhpFiles(dir: string): Promise<string[]> {
  const results: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'vendor' && entry.name !== '.git') {
        results.push(...(await findPhpFiles(fullPath)))
      } else if (entry.isFile() && entry.name.endsWith('.php')) {
        results.push(fullPath)
      }
    }
  } catch {
    // Directory might not exist
  }
  return results
}
