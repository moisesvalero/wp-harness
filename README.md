# WP-Harness 🚀

**Autonomous WordPress FSE Block Theme & Site Generation Engine**
*Built on DeepSeek Harness (`dsh`), Cordis Microkernel, Universal Multi-Model Routing, and Ephemeral WebAssembly Sandboxing.*

---

[English](README.md) | [🇪🇸 Español](README.es.md) | [中文](README.zh.md)

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.19.0%20%7C%7C%20%3E%3D20.19.0-brightgreen.svg)](https://nodejs.org/)
[![Package Manager](https://img.shields.io/badge/pnpm-10%2B-orange.svg)](https://pnpm.io/)
[![WordPress Version](https://img.shields.io/badge/WordPress-6.5%20%7C%206.7%20FSE-21759B.svg)](https://wordpress.org/)
[![Sandbox: WebAssembly](https://img.shields.io/badge/Sandbox-WP%20Playground%20WASM-purple.svg)](https://wordpress.github.io/wordpress-playground/)
[![Architecture](https://img.shields.io/badge/Architecture-Cordis%20Everything--is--a--Plugin-informational.svg)](https://github.com/cordiverse/cordis)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Prerequisites & Quick Start](#-prerequisites--quick-start)
- [Universal Multi-Model Configuration](#-universal-multi-model-configuration)
- [WordPress MCP Server Tooling](#-wordpress-mcp-server-tooling)
- [Agent Skills & Coding Standards](#-agent-skills--coding-standards)
- [Autonomous Verification Pipeline](#-autonomous-verification-pipeline)
- [CLI & Web UI Usage](#-cli--web-ui-usage)
- [Repository Structure](#-repository-structure)
- [Security & Quality Assurance](#-security--quality-assurance)
- [Attribution & License](#-attribution--license)

---

## 🌟 Overview

**WP-Harness** is an enterprise-grade autonomous agent harness specifically engineered to design, build, audit, and package modern **WordPress Full Site Editing (FSE) Block Themes** and full website architectures from a single prompt.

Originating from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) and powered by the [Cordis](https://github.com/cordiverse/cordis) microkernel, WP-Harness elevates agentic WordPress development by solving key real-world challenges:

1. **Zero Host PHP/MySQL Requirements**: Leverages `@wp-playground/cli` to boot an ephemeral, isolated WordPress instance directly inside WebAssembly (WASM) for syntax linting, health checking, and visual testing.
2. **Universal Multi-Model Gateway**: Seamlessly routes tasks between **DeepSeek** (`deepseek-chat`, `deepseek-reasoner`), **OpenRouter**, **Anthropic** (Claude 3.7 Sonnet / 3.5 Sonnet), **OpenAI** (GPT-4o, o3-mini), and local self-hosted **Ollama** instances with automated Cordis configuration patching.
3. **Dedicated WordPress Model Context Protocol (MCP)**: Native tools for block scaffolding, automated theme validation, headless playground testing, and production zip artifact bundling.
4. **Strict Architectural Skills**: Pre-configured agent personas enforcing WordPress standards: `theme.json` v3 schema compliance, HTML block patterns, block markup without deprecations, semantic accessibility (WCAG 2.1 AA), and robust security escaping.

---

## ✨ Key Features

- **Single-Prompt Autonomous Generation**: Create fully realized, production-ready block themes complete with `templates/`, `parts/`, `patterns/`, `theme.json`, and `functions.php`.
- **Ephemeral WebAssembly Verification Sandbox**: Every generated theme is automatically booted in `@wp-playground/cli` (WordPress 6.7 on PHP 8.3 via WASM). Validates HTTP 200 OK responses, rendering integrity, and zero fatal PHP errors before delivery.
- **Universal Multi-Model Router**: Built-in routing package (`@wp-harness/universal-model-router`) allowing instant fallback, dynamic Cordis YAML profile patching, and environment-variable-driven key management.
- **WordPress MCP Server**: Exposes standard Model Context Protocol endpoints (`wp_scaffold_theme`, `check_php_syntax`, `verify_in_playground`, `finish_task`) designed for autonomous agents.
- **Enterprise Block Theme Standards**: Strict validation for `theme.json` (version 3), Gutenberg block markup (`<!-- wp:... -->`), custom block patterns, translations ready (`esc_html__`, `esc_attr__`), and asset registration.
- **Dual User Interface**: Run headlessly in CI/CD terminal loops or interactively via the built-in Cordis Web Dashboard (`dsh web`).

---

## 🏗 System Architecture

```mermaid
flowchart TD
    UserPrompt["👤 User Natural Language Prompt"] --> HarnessCLI["⚡ WP-Harness CLI / Web UI (apps/cli)"]

    subgraph CoreEngine["DeepSeek Harness + Cordis Microkernel"]
        HarnessCLI --> AgentRuntime["Autonomous Agent Runtime (packages/core)"]
        AgentRuntime --> SkillsEngine["Skills & Rules Engine (.agents/skills)"]
        AgentRuntime --> ModelRouter["Universal Model Router (packages/universal-model-router)"]
    end

    subgraph LLMProviders["Universal Multi-Model Layer"]
        ModelRouter --> DeepSeek["DeepSeek (V3 / R1)"]
        ModelRouter --> OpenRouter["OpenRouter Gateway"]
        ModelRouter --> Anthropic["Anthropic (Claude 3.7/3.5)"]
        ModelRouter --> OpenAI["OpenAI (GPT-4o / o3-mini)"]
        ModelRouter --> Ollama["Ollama Local LLMs"]
    end

    subgraph MCP["WordPress MCP Server (packages/wp-mcp-server)"]
        AgentRuntime --> ToolScaffold["wp_scaffold_theme"]
        AgentRuntime --> ToolLint["check_php_syntax (PHP WASM)"]
        AgentRuntime --> ToolPlayground["verify_in_playground"]
        AgentRuntime --> ToolFinish["finish_task (Zip Packaging)"]
    end

    subgraph EphemeralSandbox["Ephemeral Verification Sandbox (@wp-playground/cli)"]
        ToolPlayground --> WasmWP["WordPress 6.7 + PHP 8.3 in WebAssembly"]
        WasmWP --> HealthCheck["HTTP 200 Assertion & Fatal Error Audit"]
    end

    ToolFinish --> DistArtifact["📦 Production Ready site.zip (dist/site.zip)"]
```

---

## 🚀 Prerequisites & Quick Start

### System Requirements

- **Operating System**: macOS (Apple Silicon / Intel), Linux (x86_64 / arm64), or Windows (PowerShell 7)
- **Node.js**: `^22.19.0` or `>=20.19.0`
- **pnpm**: `>=10.0.0`
- **Host PHP**: **Not required!** (WebAssembly provides the isolated PHP 8.3 execution runtime).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moisesvalero/wp-harness.git
   cd wp-harness
   ```

2. **Install all monorepo dependencies**:
   ```bash
   pnpm install
   ```

3. **Build native packages and client artifacts**:
   ```bash
   pnpm run build
   ```

4. **Verify the installation via autonomous self-test**:
   ```bash
   pnpm test:wp
   ```
   *This command runs the autonomous benchmark pipeline: scaffolds an Italian Restaurant FSE block theme, checks PHP syntax via WebAssembly, boots WordPress Playground, asserts HTTP 200 with zero fatal errors, and packages `dist/site.zip`.*

---

## 🔑 Universal Multi-Model Configuration

WP-Harness includes a dynamic multi-provider routing layer located in `packages/universal-model-router`. It decouples the agent from single-vendor lock-in.

### 1. Configure Environment Variables

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Populate the keys for your preferred provider(s):

```ini
# --- Universal Multi-Model Provider Keys ---
DEEPSEEK_API_KEY=sk-your-deepseek-key
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key
OPENAI_API_KEY=sk-proj-your-openai-key

# --- Local Ollama Support ---
OLLAMA_BASE_URL=http://127.0.0.1:11434

# --- Routing Preferences ---
DEFAULT_MODEL_PROVIDER=deepseek  # Options: deepseek, openrouter, anthropic, openai, ollama
DEFAULT_MODEL_NAME=deepseek-chat
```

### 2. Provider Capabilities & Fallback Matrix

| Provider | Recommended Model | Reasoning / Planning Model | Context Window |
| :--- | :--- | :--- | :--- |
| **DeepSeek** | `deepseek-chat` (V3) | `deepseek-reasoner` (R1) | 64k tokens |
| **Anthropic** | `claude-3-7-sonnet` | `claude-3-7-sonnet-thinking` | 200k tokens |
| **OpenRouter** | `anthropic/claude-3.5-sonnet` | `deepseek/deepseek-r1` | Dynamic |
| **OpenAI** | `gpt-4o` | `o3-mini` / `o1` | 128k - 200k |
| **Ollama** | `qwen2.5-coder:32b` | `deepseek-r1:32b` | Local / Offline |

### 3. Dynamic Cordis Profile Patching

Apply your configured model settings to the active Cordis agent profile:

```bash
pnpm --filter @wp-harness/universal-model-router route --patch
```

---

## 🛠 WordPress MCP Server Tooling

The dedicated Model Context Protocol server (`packages/wp-mcp-server`) provides autonomous agents with purpose-built WordPress primitives:

| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `wp_scaffold_theme` | `themeName`, `slug`, `author`, `description`, `targetDir` | Generates standard FSE structure: `style.css`, `theme.json` (v3), `functions.php`, `templates/index.html`, `parts/header.html`, `parts/footer.html`, and `patterns/`. |
| `check_php_syntax` | `filePath` | Runs non-destructive PHP syntax checks (`php -l`). Automatically falls back to `@wp-playground/cli php -- -l` WebAssembly runner if no host PHP is detected. |
| `verify_in_playground`| `themePath`, `port` (default: 8088), `timeoutMs` | Headlessly mounts the theme in `@wp-playground/cli`, polls the server until online, verifies an `HTTP 200 OK` response, and audits stdout/stderr for fatal errors or missing assets. |
| `finish_task` | `themePath`, `outputZipPath` | Executes code standards audit (FSE hierarchy, nonces, escaping) and compiles a distributable production archive (`dist/site.zip`). |

---

## 🧠 Agent Skills & Coding Standards

WP-Harness includes pre-configured autonomous skills in `skills/` (and automatically synced to `.agents/skills/`):

### 1. `wordpress-fse-theme`
- **Block Templates**: Standard HTML template markup using valid Gutenberg comments (`<!-- wp:template-part {"slug":"header"} /-->`, `<!-- wp:group {"layout":{"type":"constrained"}} -->`).
- **`theme.json` v3**: Semantic design tokens (color palettes, fluid typography, spacing presets, shadow definitions, and block-level style overrides).
- **Block Patterns**: PHP pattern registration via `register_block_pattern()` with category definitions and contextual keywords.

### 2. `wordpress-security-and-verification`
- **Output Escaping**: Mandatory usage of `esc_html()`, `esc_attr()`, `esc_url()`, and `wp_kses_post()`. Never raw `echo $var;`.
- **Request Verification**: Verification of nonces using `check_admin_referer()` or `wp_verify_nonce()`.
- **Access Control**: Capability checks (`current_user_can()`) before performing privileged operations.
- **Zero Deprecations**: Avoids legacy shortcodes, PHP 4 constructors, and outdated widget APIs.

---

## 🧪 Autonomous Verification Pipeline

WP-Harness includes an automated end-to-end benchmark suite:

```bash
pnpm test:wp
```

### What Happens Under the Hood:

1. **Scaffold**: Generates a complete Italian Restaurant block theme (`wp-harness-demo`) with responsive navigation, hero banner, menu catalog pattern, and reservation form.
2. **Lint**: Audits every PHP script using `@wp-playground/cli`'s WebAssembly PHP 8.3 engine.
3. **Sandbox Boot**: Starts an ephemeral WordPress 6.7 environment via:
   ```bash
   npx @wp-playground/cli server --port 8088 --auto-mount /path/to/theme --verbosity normal
   ```
4. **Health Check**: Pings `http://127.0.0.1:8088`, asserts `HTTP 200 OK`, checks for theme activation, and confirms absence of PHP warnings or fatal errors.
5. **Package**: Generates a standalone, distributable `dist/site.zip` ready for direct upload to any live WordPress site.

---

## 💻 CLI & Web UI Usage

### 1. Interactive Web Dashboard

Launch the Cordis-powered Web UI:

```bash
node apps/cli/lib/bin.js web --port 3888
# or
pnpm dsh web --port 3888
```

Open your browser at `http://127.0.0.1:3888`. The dashboard provides real-time tool visualization, multi-turn agent conversations, and diff inspection.

### 2. Headless Autonomous Execution

Run tasks directly from the command line:

```bash
node apps/cli/lib/bin.js run "Create an ultra-modern portfolio block theme for an architectural firm with dark mode support and interactive project grid."
```

---

## 📁 Repository Structure

```
wp-harness/
├── apps/
│   └── cli/                      # DeepSeek Harness CLI entry point (lib/bin.js)
├── packages/
│   ├── client/                   # Core agent client components
│   ├── core/                     # Cordis orchestration engine & agent lifecycle
│   ├── host/                     # Host OS bindings & native system integration
│   ├── preset/                   # Agent presets & pre-configured behaviors
│   ├── universal-model-router/   # Multi-model gateway (DeepSeek, Claude, OpenAI, Ollama)
│   │   ├── src/router.ts         # Model routing and fallback logic
│   │   └── src/patcher.ts        # Cordis profile YAML generator
│   └── wp-mcp-server/            # WordPress Model Context Protocol Server
│       ├── src/server.ts         # MCP Server definition
│       └── src/tools/            # Scaffold, PHP WASM lint, Playground & Zip tools
├── skills/
│   ├── wordpress-fse-theme/      # FSE theme architecture skill & guidelines
│   └── wordpress-security/       # Security, escaping, nonces & verification skill
├── .agents/skills/               # Active agent runtime skills directory
├── test-autonomous-wp.ts         # Autonomous end-to-end verification pipeline
├── tsdown.config.ts              # Monorepo build and bundling configuration
├── pnpm-workspace.yaml           # pnpm multi-package definitions
└── .env.example                  # Multi-model environment variable template
```

---

## 🔒 Security & Quality Assurance

- **Zero Credential Exposure**: Never commit `.env` or sensitive API keys. CI pipelines and git hooks inspect commits with regex filters (`api_key|token|secret|password`).
- **Sandboxed Execution**: Autonomous verification is performed within an ephemeral WebAssembly container without touching host files or network ports beyond localhost.
- **Sanitized Outputs**: WordPress themes produced by WP-Harness strictly adhere to WordPress VIP coding guidelines and the WordPress.org Theme Review Standards.

---

## 🤝 Attribution & License

WP-Harness is open-source software licensed under the **[MIT License](LICENSE)**.

### Acknowledgments
- **[DeepSeek AI](https://deepseek.com)**: For the groundbreaking [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) agent architecture.
- **[Cordiverse](https://github.com/cordiverse/cordis)**: For the spatiotemporal composability plugin framework.
- **[WordPress Playground](https://wordpress.github.io/wordpress-playground/)**: For the WebAssembly WordPress runtime enabling zero-install sandbox verification.

---

*Maintained by [Moisés Valero](https://github.com/moisesvalero).*
