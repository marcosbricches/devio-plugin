#!/usr/bin/env bash
# A finished home page not yet online: a gate script, no Dockerfile and no CI.
set -euo pipefail
git init -q
cat > package.json <<'EOF'
{ "name": "pousada-felix", "private": true, "scripts": { "dev": "vite", "build": "vite build", "verificar": "html-validate index.html && vite build" }, "devDependencies": { "html-validate": "^9.0.0", "vite": "^7.0.0" } }
EOF
cat > index.html <<'EOF'
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pousada Félix</title></head><body><h1>Dez quartos a dois minutos da areia</h1><p>Praia do Félix, Ubatuba.</p><a href="#reservas">Reservar</a></body></html>
EOF
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm 'home nova'
