#!/bin/bash
# ============================================================
# WP Forge — Doble clic para abrir
# ============================================================

# Ir al directorio del proyecto (funciona aunque abras desde Finder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colores para el terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear
echo ""
echo -e "${BLUE}  🔨 WP Forge${NC}"
echo -e "  Agente de desarrollo WordPress"
echo ""

# Cargar variables de entorno
if [ -f ".env" ]; then
  set -a; source ".env"; set +a
  echo -e "  ${GREEN}✓${NC} Variables de entorno cargadas"
else
  echo -e "  ${YELLOW}⚠${NC}  No se encontró .env — crea uno con tu API key"
  echo "     Ejemplo: cp .env.wp-forge .env"
  echo ""
  read -p "  Pulsa Enter para continuar de todos modos..."
fi

# Verificar que node existe
if ! command -v node &> /dev/null; then
  echo ""
  echo "  ✗ Node.js no encontrado. Instala Node.js 22+ desde https://nodejs.org"
  read -p "  Pulsa Enter para cerrar..."
  exit 1
fi

# Mostrar modelo activo
if [ -n "$OPENROUTER_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: OpenRouter (acceso a todos los LLMs)"
elif [ -n "$OPENAI_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: OpenAI"
elif [ -n "$ANTHROPIC_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: Anthropic"
elif [ -n "$GOOGLE_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: Google Gemini"
elif [ -n "$DEEPSEEK_API_KEY" ]; then
  echo -e "  ${GREEN}✓${NC} Modelo: DeepSeek"
else
  echo -e "  ${YELLOW}⚠${NC}  Sin API key configurada — el agente no podrá responder"
fi

echo ""
echo -e "  Abriendo el navegador..."
echo -e "  (Cierra esta ventana para apagar WP Forge)"
echo ""

# Arrancar
node "$SCRIPT_DIR/apps/cli/lib/bin.js" wp-forge
