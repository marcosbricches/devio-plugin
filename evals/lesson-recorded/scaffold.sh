#!/usr/bin/env bash
# A small Node service whose migration falls back to a local database when DATABASE_URL is unset.
set -euo pipefail
cat > package.json <<'EOF'
{ "name": "tanoa-orders", "private": true, "type": "module", "scripts": { "migrate": "node migrate.js", "start": "node server.js" } }
EOF
cat > migrate.js <<'EOF'
const url = process.env.DATABASE_URL ?? 'postgres://localhost:5432/tanoa';
console.log(`Migrating ${url}`);
EOF
cat > server.js <<'EOF'
const url = process.env.DATABASE_URL ?? 'postgres://localhost:5432/tanoa';
console.log(`Serving orders from ${url}`);
EOF
