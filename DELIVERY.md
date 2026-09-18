# WP-Harness: Delivery & Architecture Summary

**WP-Harness** is a production-ready, open-source (MIT) autonomous coding harness specialized for WordPress engineering, built upon the upstream DeepSeek Harness core (`deepseek-ai/deepseek-harness`). It equips autonomous coding agents with modern Block Theme scaffolding, instant PHP syntax validation, ephemeral in-memory WordPress testing via `@wp-playground/cli`, and universal multi-model routing.

---

## 1. Architecture Overview

```
wp-harness/
├── apps/
│   ├── cli/                     # dsh CLI runtime (bin.js, profile launchers)
│   └── web/                     # Interactive React/Vite web interface
├── packages/
│   ├── wp-mcp-server/           # Modern WordPress Model Context Protocol (MCP) Server
│   │   ├── src/tools/scaffold-theme.ts    # wp_scaffold_theme (theme.json v3, FSE templates)
│   │   ├── src/tools/check-php-syntax.ts  # check_php_syntax (php -l via WASM / native)
│   │   ├── src/tools/verify-playground.ts # verify_in_playground (ephemeral WP Playground)
│   │   └── src/tools/finish-task.ts       # finish_task (standards audit & dist/site.zip)
│   ├── universal-model-router/  # Dynamic Multi-Model Adapter & Cordis Overlay Generator
│   │   ├── src/router.ts        # Dynamic provider detection (DeepSeek, Anthropic, OpenAI, OpenRouter, Ollama)
│   │   └── src/cordis-overlay.ts# Cordis profile patch generation
│   ├── core/ ...                # Upstream Cordis agent loop & session engines
│   └── llm/ ...                 # Upstream LLM providers (llm-pi-ai, llm-deepseek)
├── skills/
│   ├── wordpress-fse-theme/               # FSE Block Theme development rules
│   └── wordpress-security-and-verification/# Mandatory Nonces, Escaping, & Sandbox checks
├── test-autonomous-wp.ts        # End-to-end autonomous WordPress verification test suite
└── .env.example                 # Universal API keys template
```

---

## 2. Universal Multi-Model API Key Configuration

WP-Harness includes dynamic model routing. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure **ANY** of the following providers in `.env`:

### Provider Options:
1. **DeepSeek Direct**:
   ```env
   DEEPSEEK_API_KEY=sk-your-deepseek-key
   # Optional: DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
   ```
2. **OpenRouter Universal** (Access DeepSeek R1, Claude 3.7, GPT-4o, Llama 3):
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
   ```
3. **Anthropic Direct**:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key
   ```
4. **OpenAI Direct**:
   ```env
   OPENAI_API_KEY=sk-proj-your-openai-key
   ```
5. **Local Ollama / vLLM / SGLang** (Zero-Cost Local Inference):
   ```env
   OLLAMA_BASE_URL=http://localhost:11434/v1
   OLLAMA_MODEL=qwen2.5-coder:32b
   ```

### Optional Explicit Overrides:
```env
WP_HARNESS_PROVIDER=openrouter
WP_HARNESS_MODEL=deepseek/deepseek-r1
```

---

## 3. How to Boot the Interactive Web Interface (`dsh web`)

1. Build the packages and frontend:
   ```bash
   pnpm run build
   ```
2. Launch the Web profile:
   ```bash
   pnpm dsh web
   # Or directly from source:
   node apps/cli/lib/bin.js web --port 3080
   ```
3. The server prints an authenticated link with your session token:
   ```
   dsh web: http://127.0.0.1:3080/?token=<generated-token>
   ```
   Open this URL in any modern browser to interact with the full web UI.

---

## 4. WordPress MCP Tools (`packages/wp-mcp-server`)

The WordPress MCP server exposes four tools compliant with the Model Context Protocol:

| Tool | Purpose | Key Inputs |
|---|---|---|
| `wp_scaffold_theme` | Scaffolds a modern Block Theme (`theme.json` v3, `style.css`, `templates/index.html`, `parts/header.html`, `parts/footer.html`, `functions.php`). | `themeName`, `slug`, `targetDirectory`, `paletteTheme` |
| `check_php_syntax` | Runs `php -l` and parses syntax errors into actionable JSON errors with line and column references. Runs via WebAssembly PHP when native PHP is absent. | `targetPath` |
| `verify_in_playground` | Mounts the workspace to `@wp-playground/cli` in-memory, executes a headless healthcheck, and asserts `HTTP 200` with ZERO PHP Fatal Errors and zero WSOD. | `themePath`, `port`, `timeoutMs` |
| `finish_task` | The terminal stopping tool that audits WordPress Coding Standards, nonces, input sanitization, and output escaping, then packages the site into `dist/site.zip`. | `themePath`, `distDirectory` |

---

## 5. End-to-End Test Results (`test-autonomous-wp.ts`)

The automated verification suite was executed to simulate an autonomous prompt:
> *"Create a modern Italian Restaurant website with menu custom post types, booking form, and dark gold theme"*

### Verification Results:
- **TypeScript Compilation (`pnpm build`)**: Passed with 0 errors across all 316 workspace projects.
- **Theme Scaffolding**: 7 core files created in `workspace/ristorante-bella-italia` (`style.css`, `theme.json` v3, `templates/index.html`, `parts/header.html`, `parts/footer.html`, `functions.php`, `readme.txt`).
- **PHP Syntax Check (`check_php_syntax`)**: 0 syntax errors detected across all PHP files using `@wp-playground/cli` WebAssembly PHP 8.3.
- **Coding Standards & Security Audit**: Nonces (`wp_verify_nonce`), input sanitization (`sanitize_text_field`, `absint`, `wp_unslash`), capability checks, and output escaping (`esc_html`, `esc_attr`) validated.
- **WP Playground Ephemeral Verification (`verify_in_playground`)**:
  - Headless WebAssembly server booted.
  - Theme auto-mounted and activated.
  - HTTP Status: **200 OK**.
  - Fatal PHP Errors: **0**.
  - WSOD / Critical Errors: **0**.
- **Packaging (`finish_task`)**: Generated production artifact `dist/site.zip` (11 files, 16.1 KB uncompressed, 6.9 KB zipped).

---

## 6. License
MIT License. Upstream core copyright DeepSeek AI. WP-Harness extensions copyright WP-Harness Contributors.
