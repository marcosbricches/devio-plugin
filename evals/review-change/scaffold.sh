#!/usr/bin/env bash
# A committed Node service, then an uncommitted diff that over-builds: a hand-written date parser
# and a formatter interface with one implementation, where Date and Intl already do the job.
set -euo pipefail
git init -q
cat > package.json <<'EOF'
{ "name": "tanoa-orders", "private": true, "type": "module", "scripts": { "start": "node server.js" } }
EOF
cat > orders.js <<'EOF'
export const orders = [
  { id: 1, customer: 'Ana', placedAt: '2026-09-28' },
  { id: 2, customer: 'Bruno', placedAt: '2026-09-29' },
];
EOF
cat > server.js <<'EOF'
import { orders } from './orders.js';
for (const order of orders) console.log(`#${order.id} ${order.customer} ${order.placedAt}`);
EOF
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm 'orders list'

cat > dates.js <<'EOF'
export class DateFormatter {
  format(date) { throw new Error('not implemented'); }
}

export class BrazilianDateFormatter extends DateFormatter {
  format(date) {
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    return `${day}/${month}/${date.year}`;
  }
}

export function createDateFormatter(kind = 'br') {
  if (kind === 'br') return new BrazilianDateFormatter();
  throw new Error(`unknown formatter ${kind}`);
}

export function parseIsoDate(text) {
  const parts = text.split('-');
  if (parts.length !== 3) throw new Error(`bad date ${text}`);
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (month < 1 || month > 12) throw new Error(`bad month ${text}`);
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const max = month === 2 && leap ? 29 : daysInMonth[month - 1];
  if (day < 1 || day > max) throw new Error(`bad day ${text}`);
  return { year, month, day };
}
EOF
cat > server.js <<'EOF'
import { orders } from './orders.js';
import { createDateFormatter, parseIsoDate } from './dates.js';
const formatter = createDateFormatter();
for (const order of orders) console.log(`#${order.id} ${order.customer} ${formatter.format(parseIsoDate(order.placedAt))}`);
EOF
