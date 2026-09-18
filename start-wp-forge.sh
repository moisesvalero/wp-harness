#!/bin/bash
# ============================================================
# WP Forge — Script de arranque
# Abre la interfaz de chat WordPress Studio en el navegador.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Cargar variables de entorno si existe .env
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  source "$SCRIPT_DIR/.env"
  set +a
fi

echo "🔨 Iniciando WP Forge Studio..."
echo "📍 Puerto: 3888"
echo "🤖 Modelo: ${OPENROUTER_API_KEY:+OpenRouter}${OPENAI_API_KEY:+OpenAI}${ANTHROPIC_API_KEY:+Anthropic}${GOOGLE_API_KEY:+Gemini}${DEEPSEEK_API_KEY:+DeepSeek}"
echo ""

# Abrir el navegador tras 1.5s
(sleep 1.5 && open "http://127.0.0.1:3888") &

# Arrancar el servidor de WP Forge Studio
node "$SCRIPT_DIR/apps/wp-forge-studio/server.js"
