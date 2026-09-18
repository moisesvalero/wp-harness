import { resolveActiveModelRoute } from './router.js';
/**
 * Generates a dynamic Cordis YAML profile patch for DeepSeek Harness / WP-Harness.
 * Routes the harness agent loop to the active provider without hardcoding.
 */
export function generateCordisModelPatch(route = resolveActiveModelRoute()) {
    const isDeepSeekNative = route.provider === 'deepseek';
    return `# ==============================================================================
# WP-HARNESS DYNAMIC MODEL ROUTING OVERLAY
# Provider: ${route.displayName} (${route.provider})
# Model: ${route.model}
# Protocol: ${route.protocol}
# Context Window: ${route.contextWindow.toLocaleString()} tokens
# Source: ${route.source}
# ==============================================================================
- id: llm-deepseek
  disabled: ${!isDeepSeekNative}

- id: llm-pi-ai
  config:
    providers:
      ${route.provider}:
        apiKeyEnv: ${route.apiKeyEnv || 'API_KEY'}
        baseURL: "${route.baseURL}"
        api: ${route.protocol}
        defaultContextWindow: ${route.contextWindow}

- id: agent-loop
  config:
    agents:
      - id: main
        provider: ${route.provider}
        model: "${route.model}"
        cwd: !!js process.cwd()
`;
}
//# sourceMappingURL=cordis-overlay.js.map