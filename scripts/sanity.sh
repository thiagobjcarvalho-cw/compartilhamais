#!/usr/bin/env bash
set -euo pipefail

echo "[SANITY] Verificando backend e frontend..."

NAMESPACES=(backend frontend)

echo "==> Containers status (docker ps)"
docker ps -a --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" | sed -n '1,6p'

echo "==> Testes de Backend (http://localhost:3001)"
check() {
  local url="$1"
  local want_status="$2"
  local out
  out=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$out" -eq "$want_status" ]; then
    echo "OK: $url -> $out"
  else
    echo "ERRO: $url -> $out (esperado $want_status)" >&2
  fi
}

check "http://localhost:3001/healthz" 200
check "http://localhost:3001/institutions" 200
check "http://localhost:3001/institutions/1" 200
check "http://localhost:3001/institutions/1/needs" 200

echo "==> Testes de Frontend (http://localhost:3000)"
curl -sS http://localhost:3000/ | head -n 3 || true
echo "
Operação concluída. Se algum teste falhar, verifique os logs com: docker logs <nome-do-container> --tail 200"
