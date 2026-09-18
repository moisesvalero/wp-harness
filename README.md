# 🔨 WP Forge

> **Chat with an AI agent and build WordPress sites — no code required.**
> An open-source conversational WordPress development environment built on [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

---

[🇬🇧 English](README.md) | [🇪🇸 Español](README.es.md)

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange.svg)](https://pnpm.io/)
[![WordPress](https://img.shields.io/badge/WordPress-6.5%2B%20FSE-21759B.svg)](https://wordpress.org/)
[![WP Playground](https://img.shields.io/badge/Sandbox-WP%20Playground%20WASM-blue.svg)](https://wordpress.github.io/wordpress-playground/)

---

## What is WP Forge?

WP Forge is a **chat-based WordPress development agent** you run locally. Open it, describe what you want in plain language, and the agent builds it — themes, plugins, content — while verifying everything actually works in a live WordPress environment.

Think of it as having a senior WordPress developer available 24/7 through a chat interface, powered by the AI model of your choice.

```
You:    "Create a modern website for my Italian restaurant with a dark gold
         theme, a menu section, and a reservation form"

Agent:  "Building the theme now..."
        ✓ FSE Block Theme scaffolded (theme.json v3, Gutenberg templates)
        ✓ PHP syntax: 0 errors
        ✓ WordPress Playground: HTTP 200 OK, theme active, 0 fatal errors
        ✓ Packaged → dist/site.zip (ready to install on your WordPress)
```

---

## Features

- **Conversational interface** — same chat UI as Claude Desktop, Cursor, or Antigravity
- **WordPress-specialized agent** — knows FSE, Gutenberg, Coding Standards, security
- **Works without an installed WordPress** — uses WP Playground (WebAssembly) as sandbox
- **Connects to your live WordPress** — manage posts, pages, themes, plugins via REST API
- **Any LLM model** — OpenAI, Anthropic, Gemini, Groq, DeepSeek, Ollama, and more
- **Verified output** — never marks a task done without running it in WordPress first

---

## Quick Start

### Prerequisites

- Node.js 22+ and pnpm 10+
- An API key for at least one LLM provider (OpenAI, Anthropic, Gemini, etc.)

### 1. Clone

```bash
git clone https://github.com/moisesvalero/wp-harness.git
cd wp-harness
pnpm install
pnpm run build
```

### 2. Configure your API key

```bash
cp .env.wp-forge .env
```

Open `.env` and uncomment the line for your model provider:

```bash
# Pick ONE (or more):
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
# MISTRAL_API_KEY=...
# OLLAMA_BASE_URL=http://localhost:11434   ← for local models, no key needed
```

### 3. Launch

**On macOS (one-click):**
Double-click `WP Forge.command` in Finder.

**Or from Terminal:**
```bash
./start-wp-forge.sh
```

Your browser opens automatically at `http://127.0.0.1:3080/` with the **WP Forge** agent ready to chat.

---

## What you can build

| Ask the agent... | What happens |
|---|---|
| *"Create a blog theme with a minimal design"* | Generates FSE theme → verifies in WP Playground → delivers `site.zip` |
| *"Build a restaurant site with reservations"* | Scaffolds theme + reservation form + custom post types |
| *"Create a WooCommerce-ready theme"* | Generates theme with shop templates and product blocks |
| *"Publish a new post on my WordPress"* | Connects to your WP via REST API and creates the post |
| *"List all my installed plugins"* | Queries your WordPress and shows plugin list |
| *"Fix the PHP error in functions.php"* | Reads the file, fixes it, verifies syntax, done |

---

## Connecting to your live WordPress (optional)

To let the agent manage your actual WordPress site, add these to your `.env`:

```bash
WORDPRESS_SITE_URL=https://your-site.com
WORDPRESS_USERNAME=admin
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

> **How to get Application Password:** WordPress Admin → Users → Your Profile → Application Passwords → Add New

Once configured, the agent has access to 50+ WordPress management tools (posts, pages, media, themes, plugins, menus, users, settings, and more) via the [mcp-wordpress](https://github.com/docdyhr/mcp-wordpress) server.

---

## 🎯 Model Selection & Switching

You have complete freedom to choose any model directly from the UI:

1. **Composer Dropdown Menu:** In the prompt input bar, click on the model name badge (defaults to `OpenAI GPT-6 Astra`). A popup menu lets you pick any available model.
   - **Auto-Persist:** Whichever model you pick is automatically saved as your **default model for all future sessions**!
2. **Slash Command `/model`:** Type `/model` into the chat box to trigger the quick fuzzy search and switch models instantly via keyboard.
3. **Settings Panel (⚙️ Settings → Models):** View, customize, or add extra model endpoints and custom API keys at any time.

---

## Supported LLM Providers & 2026 Flagships

WP Forge supports **15+ AI providers** and features live-verified **2026 cutting-edge flagships** with a strict `maxOutputTokens: 4096` guard to prevent OpenRouter `402 Payment Required` rejections:

### 🌟 2026 Flagships (OpenRouter & Direct)
| Model | Context Window | Best For |
|---|---|---|
| **OpenAI GPT-6 Astra** *(Default)* | 1.05M tokens | Premier agentic coding, reasoning, and FSE architecture |
| **OpenAI GPT-6 Astra Pro** | 1.05M tokens | Complex full-stack plugins and database migrations |
| **Anthropic Claude Fable 5.1** | 1.00M tokens | Extended-context architectural design and deep review |
| **Anthropic Claude Opus 5** | 1.00M tokens | Multi-step autonomous reasoning and logic verification |
| **Google Gemini 3.8 Flash** | 1.05M tokens | Ultra-fast token generation with massive 1M context |
| **Google Gemini 3.7 Flash** | 1.05M tokens | Balanced high-speed multimodal agentic flow |
| **DeepSeek V4.1 Flash** | 1.05M tokens | High-throughput coding and autonomous tool execution |
| **DeepSeek V4 Pro** | 1.05M tokens | High-precision code analysis and debugging |
| **Qwen 3.8 Flash** | 1.00M tokens | Specialized coding, PHP syntax, and block patterns |

### 🆓 OpenRouter Free Models ($0 Credit Cost)
Zero-credit models verified for agentic workflows:
- `openrouter/free` — Intelligent auto-router across free tier models
- `deepseek/deepseek-v4-flash-0731:free` — 1M context with zero token cost
- `cohere/north-mini-code:free` — Code-optimized free model
- `nvidia/nemotron-3.5-lightning:free` — 1M context ultra-fast free tier

### 🔌 All 15 Integrated Providers
| Provider | Default / Flagship | Key |
|---|---|---|
| **OpenRouter** | GPT-6 Astra, Claude Fable 5.1, Gemini 3.8, Free Collection | `OPENROUTER_API_KEY` |
| **OpenAI** | GPT-6 Astra, GPT-6 Astra Pro, o3-mini | `OPENAI_API_KEY` |
| **Anthropic** | Claude Fable 5.1, Claude Opus 5 | `ANTHROPIC_API_KEY` |
| **Google** | Gemini 3.8 Flash, Gemini 3.7 Flash | `GOOGLE_API_KEY` / `GEMINI_API_KEY` |
| **DeepSeek** | DeepSeek V4.1 Flash, DeepSeek V4 Pro | `DEEPSEEK_API_KEY` |
| **Groq** | Llama 3.3 70B, Mixtral 8x7B | `GROQ_API_KEY` |
| **Mistral** | Mistral Large, Codestral | `MISTRAL_API_KEY` |
| **Cohere** | Command R+, North Mini Code | `COHERE_API_KEY` |
| **xAI** | Grok-3 | `XAI_API_KEY` |
| **Together AI** | Llama, Qwen, DeepSeek open weights | `TOGETHER_API_KEY` |
| **Fireworks AI** | DeepSeek V4, Qwen 3.8 | `FIREWORKS_API_KEY` |
| **Perplexity** | Sonar Pro, Sonar Reasoning | `PERPLEXITY_API_KEY` |
| **Cerebras** | Llama 3.3 70B (ultra-fast) | `CEREBRAS_API_KEY` |
| **DeepInfra** | DeepSeek V4, R1 | `DEEPINFRA_API_KEY` |
| **Ollama** | Local offline models (no API key required) | `OLLAMA_BASE_URL` |

Switch between providers and models at any time directly from the chat UI.

---

## How it works

```
┌─────────────────────────────────────────────────────┐
│                   WP Forge (UI)                     │
│         Chat interface — runs in your browser       │
└───────────────────┬─────────────────────────────────┘
                    │ natural language
┌───────────────────▼─────────────────────────────────┐
│              WP Forge Agent (dsh)                   │
│    Senior WordPress developer persona               │
│    Knows FSE, security standards, Gutenberg         │
└──────────┬──────────────────┬───────────────────────┘
           │                  │
┌──────────▼──────┐  ┌────────▼───────────────────────┐
│  wp-forge-tools │  │      mcp-wordpress              │
│  (local MCP)    │  │  (REST API — optional)          │
│                 │  │                                 │
│ • scaffold FSE  │  │ • posts / pages / media         │
│ • lint PHP WASM │  │ • themes / plugins / menus      │
│ • WP Playground │  │ • users / settings / taxonomies │
│ • package .zip  │  │ • 50+ WordPress tools           │
└─────────────────┘  └─────────────────────────────────┘
```

---

## WordPress Agent Skills

The WP Forge agent loads two specialized skill sets automatically:

### `wordpress-fse-theme`
Rules for building modern Full Site Editing (FSE) block themes:
- `theme.json` v3 with semantic design tokens, fluid typography, color palettes
- Gutenberg block templates (`.html`) — never classic PHP in templates
- Custom Post Types with `show_in_rest: true` for Block Editor compatibility
- Block patterns, template parts, query loops

### `wordpress-security-and-verification`
Mandatory security standards enforced on all generated code:
- Output: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
- Input: `sanitize_text_field()`, `absint()`, `wp_unslash()`
- Forms: `wp_nonce_field()` + `check_admin_referer()` on every submit
- DB: `$wpdb->prepare()` on every dynamic query
- Auth: `current_user_can()` before every privileged action
- **No task is marked done without WP Playground verification**

---

## Repository Structure

```
wp-harness/
├── apps/
│   └── cli/                      # DeepSeek Harness CLI (lib/bin.js)
├── packages/
│   ├── preset/agent-presets/
│   │   └── presets/wp-forge/     # WP Forge agent preset
│   │       ├── preset.yml        # Preset metadata
│   │       ├── agent.cordis.yml  # Plugin composition
│   │       └── skills/           # WordPress FSE + Security skills
│   ├── universal-model-router/   # Multi-model gateway (15 providers)
│   └── wp-mcp-server/            # WordPress MCP tools (scaffold, lint, sandbox)
├── .dsh/profiles/wp-forge/       # Profile config (MCP servers, branding)
├── start-wp-forge.sh             # One-click launch script
├── .env.wp-forge                 # API key template
└── test-autonomous-wp.ts         # End-to-end verification suite
```

---

## Run the verification suite

```bash
pnpm test:wp
```

Scaffolds a complete Italian Restaurant theme, lints PHP via WebAssembly, boots it in WP Playground, asserts HTTP 200 + zero PHP errors, and exports `dist/site.zip`.

---

## Development

```bash
# Build all packages
pnpm run build

# Build only the WordPress MCP server
pnpm --filter @wp-harness/wp-mcp-server build

# Run WordPress verification pipeline
pnpm test:wp

# Inspect the WP Forge profile configuration
node apps/cli/lib/bin.js wp-forge --dump-config
```

---

## License & Credits

MIT License — [LICENSE](LICENSE)

Built on top of:
- **[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** — the open-source agent framework
- **[mcp-wordpress](https://github.com/docdyhr/mcp-wordpress)** — 50+ WordPress MCP tools
- **[WordPress Playground](https://wordpress.github.io/wordpress-playground/)** — WebAssembly WordPress runtime

---

*Maintained by [Moisés Valero](https://github.com/moisesvalero)*
