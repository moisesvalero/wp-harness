import { resolveActiveModelRoute, ModelRouteConfig } from './router.js'

/**
 * Generates a dynamic Cordis YAML profile patch for DeepSeek Harness.
 * Routes the harness agent loop to the active provider without hardcoding.
 */
export function generateCordisModelPatch(route: ModelRouteConfig = resolveActiveModelRoute()): string {
  const providerKey = route.provider
  const isCustomOllama = route.provider === 'ollama'

  const providerConfig: Record<string, unknown> = {}

  if (route.apiKeyEnv) {
    providerConfig.apiKeyEnv = route.apiKeyEnv
  }
  if (route.baseURL) {
    providerConfig.baseURL = route.baseURL
  }
  if (isCustomOllama) {
    providerConfig.protocol = 'openai-completions'
  }

  return `# ==============================================================================
# WP-HARNESS DYNAMIC MODEL ROUTING OVERLAY
# Source: ${route.source} | Provider: ${route.provider} | Model: ${route.model}
# ==============================================================================
- id: llm-deepseek
  disabled: ${route.provider !== 'deepseek'}

- id: llm-pi-ai
  config:
    providers:
      ${providerKey}:
        ${route.apiKeyEnv ? `apiKeyEnv: ${route.apiKeyEnv}` : `apiKey: ${route.apiKey || 'anonymous'}`}
        ${route.baseURL ? `baseURL: "${route.baseURL}"` : ''}
        ${isCustomOllama ? 'protocol: openai-completions' : ''}

- id: agent-loop
  config:
    agents:
      - id: main
        provider: ${providerKey}
        model: "${route.model}"
        cwd: !!js process.cwd()
`
}
