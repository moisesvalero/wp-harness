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

```bash
./start-wp-forge.sh
```

Se abre el navegador automáticamente. Selecciona el preset **WP Forge** y empieza a chatear.

---

## Qué puedes construir

| Dile al agente... | Qué hace |
|---|---|
| *"Crea un tema de blog con diseño minimalista"* | Genera tema FSE → verifica en WP Playground → entrega `site.zip` |
| *"Haz una web de restaurante con reservas"* | Genera tema + formulario de reserva + custom post types |
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

---

## Proveedores LLM soportados

| Proveedor | Modelos | Variable |
|---|---|---|
| **OpenAI** | GPT-4o, o3-mini | `OPENAI_API_KEY` |
| **Anthropic** | Claude 3.7 Sonnet, Claude 3.5 Haiku | `ANTHROPIC_API_KEY` |
| **Google** | Gemini 2.5 Pro, Gemini 2.5 Flash | `GOOGLE_API_KEY` |
| **DeepSeek** | DeepSeek Chat (V3), Reasoner (R1) | `DEEPSEEK_API_KEY` |
| **Groq** | Llama 3.3 70B, Mixtral 8x7B | `GROQ_API_KEY` |
| **Mistral** | Mistral Large, Codestral | `MISTRAL_API_KEY` |
| **Cohere** | Command R+ | `COHERE_API_KEY` |
| **xAI** | Grok-3 | `XAI_API_KEY` |
| **OpenRouter** | Cualquier modelo | `OPENROUTER_API_KEY` |
| **Ollama** | Cualquier modelo local | `OLLAMA_BASE_URL` |
| + 5 más | Together, Fireworks, Perplexity, Cerebras, DeepInfra | — |

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
