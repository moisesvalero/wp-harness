#!/bin/bash
# ============================================================
# WP Forge — Script de arranque
# Abre la interfaz de chat WordPress en el navegador.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cargar variables de entorno si existe .env
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  source "$SCRIPT_DIR/.env"
  set +a
fi

echo "🔨 Iniciando WP Forge..."
echo "   Modelo activo: ${OPENAI_API_KEY:+OpenAI}${ANTHROPIC_API_KEY:+Anthropic}${GOOGLE_API_KEY:+Gemini}${DEEPSEEK_API_KEY:+DeepSeek}${OPENROUTER_API_KEY:+OpenRouter}"
echo "   WordPress: ${WORDPRESS_SITE_URL:-modo sandbox (sin WP instalado)}"
echo ""

node "$SCRIPT_DIR/apps/cli/lib/bin.js" wp-forge
