/*
 * node evals/prepare.mjs — refreshes .eval-deps/ before `claude plugin eval .`
 *
 * Each eval run loads only the plugins its case lists, and only from inside this repository
 * (code.claude.com/docs/en/plugin-evals, read 2026-09-23; the CLI refuses paths outside it). So the
 * specialists the hook routes to are copied here from where Claude Code installed them, and devio
 * itself is copied without its `dependencies`: with them, the copy did not load in a run.
 */
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, '.eval-deps');

const MANIFEST = join(ROOT, '.claude-plugin', 'plugin.json');
// The specialists are devio's own dependencies, so the suite measures what an install brings.
const SPECIALISTS = JSON.parse(readFileSync(MANIFEST, 'utf8')).dependencies.map(({ name, marketplace }) => `${name}@${marketplace}`);
const installed = JSON.parse(readFileSync(join(homedir(), '.claude', 'plugins', 'installed_plugins.json'), 'utf8')).plugins;
// Symlinked docs (AGENTS.md -> CLAUDE.md) and installed packages are not what a run reads.
const copy = (from, to) => cpSync(from, to, { recursive: true, filter: (path) => !/[\\/](node_modules|\.git)$|[\\/](AGENTS|CLAUDE|GEMINI)\.md$/.test(path) });

rmSync(OUT, { recursive: true, force: true });
for (const id of SPECIALISTS) {
  const install = installed[id]?.find((entry) => entry.scope === 'user') ?? installed[id]?.[0];
  if (!install) throw new Error(`${id} is not installed: claude plugin install ${id}`);
  copy(install.installPath, join(OUT, id.split('@')[0]));
}
copy(join(ROOT, '.claude-plugin'), join(OUT, 'devio', '.claude-plugin'));
copy(join(ROOT, 'hooks'), join(OUT, 'devio', 'hooks'));
const manifest = join(OUT, 'devio', '.claude-plugin', 'plugin.json');
const { dependencies, ...plugin } = JSON.parse(readFileSync(manifest, 'utf8'));
writeFileSync(manifest, `${JSON.stringify(plugin, null, 2)}\n`);
console.log(`.eval-deps/: devio, ${SPECIALISTS.map((id) => id.split('@')[0]).join(', ')}`);
