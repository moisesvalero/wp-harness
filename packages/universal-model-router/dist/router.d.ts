export type SupportedProvider = 'openrouter' | 'anthropic' | 'openai' | 'deepseek' | 'ollama'
export interface ModelRouteConfig {
  provider: SupportedProvider
  model: string
  apiKeyEnv?: string
  apiKey?: string
  baseURL?: string
  protocol: 'openai-completions' | 'anthropic-messages'
  source: string
}
/**
 * Dynamically resolves the active LLM provider and model configuration from ambient environment variables.
 * Allows switching providers seamlessly without hardcoding.
 */
export declare function resolveActiveModelRoute(env?: NodeJS.ProcessEnv): ModelRouteConfig
//# sourceMappingURL=router.d.ts.map
