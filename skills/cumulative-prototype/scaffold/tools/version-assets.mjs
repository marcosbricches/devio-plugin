/*
 * node tools/version-assets.mjs [root] — rewrites every `?v=` in the prototype
 * to one hash of the referenced assets' content. Run before publishing.
 *
 * The browser revalidates HTML; the CSS and JS that HTML points at, it does not.
 * Someone who saw the previous publish keeps the old assets until the URL
 * changes, so the URL has to change.
 *
 * Content hash, not a timestamp: two publishes in the same minute produced the
 * same version, and identical content should not produce a new URL. The hash is
 * taken with every `?v=` value stripped, which is what makes running this twice
 * in a row a no-op.
 *
 * Referenced assets are discovered by scanning the HTML and JS for `?v=`, so
 * there is no list to keep in sync — a reference the scan cannot see is a
 * reference this script will not version.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] || join(import.meta.dirname, '..'));
const SCANNED = /\.(html|js|mjs|css)$/;
const SKIPPED = new Set(['node_modules', '.git', 'tools']);
const REFERENCE = /(?:"|'|\(|\s)([\w./-]+\.(?:css|js|mjs|woff2|svg|png|jpe?g|webp|avif))\?v=[\w-]*/g;

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    if (SKIPPED.has(entry)) return [];
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const stripVersions = (text) => text.replace(/\?v=[\w-]*/g, '?v=');

const sources = walk(root).filter((path) => SCANNED.test(path));

const referenced = new Set();
for (const path of sources) {
  const text = readFileSync(path, 'utf8');
  for (const [, asset] of text.matchAll(REFERENCE)) referenced.add(asset.replace(/^\.?\//, ''));
}

const hash = createHash('sha256');
const missing = [];
for (const asset of [...referenced].sort()) {
  try {
    const bytes = readFileSync(join(root, asset));
    hash.update(SCANNED.test(asset) ? stripVersions(bytes.toString('utf8')) : bytes);
  } catch {
    missing.push(asset);
  }
}
if (missing.length) {
  console.error(`referenced but not found, so not hashed: ${missing.join(', ')}`);
}
const version = hash.digest('hex').slice(0, 12);

let rewritten = 0;
for (const path of sources) {
  const before = readFileSync(path, 'utf8');
  const after = before.replace(/\?v=[\w-]*/g, `?v=${version}`);
  if (after !== before) {
    writeFileSync(path, after);
    rewritten += 1;
  }
}

console.log(`assets at v=${version} — ${referenced.size} referenced, ${rewritten} file(s) rewritten`);
