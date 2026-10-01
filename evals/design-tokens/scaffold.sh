#!/usr/bin/env bash
# A small static site with a tokens file nobody uses: three pages repeat the same blue, radius and
# spacing by hand, and each page has its own copy of the same button.
set -euo pipefail
mkdir -p styles
cat > styles/tokens.css <<'EOF'
:root {
  --font-body: system-ui, sans-serif;
}
EOF
for page in home pricing contact; do
cat > styles/$page.css <<'EOF'
body { font-family: var(--font-body); color: #0f172a; }
.section { padding: 24px 16px; }
.button { background: #1d4ed8; color: #ffffff; border-radius: 10px; padding: 12px 20px; font-weight: 600; }
.button:hover { background: #1e40af; }
.card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; }
EOF
cat > $page.html <<EOF
<!doctype html>
<html lang="en">
<head><link rel="stylesheet" href="styles/tokens.css"><link rel="stylesheet" href="styles/$page.css"><title>$page</title></head>
<body><section class="section"><div class="card"><h1>$page</h1><a class="button" href="/signup">Start free</a></div></section></body>
</html>
EOF
done
