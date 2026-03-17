#!/usr/bin/env bash
set -euo pipefail

echo "[TEST] Frontend health check..."
curl -sS http://localhost:3000/ >/dev/null
echo "[TEST] Frontend reachable."

echo "[TEST] Backend /institutions check..."
DATA=$(curl -s http://localhost:3001/institutions || true)
if [[ "$DATA" == [*"]"* ]]; then
  echo "[TEST] Backend /institutions returned array. Length: $(echo "$DATA" | wc -c) chars"
else
  echo "[TEST] Backend /institutions did not return expected array."
  exit 1
fi

echo "[TEST] Integration baseline: OK"
