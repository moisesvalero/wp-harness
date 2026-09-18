export type SupportedProvider = 'deepseek' | 'gemini' | 'mistral' | 'cohere' | 'groq' | 'anthropic' | 'openai' | 'openrouter' | 'together' | 'xai' | 'cerebras' | 'fireworks' | 'perplexity' | 'deepinfra' | 'ollama'
export interface ProviderDefinition {
  id: SupportedProvider
  displayName: string
  defaultModel: string
  reasoningModel?: string
  primaryEnvKey: string
  fallbackEnvKeys?: string[]
  baseURL: string
  protocol: 'openai-completions' | 'anthropic-messages'
  contextWindow: number
  description: string
}
export interface ModelRouteConfig {
  provider: SupportedProvider
  displayName: string
  model: string
  apiKeyEnv?: string
  apiKey?: string
  baseURL?: string
  protocol: 'openai-completions' | 'anthropic-messages'
  contextWindow: number
  source: string
}
/**
 * Universal Registry of all supported AI Model Providers.
 * Covers premier coding, reasoning, fast-inference, and local execution engines.
 */
export declare const PROVIDER_REGISTRY: Record<SupportedProvider, ProviderDefinition>
/**
 * Returns list of all supported provider definitions.
 */
export declare function getAllSupportedProviders(): ProviderDefinition[]
/**
 * Dynamically resolves the active LLM provider and model configuration from ambient environment variables.
 * Allows switching providers seamlessly without hardcoding.
 */
export declare function resolveActiveModelRoute(env?: NodeJS.ProcessEnv): ModelRouteConfig
//# sourceMappingURL=router.d.ts.map
