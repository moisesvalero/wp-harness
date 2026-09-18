export type SupportedProvider =
  | 'deepseek'
  | 'gemini'
  | 'mistral'
  | 'cohere'
  | 'groq'
  | 'anthropic'
  | 'openai'
  | 'openrouter'
  | 'together'
  | 'xai'
  | 'cerebras'
  | 'fireworks'
  | 'perplexity'
  | 'deepinfra'
  | 'ollama'

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
export const PROVIDER_REGISTRY: Record<SupportedProvider, ProviderDefinition> = {
  gemini: {
    id: 'gemini',
    displayName: 'Google Gemini',
    defaultModel: 'gemini-2.5-pro',
    reasoningModel: 'gemini-2.5-pro',
    primaryEnvKey: 'GEMINI_API_KEY',
    fallbackEnvKeys: ['GOOGLE_API_KEY'],
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    protocol: 'openai-completions',
    contextWindow: 1_048_576,
    description: 'Google Gemini 2.5 Pro / Flash with ultra-long context (1M+) and multimodal understanding',
  },
  mistral: {
    id: 'mistral',
    displayName: 'Mistral AI / Codestral',
    defaultModel: 'codestral-latest',
    reasoningModel: 'mistral-large-latest',
    primaryEnvKey: 'MISTRAL_API_KEY',
    fallbackEnvKeys: ['CODESTRAL_API_KEY'],
    baseURL: 'https://api.mistral.ai/v1',
    protocol: 'openai-completions',
    contextWindow: 262_144,
    description: 'Specialized code completion, FSE block patterns, and European multilingual reasoning',
  },
  cohere: {
    id: 'cohere',
    displayName: 'Cohere Command',
    defaultModel: 'command-r-plus-08-2024',
    reasoningModel: 'command-r-plus',
    primaryEnvKey: 'COHERE_API_KEY',
    baseURL: 'https://api.cohere.com/compatibility/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Command R+ enterprise reasoning, tool use, and structured multi-step code planning',
  },
  groq: {
    id: 'groq',
    displayName: 'Groq LPU',
    defaultModel: 'llama-3.3-70b-versatile',
    reasoningModel: 'deepseek-r1-distill-llama-70b',
    primaryEnvKey: 'GROQ_API_KEY',
    baseURL: 'https://api.groq.com/openai/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Ultra-fast LPU inference engine delivering near-instant multi-turn token streaming',
  },
  anthropic: {
    id: 'anthropic',
    displayName: 'Anthropic Claude',
    defaultModel: 'claude-3-7-sonnet-20250219',
    reasoningModel: 'claude-3-7-sonnet-20250219',
    primaryEnvKey: 'ANTHROPIC_API_KEY',
    baseURL: 'https://api.anthropic.com',
    protocol: 'anthropic-messages',
    contextWindow: 200_000,
    description: 'Claude 3.7 Sonnet hybrid thinking, coding precision, and complex architectural refactors',
  },
  openai: {
    id: 'openai',
    displayName: 'OpenAI',
    defaultModel: 'gpt-4o',
    reasoningModel: 'o3-mini',
    primaryEnvKey: 'OPENAI_API_KEY',
    baseURL: 'https://api.openai.com/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'OpenAI flagship GPT-4o and advanced reasoning series (o3-mini, o1)',
  },
  openrouter: {
    id: 'openrouter',
    displayName: 'OpenRouter Universal Gateway',
    defaultModel: 'openai/gpt-6-astra',
    reasoningModel: 'anthropic/claude-fable-5.1',
    primaryEnvKey: 'OPENROUTER_API_KEY',
    baseURL: 'https://openrouter.ai/api/v1',
    protocol: 'openai-completions',
    contextWindow: 1_050_000,
    description: 'Unified gateway featuring 2026 flagships (GPT-6 Astra, Claude Fable 5.1, Gemini 3.8, DeepSeek V4.1) and Free collection',
  },
  together: {
    id: 'together',
    displayName: 'Together AI',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
    reasoningModel: 'deepseek-ai/DeepSeek-R1',
    primaryEnvKey: 'TOGETHER_API_KEY',
    baseURL: 'https://api.together.xyz/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Serverless cloud hosting DeepSeek R1/V3, Llama 3.3, and Qwen 2.5 Coder',
  },
  xai: {
    id: 'xai',
    displayName: 'xAI Grok',
    defaultModel: 'grok-2-1212',
    reasoningModel: 'grok-2-vision-1212',
    primaryEnvKey: 'XAI_API_KEY',
    baseURL: 'https://api.x.ai/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Frontier Grok intelligence models with deep reasoning and vision capabilities',
  },
  cerebras: {
    id: 'cerebras',
    displayName: 'Cerebras Inference',
    defaultModel: 'llama-3.3-70b',
    reasoningModel: 'llama-3.3-70b',
    primaryEnvKey: 'CEREBRAS_API_KEY',
    baseURL: 'https://api.cerebras.ai/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Wafer-scale cluster computing delivering highest token throughput for Llama models',
  },
  fireworks: {
    id: 'fireworks',
    displayName: 'Fireworks AI',
    defaultModel: 'accounts/fireworks/models/deepseek-v3',
    reasoningModel: 'accounts/fireworks/models/deepseek-r1',
    primaryEnvKey: 'FIREWORKS_API_KEY',
    baseURL: 'https://api.fireworks.ai/inference/v1',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Production-grade serverless inferencing for DeepSeek and Qwen open-weights',
  },
  perplexity: {
    id: 'perplexity',
    displayName: 'Perplexity AI',
    defaultModel: 'sonar-pro',
    reasoningModel: 'sonar-reasoning-pro',
    primaryEnvKey: 'PERPLEXITY_API_KEY',
    baseURL: 'https://api.perplexity.ai',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Live web-grounded Sonar reasoning models for fresh real-time documentation retrieval',
  },
  deepinfra: {
    id: 'deepinfra',
    displayName: 'DeepInfra',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
    reasoningModel: 'deepseek-ai/DeepSeek-R1',
    primaryEnvKey: 'DEEPINFRA_API_KEY',
    baseURL: 'https://api.deepinfra.com/v1/openai',
    protocol: 'openai-completions',
    contextWindow: 131_072,
    description: 'Cost-effective serverless GPU hosting for DeepSeek and open-source models',
  },
  ollama: {
    id: 'ollama',
    displayName: 'Ollama (Local / Self-Hosted)',
    defaultModel: 'qwen2.5-coder:32b',
    reasoningModel: 'deepseek-r1:32b',
    primaryEnvKey: 'OLLAMA_API_KEY',
    fallbackEnvKeys: ['OLLAMA_BASE_URL'],
    baseURL: 'http://localhost:11434/v1',
    protocol: 'openai-completions',
    contextWindow: 32_768,
    description: '100% offline, privacy-first local models running on your local Apple Silicon or GPU',
  },
  deepseek: {
    id: 'deepseek',
    displayName: 'DeepSeek Official',
    defaultModel: 'deepseek-chat',
    reasoningModel: 'deepseek-reasoner',
    primaryEnvKey: 'DEEPSEEK_API_KEY',
    baseURL: 'https://api.deepseek.com',
    protocol: 'openai-completions',
    contextWindow: 65_536,
    description: 'Official DeepSeek V3 and DeepSeek R1 reasoning models with native SSE wire protocol',
  },
}

