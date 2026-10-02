#!/usr/bin/env bash
# A small shipped site whose design lives only in its code: tokens in one stylesheet, two pages
# that use them, and no DESIGN.md yet.
set -euo pipefail
mkdir -p styles
cat > styles/tokens.css <<'EOF'
:root {
  --color-ink: #2b2118;
  --color-paper: #f6f1e7;
  --color-accent: #b4532a;
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --radius: 4px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 32px;
  --space-4: 64px;
}
body { background: var(--color-paper); color: var(--color-ink); font: 17px/1.6 var(--font-body); margin: 0; }
h1, h2 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; }
.button { background: var(--color-accent); color: var(--color-paper); border-radius: var(--radius); padding: var(--space-1) var(--space-2); }
section { padding: var(--space-4) var(--space-3); }
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Pousada Félix</title><link rel="stylesheet" href="styles/tokens.css"></head>
<body><section><h1>Dez quartos a dois minutos da areia</h1><p>Praia do Félix, Ubatuba.</p><a class="button" href="reservas.html">Reservar</a></section></body>
</html>
EOF
cat > reservas.html <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>Reservas · Pousada Félix</title><link rel="stylesheet" href="styles/tokens.css"></head>
<body><section><h2>Reservas</h2><form><label>Chegada <input type="date"></label><button class="button">Ver quartos</button></form></section></body>
</html>
EOF
git init -q
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm 'site shipped'
