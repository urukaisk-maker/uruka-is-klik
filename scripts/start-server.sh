#!/usr/bin/env bash
set -euo pipefail

# Ajusta esta ruta al GGUF que descargues
MODEL_PATH="${MODEL_PATH:-$HOME/models/MiniCPM5-2B-Q4_K_M.gguf}"
PORT="${PORT:-8080}"
CTX="${CTX:-4096}"         # tu CPU no aguanta 131k; 4k es realista
THREADS="${THREADS:-4}"    # Latitude E7470: i5 de 2 núcleos / 4 hilos

if [ ! -f "$MODEL_PATH" ]; then
  echo "No existe el modelo en $MODEL_PATH"
  echo "Descárgalo desde HuggingFace: openbmb/MiniCPM5-2B-GGUF"
  exit 1
fi

llama-server \
  -m "$MODEL_PATH" \
  -a "$(basename "$MODEL_PATH" .gguf)" \
  --port "$PORT" \
  -c "$CTX" \
  -t "$THREADS" \
  -ngl 0 \
  --jinja

# Verificación:
# curl http://localhost:8080/v1/chat/completions \
#   -H "Content-Type: application/json" \
#   -d '{"model":"MiniCPM5-2B","messages":[{"role":"user","content":"1+1=?"}],"max_tokens":16,"min_p":0.0}'
