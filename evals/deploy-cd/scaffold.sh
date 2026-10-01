#!/usr/bin/env bash
# A small static site to deploy: a gate script (`verificar`), no Dockerfile and no CI yet.
set -euo pipefail
git init -q
cat > package.json <<'EOF'
{ "name": "tanoa-landing", "private": true, "scripts": { "dev": "vite", "build": "vite build", "verificar": "html-validate index.html && vite build" }, "devDependencies": { "html-validate": "^9.0.0", "vite": "^7.0.0" } }
EOF
cat > index.html <<'EOF'
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tanoa</title></head><body><h1>Tanoa</h1><p>Specialty coffee, every other week.</p></body></html>
EOF
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm 'landing page'
