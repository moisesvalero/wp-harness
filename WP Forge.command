#!/bin/bash
# ============================================================
# DeepSeek Harness (Antigravity 2.0) — WordPress Edition
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -f "$SCRIPT_DIR/.env" ]; then
  mkdir -p "$HOME/.dsh"
  cp "$SCRIPT_DIR/.env" "$HOME/.dsh/.env"
  set -a
  source "$SCRIPT_DIR/.env"
  set +a
fi

clear
echo "============================================================="
echo "🚀 DEEPSEEK HARNESS (ANTIGRAVITY 2.0) — WORDPRESS AGENT WORKBENCH"
echo "============================================================="
echo "📍 Modelos 2026: OpenRouter (GPT-6 Astra / Claude Fable 5.1 / Opus 5 / Gemini 3.8 / DeepSeek V4.1 / Gratuitos $0)"
echo "📍 Agente: WP Forge (Full Site Editing, theme.json v3, Security)"
echo "📍 Workspace: $SCRIPT_DIR/workspace"
echo "============================================================="
echo ""
echo "Iniciando servidor y abriendo navegador..."
echo ""

exec node "$SCRIPT_DIR/apps/cli/lib/bin.js" wp-forge
