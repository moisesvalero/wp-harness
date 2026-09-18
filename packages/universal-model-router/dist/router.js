/**
 * Dynamically resolves the active LLM provider and model configuration from ambient environment variables.
 * Allows switching providers seamlessly without hardcoding.
 */
export function resolveActiveModelRoute(env = process.env) {
    const explicitProvider = env.WP_HARNESS_PROVIDER?.toLowerCase();
    const explicitModel = env.WP_HARNESS_MODEL;
    // 1. Explicit Provider Selection
    if (explicitProvider) {
        switch (explicitProvider) {
            case 'openrouter':
                return {
                    provider: 'openrouter',
                    model: explicitModel || env.OPENROUTER_MODEL || 'deepseek/deepseek-r1',
                    apiKeyEnv: 'OPENROUTER_API_KEY',
                    apiKey: env.OPENROUTER_API_KEY,
                    baseURL: env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
                    protocol: 'openai-completions',
                    source: 'explicit:WP_HARNESS_PROVIDER=openrouter',
                };
            case 'anthropic':
                return {
                    provider: 'anthropic',
                    model: explicitModel || env.ANTHROPIC_MODEL || 'claude-3-7-sonnet-20250219',
                    apiKeyEnv: 'ANTHROPIC_API_KEY',
                    apiKey: env.ANTHROPIC_API_KEY,
                    baseURL: env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
                    protocol: 'anthropic-messages',
                    source: 'explicit:WP_HARNESS_PROVIDER=anthropic',
                };
            case 'openai':
                return {
                    provider: 'openai',
                    model: explicitModel || env.OPENAI_MODEL || 'gpt-4o',
                    apiKeyEnv: 'OPENAI_API_KEY',
                    apiKey: env.OPENAI_API_KEY,
                    baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
                    protocol: 'openai-completions',
                    source: 'explicit:WP_HARNESS_PROVIDER=openai',
                };
            case 'ollama':
                return {
                    provider: 'ollama',
                    model: explicitModel || env.OLLAMA_MODEL || 'qwen2.5-coder:32b',
                    apiKey: env.OLLAMA_API_KEY || 'ollama',
                    baseURL: env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
                    protocol: 'openai-completions',
                    source: 'explicit:WP_HARNESS_PROVIDER=ollama',
                };
            case 'deepseek':
            default:
                return {
                    provider: 'deepseek',
                    model: explicitModel || env.DEEPSEEK_MODEL || 'deepseek-chat',
                    apiKeyEnv: 'DEEPSEEK_API_KEY',
                    apiKey: env.DEEPSEEK_API_KEY,
                    baseURL: env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
                    protocol: 'openai-completions',
                    source: 'explicit:WP_HARNESS_PROVIDER=deepseek',
                };
        }
    }
    // 2. Dynamic Ambient Resolution (Auto-detection based on present API keys)
    if (env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY.trim().length > 0) {
        return {
            provider: 'openrouter',
            model: explicitModel || env.OPENROUTER_MODEL || 'deepseek/deepseek-r1',
            apiKeyEnv: 'OPENROUTER_API_KEY',
            apiKey: env.OPENROUTER_API_KEY,
            baseURL: env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
            protocol: 'openai-completions',
            source: 'auto-detected:OPENROUTER_API_KEY',
        };
    }
    if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.trim().length > 0) {
        return {
            provider: 'anthropic',
            model: explicitModel || env.ANTHROPIC_MODEL || 'claude-3-7-sonnet-20250219',
            apiKeyEnv: 'ANTHROPIC_API_KEY',
            apiKey: env.ANTHROPIC_API_KEY,
            baseURL: env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
            protocol: 'anthropic-messages',
            source: 'auto-detected:ANTHROPIC_API_KEY',
        };
    }
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.trim().length > 0) {
        return {
            provider: 'openai',
            model: explicitModel || env.OPENAI_MODEL || 'gpt-4o',
            apiKeyEnv: 'OPENAI_API_KEY',
            apiKey: env.OPENAI_API_KEY,
            baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
            protocol: 'openai-completions',
            source: 'auto-detected:OPENAI_API_KEY',
        };
    }
    if (env.OLLAMA_BASE_URL && env.OLLAMA_BASE_URL.trim().length > 0) {
        return {
            provider: 'ollama',
            model: explicitModel || env.OLLAMA_MODEL || 'qwen2.5-coder:32b',
            apiKey: env.OLLAMA_API_KEY || 'ollama',
            baseURL: env.OLLAMA_BASE_URL,
            protocol: 'openai-completions',
            source: 'auto-detected:OLLAMA_BASE_URL',
        };
    }
    // Fallback to DeepSeek Direct
    return {
        provider: 'deepseek',
        model: explicitModel || env.DEEPSEEK_MODEL || 'deepseek-chat',
        apiKeyEnv: 'DEEPSEEK_API_KEY',
        apiKey: env.DEEPSEEK_API_KEY,
        baseURL: env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        protocol: 'openai-completions',
        source: env.DEEPSEEK_API_KEY ? 'auto-detected:DEEPSEEK_API_KEY' : 'default:deepseek',
    };
}
//# sourceMappingURL=router.js.map