/**
 * Returns list of all supported provider definitions.
 */
export function getAllSupportedProviders(): ProviderDefinition[] {
  return Object.values(PROVIDER_REGISTRY)
}

/**
 * Checks if a specific provider has a valid credential set in the environment.
 */
function findApiKey(def: ProviderDefinition, env: NodeJS.ProcessEnv): { keyEnv: string; keyValue: string } | null {
  const primaryVal = env[def.primaryEnvKey]?.trim()
  if (primaryVal && primaryVal.length > 0) {
    return { keyEnv: def.primaryEnvKey, keyValue: primaryVal }
  }

  if (def.fallbackEnvKeys) {
    for (const alt of def.fallbackEnvKeys) {
      const altVal = env[alt]?.trim()
      if (altVal && altVal.length > 0) {
        return { keyEnv: alt, keyValue: altVal }
      }
    }
  }

  return null
}

/**
 * Dynamically resolves the active LLM provider and model configuration from ambient environment variables.
 * Allows switching providers seamlessly without hardcoding.
 */
export function resolveActiveModelRoute(env: NodeJS.ProcessEnv = process.env): ModelRouteConfig {
  const explicitProviderName = (env.WP_HARNESS_PROVIDER || env.DEFAULT_MODEL_PROVIDER)?.toLowerCase()
  const explicitModel = env.WP_HARNESS_MODEL || env.DEFAULT_MODEL_NAME

  // 1. Explicit Provider Selection
  if (explicitProviderName && explicitProviderName in PROVIDER_REGISTRY) {
    const providerId = explicitProviderName as SupportedProvider
    const def = PROVIDER_REGISTRY[providerId]
    const keyInfo = findApiKey(def, env)
    const customBaseURL = env[`${providerId.toUpperCase()}_BASE_URL`] || def.baseURL
    const customModel = explicitModel || env[`${providerId.toUpperCase()}_MODEL`] || def.defaultModel

    return {
      provider: providerId,
      displayName: def.displayName,
      model: customModel,
      apiKeyEnv: keyInfo?.keyEnv || def.primaryEnvKey,
      apiKey: keyInfo?.keyValue || env[def.primaryEnvKey],
      baseURL: customBaseURL,
      protocol: def.protocol,
      contextWindow: def.contextWindow,
      source: `explicit:${env.WP_HARNESS_PROVIDER ? 'WP_HARNESS_PROVIDER' : 'DEFAULT_MODEL_PROVIDER'}=${providerId}`,
    }
  }

  // 2. Dynamic Ambient Resolution (Auto-detection based on present API keys)
  // Priority order for auto-detection
  const detectionOrder: SupportedProvider[] = [
    'gemini',
    'mistral',
    'cohere',
    'groq',
    'anthropic',
    'openai',
    'openrouter',
    'together',
    'xai',
    'cerebras',
    'fireworks',
    'perplexity',
    'deepinfra',
    'ollama',
    'deepseek',
  ]

  for (const providerId of detectionOrder) {
    const def = PROVIDER_REGISTRY[providerId]
    const keyInfo = findApiKey(def, env)

    if (keyInfo && keyInfo.keyValue.length > 0) {
      const customBaseURL = env[`${providerId.toUpperCase()}_BASE_URL`] || def.baseURL
      const customModel = explicitModel || env[`${providerId.toUpperCase()}_MODEL`] || def.defaultModel

      return {
        provider: providerId,
        displayName: def.displayName,
        model: customModel,
        apiKeyEnv: keyInfo.keyEnv,
        apiKey: keyInfo.keyValue,
        baseURL: customBaseURL,
        protocol: def.protocol,
        contextWindow: def.contextWindow,
        source: `auto-detected:${keyInfo.keyEnv}`,
      }
    }
  }

  // 3. Fallback to DeepSeek Official Default
  const defaultDef = PROVIDER_REGISTRY.deepseek
  return {
    provider: 'deepseek',
    displayName: defaultDef.displayName,
    model: explicitModel || env.DEEPSEEK_MODEL || defaultDef.defaultModel,
    apiKeyEnv: defaultDef.primaryEnvKey,
    apiKey: env[defaultDef.primaryEnvKey],
    baseURL: env.DEEPSEEK_BASE_URL || defaultDef.baseURL,
    protocol: defaultDef.protocol,
    contextWindow: defaultDef.contextWindow,
    source: env[defaultDef.primaryEnvKey] ? 'auto-detected:DEEPSEEK_API_KEY' : 'default:deepseek',
  }
}
