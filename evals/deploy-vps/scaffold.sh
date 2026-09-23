#!/usr/bin/env bash
# A small static site to deploy: it has no Dockerfile yet.
set -euo pipefail
cat > package.json <<'EOF'
{ "name": "tanoa-landing", "private": true, "scripts": { "build": "vite build", "dev": "vite" }, "devDependencies": { "vite": "^7.0.0" } }
EOF
cat > index.html <<'EOF'
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tanoa</title></head><body><h1>Tanoa</h1><p>Specialty coffee, every other week.</p></body></html>
EOF
