import { resolveActiveModelRoute, getAllSupportedProviders, PROVIDER_REGISTRY, SupportedProvider } from './router.js'
import { generateCordisModelPatch } from './cordis-overlay.js'

export function runCli(): void {
  const args = process.argv.slice(2)

  if (args.includes('--list') || args.includes('-l')) {
    const providers = getAllSupportedProviders()
    console.log('\n================================================================================')
    console.log('🚀 WP-HARNESS UNIVERSAL MULTI-MODEL ADAPTER REGISTRY')
    console.log('================================================================================\n')
    for (const p of providers) {
      console.log(`• [${p.id}] ${p.displayName}`)
      console.log(`    Default Model:    ${p.defaultModel}`)
      if (p.reasoningModel) {
        console.log(`    Reasoning Model:  ${p.reasoningModel}`)
      }
      console.log(`    Env Variable:     ${p.primaryEnvKey}${p.fallbackEnvKeys ? ` (or ${p.fallbackEnvKeys.join(', ')})` : ''}`)
      console.log(`    Protocol:         ${p.protocol}`)
      console.log(`    Base URL:         ${p.baseURL}`)
      console.log(`    Context Window:   ${p.contextWindow.toLocaleString()} tokens`)
      console.log(`    Description:      ${p.description}\n`)
    }
    console.log(`Total Supported Providers: ${providers.length}`)
    return
  }

  if (args.includes('--status') || args.includes('-s')) {
    console.log('\n================================================================================')
    console.log('🔑 WP-HARNESS PROVIDER ENVIRONMENT STATUS')
    console.log('================================================================================\n')
    const providers = getAllSupportedProviders()
    for (const p of providers) {
      const hasPrimary = Boolean(process.env[p.primaryEnvKey]?.trim())
      const hasFallback = Boolean(p.fallbackEnvKeys?.some(k => process.env[k]?.trim()))
      const isSet = hasPrimary || hasFallback
      const statusIcon = isSet ? '🟢 CONFIGURED' : '⚪ NOT CONFIGURED'
      console.log(`  ${statusIcon.padEnd(20)} ${p.id.padEnd(14)} (${p.primaryEnvKey})`)
    }
    console.log('\nActive Route Resolution:')
    const active = resolveActiveModelRoute()
    console.log(`  Selected: ${active.displayName} [${active.provider}] -> ${active.model}`)
    console.log(`  Source:   ${active.source}\n`)
    return
  }

  const route = resolveActiveModelRoute()

  if (args.includes('--patch') || args.includes('-p')) {
    process.stdout.write(generateCordisModelPatch(route))
  } else {
    console.log(JSON.stringify(route, null, 2))
  }
}

if (process.argv[1] && (process.argv[1].endsWith('cli.js') || process.argv[1].endsWith('cli.ts') || process.argv[1].endsWith('wp-model-route'))) {
  runCli()
}
