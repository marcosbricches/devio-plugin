/*
 * node tools/serve.mjs [port] — serves the prototype folder over HTTP.
 *
 * Node alone, no dependencies: a prototype that needs an install to be looked
 * at stops being looked at. Defaults to port 4321 and to the folder above this
 * one; both are overridable by argument (`[port] [root]`).
 *
 * HTML is sent with `no-store` so a reload always shows the current edit; every
 * other asset is sent with a long max-age, because assets are addressed by the
 * `?v=` hash that `version-assets.mjs` writes. Editing an asset without running
 * that script will serve you a stale file — that is the trade, and it is what
 * makes the published prototype behave like the real thing.
 */
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const port = Number(process.argv[2]) || Number(process.env.PORT) || 4321;
const root = resolve(process.argv[3] || join(import.meta.dirname, '..'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

const resolveTarget = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const candidate = resolve(join(root, normalize(decoded)));
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;
  try {
    return statSync(candidate).isDirectory() ? join(candidate, 'index.html') : candidate;
  } catch {
    return candidate.endsWith('.html') ? candidate : candidate + '.html';
  }
};

createServer((request, response) => {
  const target = resolveTarget(request.url || '/');
  if (!target) {
    response.writeHead(403).end('forbidden');
    return;
  }
  let size;
  try {
    size = statSync(target).size;
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end(`404 ${request.url}`);
    return;
  }
  const ext = extname(target);
  response.writeHead(200, {
    'content-type': TYPES[ext] || 'application/octet-stream',
    'content-length': size,
    'cache-control': ext === '.html' ? 'no-store' : 'public, max-age=31536000',
  });
  createReadStream(target).pipe(response);
}).listen(port, () => {
  console.log(`prototype on http://localhost:${port} (root ${root})`);
});
