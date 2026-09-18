#!/bin/bash
# ============================================================
# WP Forge Studio — Doble clic para abrir
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo ""
echo -e "${BLUE}  🔨 WP Forge Studio${NC}"
echo -e "  Asistente Inteligente de Desarrollo WordPress"
echo ""

if [ -f ".env" ]; then
  set -a; source ".env"; set +a
  echo -e "  ${GREEN}✓${NC} Variables de entorno cargadas (.env)"
else
  echo -e "  ${YELLOW}⚠${NC}  No se encontró .env (puedes configurar tus claves desde la interfaz web)"
fi

if ! command -v node &> /dev/null; then
  echo ""
  echo "  ✗ Node.js no encontrado. Instala Node.js desde https://nodejs.org"
  read -p "  Pulsa Enter para cerrar..."
  exit 1
fi

if [ -n "$OPENROUTER_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: OpenRouter activo (acceso a GPT-4o, Claude 3.7, Gemini 2.5, DeepSeek)"
elif [ -n "$OPENAI_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: OpenAI directo"
elif [ -n "$ANTHROPIC_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: Anthropic directo"
elif [ -n "$GOOGLE_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: Google Gemini directo"
else
  echo -e "  ${YELLOW}ℹ${NC}  Podrás pegar tu clave API directamente en la ventana que se abrirá."
fi

echo ""
echo -e "  Abriendo el navegador en ${BLUE}http://127.0.0.1:3888${NC}..."
echo -e "  (Mantén esta ventana abierta mientras usas WP Forge)"
echo ""

(sleep 1.5 && open "http://127.0.0.1:3888") &
node "$SCRIPT_DIR/apps/wp-forge-studio/server.js"
