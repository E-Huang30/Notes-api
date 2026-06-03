#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:3000"

echo "=== POST /notes ==="
CREATE=$(curl -s -X POST "$BASE/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test note","body":"Hello world"}')
echo "$CREATE"

ID=$(echo "$CREATE" | grep -oP '"id":\s*\K[0-9]+')

echo ""
echo "=== GET /notes ==="
curl -s "$BASE/notes"

echo ""
echo "=== GET /notes/$ID ==="
curl -s "$BASE/notes/$ID"

echo ""
echo "=== PUT /notes/$ID (title only) ==="
curl -s -X PUT "$BASE/notes/$ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

echo ""
echo "=== DELETE /notes/$ID ==="
curl -s -X DELETE "$BASE/notes/$ID"

echo ""
echo "=== GET /notes/$ID (expect 404) ==="
curl -s "$BASE/notes/$ID"

echo ""
