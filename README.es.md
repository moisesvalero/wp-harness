# 🔨 WP Forge

> **Chatea con un agente de IA y construye sitios WordPress — sin escribir código.**
> Un entorno de desarrollo WordPress conversacional de código abierto, construido sobre [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

---

[🇬🇧 English](README.md) | [🇪🇸 Español](README.es.md)

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10%2B-orange.svg)](https://pnpm.io/)
[![WordPress](https://img.shields.io/badge/WordPress-6.5%2B%20FSE-21759B.svg)](https://wordpress.org/)

---

## ¿Qué es WP Forge?

WP Forge es un **agente de desarrollo WordPress basado en chat** que se ejecuta en tu ordenador. Ábrelo, describe lo que quieres en lenguaje natural, y el agente lo construye — temas, plugins, contenido — verificando que todo funciona en un WordPress real.

Es como tener un desarrollador WordPress senior disponible 24/7 a través de un chat, usando el modelo de IA que prefieras.

```
Tú:      "Crea una web para mi restaurante italiano con tema oscuro y dorado,
           sección de menú y formulario de reserva"

Agente:  "Construyendo el tema..."
         ✓ Tema FSE creado (theme.json v3, templates Gutenberg)
         ✓ PHP sintaxis: 0 errores
         ✓ WordPress Playground: HTTP 200 OK, tema activo, 0 errores fatales
         ✓ Empaquetado → dist/site.zip (listo para instalar en tu WordPress)
```

---

## Características

- **Interfaz de chat** — misma UI que Claude Desktop, Cursor o Antigravity
- **Agente especializado en WordPress** — conoce FSE, Gutenberg, estándares de codificación y seguridad
- **Funciona sin WordPress instalado** — usa WP Playground (WebAssembly) como sandbox
- **Conecta a tu WordPress real** — gestiona posts, páginas, temas y plugins vía REST API
- **Cualquier modelo LLM** — OpenAI, Anthropic, Gemini, Groq, DeepSeek, Ollama y más
- **Salida verificada** — nunca da por completada una tarea sin ejecutarla en WordPress

---

## Inicio rápido

### Requisitos

- Node.js 22+ y pnpm 10+
- API key de al menos un proveedor LLM (OpenAI, Anthropic, Gemini, etc.)

### 1. Clonar

```bash
git clone https://github.com/moisesvalero/wp-harness.git
cd wp-harness
pnpm install
pnpm run build
```

### 2. Configurar tu API key

```bash
cp .env.wp-forge .env
```

Abre `.env` y descomenta la línea de tu proveedor:

```bash
# Elige UNO (o varios):
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
GROQ_API_KEY=gsk_...
# OLLAMA_BASE_URL=http://localhost:11434   ← para modelos locales, sin clave
```

### 3. Arrancar

**En macOS (un solo clic):**
Haz doble clic en `WP Forge.command` desde el Finder.

**O desde la terminal:**
```bash
./start-wp-forge.sh
```

El navegador se abrirá automáticamente en `http://127.0.0.1:3080/` con el agente **WP Forge** listo para trabajar.

---

## Qué puedes construir

| Dile al agente... | Qué hace |
|---|---|
| *"Crea un tema de blog con diseño minimalista"* | Genera tema FSE → verifica en WP Playground → entrega `site.zip` |
| *"Haz una web de restaurante con reservas"* | Genera tema + formulario de reserva + custom post types |
| *"Crea un tema compatible con WooCommerce"* | Genera tema con plantillas de tienda y bloques de productos |
| *"Publica un nuevo artículo en mi WordPress"* | Conecta a tu WP vía REST API y crea el post |
| *"Lista todos mis plugins instalados"* | Consulta tu WordPress y muestra la lista |
| *"Corrige el error PHP en functions.php"* | Lee el archivo, lo corrige, verifica sintaxis, listo |

---

## Conectar a tu WordPress (opcional)

Para que el agente gestione tu sitio WordPress real, añade esto a `.env`:

```bash
WORDPRESS_SITE_URL=https://tu-sitio.com
WORDPRESS_USERNAME=admin
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

> **Cómo obtener la contraseña de aplicación:** Admin de WordPress → Usuarios → Tu perfil → Contraseñas de aplicación → Añadir nueva

Una vez configurado, el agente tiene acceso a más de 50 herramientas de gestión de WordPress (entradas, páginas, medios, temas, plugins, menús, usuarios, ajustes y más) mediante el servidor [mcp-wordpress](https://github.com/docdyhr/mcp-wordpress).

---

## 🎯 Selección y cambio de modelo

Tienes total libertad para elegir el modelo que quieras directamente desde la interfaz:

1. **Menú desplegable en el chat (Composer):** En la barra inferior donde escribes los prompts, haz clic en la píldora con el nombre del modelo activo (por defecto: `OpenAI GPT-6 Astra`). Se abrirá el menú desplegable con todos los modelos disponibles.
   - **Persistencia automática:** El modelo que elijas se guarda automáticamente en tus ajustes como el **modelo por defecto para todas las futuras sesiones**.
2. **Comando de barra `/model`:** Escribe `/model` en la caja de texto para abrir el buscador rápido y cambiar de modelo con el teclado al instante.
3. **Panel de Ajustes (⚙️ Settings → Models):** Consulta, personaliza o añade nuevos endpoints de modelos y claves de API en cualquier momento.

---

## Modelos punteros de 2026 y Colección Gratuita

WP Forge cuenta con soporte para **15+ proveedores de IA** y viene preconfigurado con los modelos de última generación de **finales de 2026**, incorporando un límite estricto de `maxOutputTokens: 4096` que erradica por completo los bloqueos por cálculo de saldo `402 Payment Required` en OpenRouter:

### 🌟 Modelos Flagship 2026 (OpenRouter y Directos)
| Modelo | Ventana de Contexto | Especialidad |
|---|---|---|
| **OpenAI GPT-6 Astra** *(Por defecto)* | 1.05M tokens | Referencia en programación agentica, razonamiento y arquitectura FSE |
| **OpenAI GPT-6 Astra Pro** | 1.05M tokens | Plugins complejos full-stack y migraciones de bases de datos |
| **Anthropic Claude Fable 5.1** | 1.00M tokens | Diseño de arquitectura a gran escala y auditoría exhaustiva |
| **Anthropic Claude Opus 5** | 1.00M tokens | Razonamiento autónomo en múltiples fases y verificación lógica |
| **Google Gemini 3.8 Flash** | 1.05M tokens | Generación ultrarrápida con ventana masiva de 1 millón de tokens |
| **Google Gemini 3.7 Flash** | 1.05M tokens | Flujo agentico multimodal equilibrado de alta velocidad |
| **DeepSeek V4.1 Flash** | 1.05M tokens | Alto rendimiento en codificación y ejecución continua de herramientas |
| **DeepSeek V4 Pro** | 1.05M tokens | Máxima precisión en depuración y análisis sintáctico |
| **Qwen 3.8 Flash** | 1.00M tokens | Especialista en código técnico, patrones de bloques y PHP |

### 🆓 Colección Gratuita de OpenRouter ($0 de Saldo)
Modelos con coste cero verificados para flujos de trabajo autónomos:
- `openrouter/free` — Enrutador automático inteligente entre modelos de cuota gratuita
- `deepseek/deepseek-v4-flash-0731:free` — 1M de contexto con coste cero de tokens
- `cohere/north-mini-code:free` — Optimizado para código y sintaxis
- `nvidia/nemotron-3.5-lightning:free` — Inferencia gratuita ultrarrápida de 1M de contexto

### 🔌 Todos los 15 Proveedores Integrados
| Proveedor | Modelo por Defecto / Flagship | Clave en `.env` |
|---|---|---|
| **OpenRouter** | GPT-6 Astra, Claude Fable 5.1, Gemini 3.8, Colección Gratuita | `OPENROUTER_API_KEY` |
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
| **Cerebras** | Llama 3.3 70B (ultra-rápido) | `CEREBRAS_API_KEY` |
| **DeepInfra** | DeepSeek V4, R1 | `DEEPINFRA_API_KEY` |
| **Ollama** | Modelos locales offline (sin clave de API) | `OLLAMA_BASE_URL` |

Cambia de proveedor o modelo en cualquier instante directamente desde la interfaz de chat.

---

## Cómo funciona

```
┌──────────────────────────────────────────────────────┐
│                WP Forge (UI)                         │
│      Interfaz de chat — se abre en el navegador      │
└────────────────────┬─────────────────────────────────┘
                     │ lenguaje natural
┌────────────────────▼─────────────────────────────────┐
│             Agente WP Forge (dsh)                    │
│   Persona: desarrollador WordPress senior            │
│   Conoce: FSE, seguridad, estándares WordPress       │
└──────────┬───────────────────┬───────────────────────┘
           │                   │
┌──────────▼──────┐   ┌────────▼──────────────────────┐
│  wp-forge-tools │   │      mcp-wordpress             │
│  (MCP local)    │   │  (REST API — opcional)         │
│                 │   │                                │
│ • Crea temas    │   │ • posts / páginas / media      │
│ • Lint PHP WASM │   │ • temas / plugins / menús      │
│ • WP Playground │   │ • usuarios / opciones          │
│ • Empaqueta ZIP │   │ • 50+ herramientas WordPress   │
└─────────────────┘   └────────────────────────────────┘
```

---

## Seguridad del código generado

El agente aplica automáticamente los WordPress Coding Standards en todo el código que genera:

- **Escapado de salida**: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`
- **Sanitización de entrada**: `sanitize_text_field()`, `absint()`, `wp_unslash()`
- **Verificación de formularios**: `wp_nonce_field()` + `check_admin_referer()`
- **Seguridad en base de datos**: `$wpdb->prepare()` en todas las queries dinámicas
- **Control de acceso**: `current_user_can()` antes de cualquier acción privilegiada
- **Ninguna tarea se marca como completa sin verificación en WP Playground**

---

## Licencia y créditos

MIT License — [LICENSE](LICENSE)

Construido sobre:
- **[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** — el framework de agentes open source
- **[mcp-wordpress](https://github.com/docdyhr/mcp-wordpress)** — 50+ herramientas MCP para WordPress
- **[WordPress Playground](https://wordpress.github.io/wordpress-playground/)** — WordPress en WebAssembly

---

*Mantenido por [Moisés Valero](https://github.com/moisesvalero)*
