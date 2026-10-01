#!/usr/bin/env bash
# A landing page set up like the designer's projects: a dev server, an e2e suite, and a gate
# (`verificar`) that runs lint, the e2e suite and the build. Plain Node, so nothing is installed.
set -euo pipefail
mkdir -p scripts e2e
cat > package.json <<'EOF'
{
  "name": "tanoa-landing",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node scripts/serve.mjs",
    "lint": "node scripts/lint.mjs",
    "test:e2e": "node --test e2e/*.test.mjs",
    "build": "node scripts/build.mjs",
    "verificar": "npm run lint && npm run test:e2e && npm run build"
  }
}
EOF
cat > CLAUDE.md <<'EOF'
# Tanoa landing

- `npm run dev` serves the page at http://localhost:4173.
- `npm run test:e2e` runs the end-to-end suite: the signup form and the navigation.
- `npm run verificar` is the full check: lint, the e2e suite, the build. It must pass before delivery.
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tanoa</title><link rel="stylesheet" href="styles.css"></head>
<body>
  <nav><a href="#plans">Plans</a> <a href="#signup">Sign up</a></nav>
  <section class="hero">
    <h1>Specialty coffee, every other week.</h1>
    <a class="button button--primary" href="#signup">Start my plan</a>
  </section>
  <section id="plans"><h2>Plans</h2><p>Two bags or four, roasted the week they ship.</p></section>
  <form id="signup"><label>Email <input type="email" name="email" required></label><button type="submit">Sign up</button></form>
</body>
</html>
EOF
cat > styles.css <<'EOF'
body { margin: 0; font-family: system-ui, sans-serif; color: #1d1d1b; }
nav { display: flex; gap: 1rem; padding: 1rem 2rem; }
.hero { padding: 6rem 2rem; background: #f6f1ea; }
.hero h1 { font-size: 3rem; max-width: 18ch; margin: 0 0 2rem; }
.button { display: inline-block; padding: 0.875rem 1.5rem; border-radius: 999px; text-decoration: none; font-weight: 600; }
.button--primary { background: #2f7d4f; color: #fff; }
#plans, #signup { padding: 3rem 2rem; }
EOF
cat > scripts/serve.mjs <<'EOF'
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const types = { '.html': 'text/html', '.css': 'text/css' };
createServer(async (req, res) => {
  const path = req.url === '/' ? 'index.html' : req.url.slice(1).split('?')[0];
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': types[path.slice(path.lastIndexOf('.'))] ?? 'text/plain' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(4173, () => console.log('ready on http://localhost:4173'));
EOF
cat > scripts/lint.mjs <<'EOF'
import { readFileSync } from 'node:fs';
const css = readFileSync('styles.css', 'utf8');
if ((css.match(/{/g) ?? []).length !== (css.match(/}/g) ?? []).length) throw new Error('styles.css: unbalanced braces');
console.log('lint ok');
EOF
cat > scripts/build.mjs <<'EOF'
import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css']) cpSync(file, `dist/${file}`);
console.log('built dist/');
EOF
cat > e2e/signup.test.mjs <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
test('the hero button leads to the signup form', () => assert.match(html, /href="#signup"[^>]*>Start my plan/));
test('the signup form asks for an email', () => assert.match(html, /<form id="signup">[\s\S]*type="email"[^>]*required/));
test('the navigation reaches the plans', () => assert.match(html, /<a href="#plans">/) && assert.match(html, /id="plans"/));
EOF
