# WP-Harness 🚀

**Motor Autónomo de Generación de Sitios y Block Themes FSE para WordPress**
*Construido sobre DeepSeek Harness (`dsh`), Microkernel Cordis, Enrutamiento Multi-Modelo Universal y Sandbox Efímero en WebAssembly.*

---

[English](README.md) | [🇪🇸 Español](README.es.md) | [中文](README.zh.md)

---

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Versión Node.js](https://img.shields.io/badge/node-%3E%3D22.19.0%20%7C%7C%20%3E%3D20.19.0-brightgreen.svg)](https://nodejs.org/)
[![Gestor de paquetes](https://img.shields.io/badge/pnpm-10%2B-orange.svg)](https://pnpm.io/)
[![Versión de WordPress](https://img.shields.io/badge/WordPress-6.5%20%7C%206.7%20FSE-21759B.svg)](https://wordpress.org/)
[![Sandbox: WebAssembly](https://img.shields.io/badge/Sandbox-WP%20Playground%20WASM-purple.svg)](https://wordpress.github.io/wordpress-playground/)
[![Arquitectura](https://img.shields.io/badge/Arquitectura-Cordis%20Everything--is--a--Plugin-informational.svg)](https://github.com/cordiverse/cordis)

---

## 📖 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Requisitos Previos e Inicio Rápido](#-requisitos-previos-e-inicio-rápido)
- [Configuración Multi-Modelo Universal](#-configuración-multi-modelo-universal)
- [Servidor WordPress MCP (Herramientas del Agente)](#-servidor-wordpress-mcp-herramientas-del-agente)
- [Skills del Agente y Estándares de Código](#-skills-del-agente-y-estándares-de-código)
- [Pipeline Autónomo de Verificación](#-pipeline-autónomo-de-verificación)
- [Uso de la Interfaz Web y CLI](#-uso-de-la-interfaz-web-y-cli)
- [Estructura del Repositorio](#-estructura-del-repositorio)
- [Seguridad y Garantía de Calidad](#-seguridad-y-garantía-de-calidad)
- [Atribución y Licencia](#-atribución-y-licencia)

---

## 🌟 Visión General

**WP-Harness** es un arnés de agentes autónomos de nivel empresarial diseñado específicamente para concebir, desarrollar, auditar y empaquetar **Block Themes modernos de WordPress (Full Site Editing - FSE)** y arquitecturas web completas a partir de un único prompt en lenguaje natural.

Originado a partir de [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) y orquestado mediante el microkernel [Cordis](https://github.com/cordiverse/cordis), WP-Harness resuelve los principales desafíos del desarrollo autónomo para WordPress:

1. **Cero Dependencia de PHP o MySQL en el Host**: Integra `@wp-playground/cli` para levantar instancias aisladas y efímeras de WordPress ejecutadas en WebAssembly (WASM) dentro de Node.js, permitiendo validaciones sintácticas, pruebas de renderizado y auditorías de salud sin necesidad de instalar PHP ni bases de datos locales.
2. **Pasarela Multi-Modelo Universal**: Enrutamiento dinámico y conmutación por error entre **DeepSeek** (`deepseek-chat`, `deepseek-reasoner`), **OpenRouter**, **Anthropic** (Claude 3.7 Sonnet / 3.5 Sonnet), **OpenAI** (GPT-4o, o3-mini) y modelos locales auto-hospedados mediante **Ollama**, con parcheo automático de perfiles YAML en Cordis.
3. **Servidor Dedicado WordPress MCP (Model Context Protocol)**: Herramientas nativas para la creación de plantillas de bloques, validación de sintaxis PHP en WebAssembly, tests de arranque en WordPress Playground y empaquetado de producción en `.zip`.
4. **Skills y Reglas Especializadas**: Agentes con directivas estrictas para WordPress: cumplimiento del esquema `theme.json` v3, plantillas y partes de bloques semánticos, patrones de bloques Gutenberg, accesibilidad WCAG 2.1 AA y escapado de seguridad estricto.

---

## ✨ Características Principales

- **Generación Autónoma desde un Único Prompt**: Crea temas de bloques listos para producción con `templates/`, `parts/`, `patterns/`, `theme.json` y `functions.php`.
- **Sandbox Efímero de Verificación en WebAssembly**: Cada tema generado se arranca de forma autónoma en `@wp-playground/cli` (WordPress 6.7 sobre PHP 8.3 en WASM), comprobando respuestas `HTTP 200 OK`, consistencia de renderizado y ausencia total de errores fatales en PHP antes de su entrega.
- **Enrutador Multi-Modelo Universal**: Paquete interno (`@wp-harness/universal-model-router`) con gestión desacoplada de proveedores mediante variables de entorno y generador de parches de perfil para Cordis.
- **Servidor MCP para WordPress**: Expone herramientas estándar de protocolo de contexto (`wp_scaffold_theme`, `check_php_syntax`, `verify_in_playground`, `finish_task`) optimizadas para modelos de lenguaje.
- **Estándares Modernos FSE**: Cumplimiento de especificación `theme.json` versión 3, comentarios de bloque Gutenberg (`<!-- wp:... -->`), registro de patrones contextuales y preparación para internacionalización (`esc_html__`, `esc_attr__`).
- **Doble Interfaz de Usuario**: Ejecución desatendida en terminal para flujos CI/CD o interactiva mediante el panel de control web de Cordis (`dsh web`).

---

## 🏗 Arquitectura del Sistema

```mermaid
flowchart TD
    UserPrompt["👤 Prompt del Usuario en Lenguaje Natural"] --> HarnessCLI["⚡ CLI / Web UI de WP-Harness (apps/cli)"]

    subgraph CoreEngine["DeepSeek Harness + Microkernel Cordis"]
        HarnessCLI --> AgentRuntime["Runtime del Agente Autónomo (packages/core)"]
        AgentRuntime --> SkillsEngine["Motor de Reglas y Skills (.agents/skills)"]
        AgentRuntime --> ModelRouter["Router Multi-Modelo (packages/universal-model-router)"]
    end

    subgraph LLMProviders["Capa de Modelos Universales"]
        ModelRouter --> DeepSeek["DeepSeek (V3 / R1)"]
        ModelRouter --> OpenRouter["OpenRouter Gateway"]
        ModelRouter --> Anthropic["Anthropic (Claude 3.7/3.5)"]
        ModelRouter --> OpenAI["OpenAI (GPT-4o / o3-mini)"]
        ModelRouter --> Ollama["Ollama (LLMs Locales)"]
    end

    subgraph MCP["Servidor WordPress MCP (packages/wp-mcp-server)"]
        AgentRuntime --> ToolScaffold["wp_scaffold_theme"]
        AgentRuntime --> ToolLint["check_php_syntax (PHP WASM)"]
        AgentRuntime --> ToolPlayground["verify_in_playground"]
        AgentRuntime --> ToolFinish["finish_task (Empaquetado Zip)"]
    end

    subgraph EphemeralSandbox["Sandbox Efímero de Verificación (@wp-playground/cli)"]
        ToolPlayground --> WasmWP["WordPress 6.7 + PHP 8.3 en WebAssembly"]
        WasmWP --> HealthCheck["Aserción HTTP 200 y Auditoría de Errores Fatales"]
    end

    ToolFinish --> DistArtifact["📦 Tema Listo para Producción (dist/site.zip)"]
```

---

## 🚀 Requisitos Previos e Inicio Rápido

### Requisitos del Sistema

- **Sistema Operativo**: macOS (Apple Silicon / Intel), Linux (x86_64 / arm64) o Windows (PowerShell 7).
- **Node.js**: `^22.19.0` o `>=20.19.0`.
- **pnpm**: `>=10.0.0`.
- **PHP en el Host**: **¡No es necesario!** (El entorno WebAssembly incluye el runtime de PHP 8.3 aislado).

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/moisesvalero/wp-harness.git
   cd wp-harness
   ```

2. **Instalar dependencias del monorepo**:
   ```bash
   pnpm install
   ```

3. **Compilar paquetes nativos y artefactos cliente**:
   ```bash
   pnpm run build
   ```

4. **Ejecutar el test autónomo de validación**:
   ```bash
   pnpm test:wp
   ```
   *Este comando ejecuta el pipeline completo de benchmark: genera un tema FSE para restaurante italiano, valida la sintaxis PHP vía WebAssembly, levanta WordPress Playground, verifica respuesta HTTP 200 sin errores fatales y compila `dist/site.zip`.*

---

## 🔑 Configuración Multi-Modelo Universal

WP-Harness integra una capa de enrutamiento desacoplada en `packages/universal-model-router` que elimina el bloqueo de proveedor. Detecta automáticamente las API keys del entorno y enruta las tareas de generación autónoma al modelo fundacional más adecuado.

### 1. Variables de Entorno

Copia la plantilla `.env.example` a `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Configura las credenciales de tu proveedor preferido (o define varias para disponer de respaldo automático).

### 2. Matriz Exhaustiva de Capacidades (15 Proveedores)

| Proveedor | Modelo Recomendado (Código) | Modelo de Razonamiento / Planificación | Variable de Entorno | Protocolo y Contexto | Ventaja Clave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini** | `gemini-2.5-pro` | `gemini-2.5-pro` | `GEMINI_API_KEY` | OpenAI Comp. (1M+) | Ventana masiva de 1M+ tokens y razonamiento multimodal |
| **Mistral / Codestral** | `codestral-latest` | `mistral-large-latest` | `MISTRAL_API_KEY` | OpenAI Comp. (256k) | Especializado en código, patrones de bloques FSE y multilingüe |
| **Cohere Command** | `command-r-plus-08-2024` | `command-r-plus` | `COHERE_API_KEY` | OpenAI Comp. (128k) | Command R+ razonamiento empresarial y planificación multi-paso |
| **Groq LPU** | `llama-3.3-70b-versatile` | `deepseek-r1-distill-llama-70b` | `GROQ_API_KEY` | OpenAI Comp. (128k) | Inferencia ultra-rápida LPU para ciclos autónomos casi instantáneos |
| **Anthropic Claude** | `claude-3-7-sonnet-20250219` | `claude-3-7-sonnet` (thinking) | `ANTHROPIC_API_KEY` | Anthropic Msg. (200k) | Pensamiento híbrido, precisión en refactors y liderazgo en código |
| **OpenAI** | `gpt-4o` | `o3-mini` / `o1` | `OPENAI_API_KEY` | OpenAI Comp. (128k) | Razonamiento de referencia y salidas estructuradas deterministas |
| **OpenRouter** | `deepseek/deepseek-r1` | `anthropic/claude-3.7-sonnet` | `OPENROUTER_API_KEY` | OpenAI Comp. (Dinámico) | Pasarela agregadora a más de 200 modelos con conmutación dinámica |
| **Together AI** | `deepseek-ai/DeepSeek-V3` | `deepseek-ai/DeepSeek-R1` | `TOGETHER_API_KEY` | OpenAI Comp. (128k) | Inferencia serverless en la nube para modelos de pesos abiertos |
| **xAI Grok** | `grok-2-1212` | `grok-2-vision-1212` | `XAI_API_KEY` | OpenAI Comp. (128k) | Modelos Grok de frontera con alta velocidad y capacidades de visión |
| **Cerebras** | `llama-3.3-70b` | `llama-3.3-70b` | `CEREBRAS_API_KEY` | OpenAI Comp. (128k) | Clúster a escala de oblea con velocidad récord mundial de tokens |
| **Fireworks AI** | `accounts/fireworks/models/deepseek-v3` | `accounts/fireworks/models/deepseek-r1` | `FIREWORKS_API_KEY` | OpenAI Comp. (128k) | Motor de inferencia para producción de DeepSeek y Qwen Coder |
| **Perplexity** | `sonar-pro` | `sonar-reasoning-pro` | `PERPLEXITY_API_KEY` | OpenAI Comp. (128k) | Modelos Sonar con búsqueda activa en web para documentación viva |
| **DeepInfra** | `deepseek-ai/DeepSeek-V3` | `deepseek-ai/DeepSeek-R1` | `DEEPINFRA_API_KEY` | OpenAI Comp. (128k) | Alojamiento serverless en GPU de alto rendimiento y bajo coste |
| **Local Ollama** | `qwen2.5-coder:32b` | `deepseek-r1:32b` | `OLLAMA_BASE_URL` | OpenAI Comp. (32k) | Modelos 100% locales, privados y sin coste de llamadas a API |
| **DeepSeek Oficial** | `deepseek-chat` (V3) | `deepseek-reasoner` (R1) | `DEEPSEEK_API_KEY` | Native SSE / OpenAI (64k) | Proveedor oficial directo con streaming nativo SSE de alto rendimiento |

### 3. Inspección en CLI y Parcheo Dinámico de Perfiles en Cordis

Inspecciona proveedores soportados o audita qué credenciales están presentes en tu terminal:

```bash
# Listar los 15 proveedores y modelos por defecto
node packages/universal-model-router/dist/cli.js --list

# Auditar qué API keys están configuradas en tu entorno actual
node packages/universal-model-router/dist/cli.js --status

# Generar el parche dinámico de perfil YAML para Cordis
node packages/universal-model-router/dist/cli.js --patch
```

---

## 🛠 Servidor WordPress MCP (Herramientas del Agente)

El servidor MCP (`packages/wp-mcp-server`) proporciona a los agentes autónomos primitivas diseñadas para WordPress:

| Herramienta | Parámetros | Descripción y Utilidad |
| :--- | :--- | :--- |
| `wp_scaffold_theme` | `themeName`, `slug`, `author`, `description`, `targetDir` | Genera la estructura completa FSE: `style.css`, `theme.json` (v3), `functions.php`, `templates/index.html`, `parts/header.html`, `parts/footer.html` y `patterns/`. |
| `check_php_syntax` | `filePath` | Realiza validaciones sintácticas no destructivas (`php -l`). Si no existe PHP en el sistema operativo del host, usa automáticamente el motor WebAssembly de `@wp-playground/cli php -- -l`. |
| `verify_in_playground`| `themePath`, `port` (por defecto: 8088), `timeoutMs` | Monta el tema en un servidor efímero de `@wp-playground/cli`, espera la disponibilidad de red, comprueba respuesta `HTTP 200 OK` y audita que no existan advertencias ni errores fatales. |
| `finish_task` | `themePath`, `outputZipPath` | Ejecuta la auditoría final de estándares (jerarquía FSE, nonces, sanitización) y empaqueta el tema listo para producción en `dist/site.zip`. |

---

## 🧠 Skills del Agente y Estándares de Código

WP-Harness incluye directivas especializadas en `skills/` (sincronizadas con `.agents/skills/`):

### 1. `wordpress-fse-theme`
- **Plantillas de Bloques**: Uso de marcado HTML limpio con comentarios oficiales de Gutenberg (`<!-- wp:template-part {"slug":"header"} /-->`, `<!-- wp:group {"layout":{"type":"constrained"}} -->`).
- **`theme.json` v3**: Paletas semánticas, tipografía fluida, presets de espaciado y estilos personalizados por bloque.
- **Patrones de Bloques**: Registro programático en PHP mediante `register_block_pattern()` con categorización semántica y palabras clave.

### 2. `wordpress-security-and-verification`
- **Escapado Obligatorio**: Uso sistemático de `esc_html()`, `esc_attr()`, `esc_url()` y `wp_kses_post()`. Prohibido el `echo $variable` sin sanitizar.
- **Verificación de Peticiones**: Comprobación rigurosa de nonces con `check_admin_referer()` o `wp_verify_nonce()`.
- **Control de Capacidades**: Validación de permisos de usuario (`current_user_can()`) antes de cualquier operación sensible.
- **Cero Funciones Obsoletas**: Sin shortcodes antiguos, constructores heredados de PHP 4 ni APIs deprecadas.

---

## 🧪 Pipeline Autónomo de Verificación

Ejecuta el conjunto completo de pruebas con:

```bash
pnpm test:wp
```

### Proceso Ejecutado Paso a Paso:

1. **Andamiaje**: Se genera un tema de bloques para un restaurante italiano (`wp-harness-demo`) con navegación responsive, portada hero, catálogo de menú y formulario de reserva.
2. **Linting de Sintaxis**: Se analizan los archivos PHP mediante el intérprete WebAssembly de PHP 8.3 integrado en `@wp-playground/cli`.
3. **Arranque en Sandbox**: Se inicia un entorno efímero de WordPress 6.7:
   ```bash
   npx @wp-playground/cli server --port 8088 --auto-mount /ruta/al/tema --verbosity normal
   ```
4. **Prueba de Salud**: Se consulta `http://127.0.0.1:8088`, se valida la respuesta `HTTP 200 OK`, la activación del tema y la inexistencia de errores fatales en los logs.
5. **Empaquetado**: Se genera el archivo `dist/site.zip`, listo para ser instalado en cualquier WordPress en producción.

---

## 💻 Uso de la Interfaz Web y CLI

### 1. Panel de Control Web Interactivo

Inicia la interfaz gráfica impulsada por Cordis:

```bash
node apps/cli/lib/bin.js web --port 3888
# o
pnpm dsh web --port 3888
```

Abre tu navegador en `http://127.0.0.1:3888`. La interfaz permite monitorizar el uso de herramientas en tiempo real, visualizar diffs de código y mantener conversaciones multi-turno con el agente.

### 2. Ejecución Autónoma en Terminal

Ejecuta tareas directamente desde la línea de comandos:

```bash
node apps/cli/lib/bin.js run "Crea un tema de bloques minimalista para un estudio de arquitectura con modo oscuro y cuadrícula de proyectos interactiva."
```

---

## 📁 Estructura del Repositorio

```
wp-harness/
├── apps/
│   └── cli/                      # Punto de entrada de la CLI de DeepSeek Harness (lib/bin.js)
├── packages/
│   ├── client/                   # Componentes cliente del agente
│   ├── core/                     # Motor de orquestación Cordis y ciclo de vida del agente
│   ├── host/                     # Enlace nativo con el sistema operativo anfitrión
│   ├── preset/                   # Preajustes y comportamientos del agente
│   ├── universal-model-router/   # Pasarela multi-modelo (DeepSeek, Claude, OpenAI, Ollama)
│   │   ├── src/router.ts         # Lógica de enrutamiento y respaldo
│   │   └── src/patcher.ts        # Generador de parches de perfil YAML para Cordis
│   └── wp-mcp-server/            # Servidor WordPress Model Context Protocol
│       ├── src/server.ts         # Definición del servidor MCP
│       └── src/tools/            # Herramientas de andamiaje, lint WASM, Playground y ZIP
├── skills/
│   ├── wordpress-fse-theme/      # Skill y directivas de arquitectura FSE
│   └── wordpress-security/       # Skill de seguridad, nonces y validaciones
├── .agents/skills/               # Directorio activo de skills para el runtime del agente
├── test-autonomous-wp.ts         # Pipeline de verificación autónoma end-to-end
├── tsdown.config.ts              # Configuración de compilación del monorepo
├── pnpm-workspace.yaml           # Definición del espacio de trabajo pnpm
└── .env.example                  # Plantilla de variables de entorno para modelos
```

---

## 🔒 Seguridad y Garantía de Calidad

- **Cero Exposición de Credenciales**: Nunca se suben archivos `.env` ni claves API al repositorio. Se aplican filtros de inspección en diffs (`api_key|token|secret|password`).
- **Ejecución en Sandbox Aislado**: Todas las pruebas se ejecutan dentro del contenedor WebAssembly de WP Playground sin alterar el sistema host.
- **Cumplimiento de Estándares**: Los temas generados por WP-Harness siguen las directrices oficiales de revisión de temas de WordPress.org y WordPress VIP.

---

## 🤝 Atribución y Licencia

WP-Harness es software de código abierto publicado bajo la **[Licencia MIT](LICENSE)**.

### Reconocimientos
- **[DeepSeek AI](https://deepseek.com)**: Por la arquitectura de agentes [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).
- **[Cordiverse](https://github.com/cordiverse/cordis)**: Por el marco de plugins y microkernel Cordis.
- **[WordPress Playground](https://wordpress.github.io/wordpress-playground/)**: Por el entorno de ejecución de WordPress en WebAssembly que hace posible la verificación sin dependencias locales.

---

*Mantenido por [Moisés Valero](https://github.com/moisesvalero).*
