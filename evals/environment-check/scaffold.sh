#!/usr/bin/env bash
# A small site with a Dockerfile, so the task is to run its image on the machine in front of it.
set -euo pipefail
git init -q
cat > package.json <<'EOP'
{ "name": "tanoa-landing", "private": true, "scripts": { "build": "node build.mjs" } }
EOP
cat > build.mjs <<'EOP'
import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
cpSync('index.html', 'dist/index.html');
EOP
cat > index.html <<'EOP'
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tanoa</title></head><body><h1>Tanoa</h1></body></html>
EOP
cat > Dockerfile <<'EOP'
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EOP
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm 'landing page'
