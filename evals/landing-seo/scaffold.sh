#!/usr/bin/env bash
# A landing page about to ship with the defects Lighthouse's SEO score does not weigh: a canonical
# pointing at another page, no Open Graph, no structured data. It also has no meta description,
# which Lighthouse does flag.
set -euo pipefail
cat > index.html <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Home</title>
<link rel="canonical" href="https://pousadafelix.com.br/reservas">
</head>
<body>
<header><a href="/">Pousada Félix</a></header>
<main>
<h2>Dez quartos a dois minutos da areia</h2>
<p>Pousada na Praia do Félix, em Ubatuba, com café da manhã caiçara e estacionamento.</p>
<a href="/reservas">Reservar</a>
<h4>Quartos</h4>
<img src="quarto.jpg">
<p>Quartos de casal e família, todos com varanda.</p>
</main>
</body>
</html>
EOF
