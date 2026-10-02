/*
 * node evals/run.mjs [case ...] [claude plugin eval options] — runs the picked cases once, with devio
 * and its dependencies loaded, and exits 0 only when every case scores 1.0.
 *
 * A run loads plugins only from inside the repository, so devio and its dependencies are copied to
 * .eval-deps/. devio's copy drops `dependencies`: with them, it did not load in a run. Each case runs
 * once unless --runs says otherwise: the whole suite at the default 3 runs was 108 sessions with the
 * old control arm, more than a change ever needed (2026-10-01).
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EVALS = join(ROOT, 'evals');
const DEPS = join(ROOT, '.eval-deps');
const SUITE = join(ROOT, 'eval-devio');
const manifest = JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'plugin.json'), 'utf8'));
const installed = JSON.parse(readFileSync(join(homedir(), '.claude', 'plugins', 'installed_plugins.json'), 'utf8')).plugins;

const allCases = readdirSync(EVALS, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const args = process.argv.slice(2);
const picked = args.filter((arg) => allCases.includes(arg));
const cases = picked.length ? picked : allCases;
const options = args.filter((arg) => !allCases.includes(arg));
if (!options.some((arg) => /^--runs(=|$)/.test(arg))) options.push('--runs', '1');
if (!options.some((arg) => arg === '-j' || arg.startsWith('--concurrency'))) options.push('-j', '4');
// The default judge passed replies that sonnet, reading the same rubric, failed (2026-09-27).
if (!options.some((arg) => arg.startsWith('--judge-model'))) options.push('--judge-model', 'sonnet');

// A plugin's symlinked agent docs and installed packages are not part of what a session loads.
const copyPlugin = (from, to) => cpSync(from, to, { recursive: true, filter: (path) => !/[\\/](node_modules|\.git)$|[\\/](AGENTS|CLAUDE|GEMINI)\.md$/.test(path) });
rmSync(DEPS, { recursive: true, force: true });
for (const { name, marketplace } of manifest.dependencies) {
  const entries = installed[`${name}@${marketplace}`];
  if (!entries) throw new Error(`${name}@${marketplace} is not installed: claude plugin install ${name}@${marketplace}`);
  const entry = entries.find((candidate) => candidate.scope === 'user') ?? entries[0];
  copyPlugin(entry.installPath, join(DEPS, name));
}
// context7 ab024cdcfa7c points at /mcp?client=claude-code-plugin, which answers 401 and asks for
// OAuth. A run's fresh home cannot sign in, so context7 came up `needs-auth`. The plain /mcp endpoint
// serves the same tools without auth (both probed 2026-09-30).
const context7 = join(DEPS, 'context7', '.mcp.json');
if (existsSync(context7)) writeFileSync(context7, readFileSync(context7, 'utf8').replace('/mcp?client=claude-code-plugin', '/mcp'));
for (const dir of ['.claude-plugin', 'hooks', 'skills']) copyPlugin(join(ROOT, dir), join(DEPS, 'devio', dir));
const { dependencies, ...plugin } = manifest;
writeFileSync(join(DEPS, 'devio', '.claude-plugin', 'plugin.json'), `${JSON.stringify(plugin, null, 2)}\n`);

rmSync(SUITE, { recursive: true, force: true });
const plugins = JSON.stringify(['devio', ...dependencies.map(({ name }) => name)].map((id) => `../../.eval-deps/${id}`));
for (const name of cases) {
  cpSync(join(EVALS, name), join(SUITE, name), { recursive: true });
  const prompt = join(SUITE, name, 'prompt.md');
  const text = readFileSync(prompt, 'utf8');
  if (!text.startsWith('---\n')) throw new Error(`evals/${name}/prompt.md must open with frontmatter`);
  writeFileSync(prompt, text.replace('---\n', `---\nplugins: ${plugins}\n`));
}
// Bash is never granted: granted Bash needs a sandbox, which native Windows lacks, and every run is
// then refused (code.claude.com/docs/en/plugin-evals, "Grant tools", read 2026-10-01).
const result = join(SUITE, 'result.json');
spawnSync('claude', ['plugin', 'eval', '.', '--eval-dir', 'eval-devio', '--ablation', 'none', '--json', result,
  '--scaffold', '--trust-plugin', '--no-publish', '--allow-real-servers', ...options,
  '--allow-tools', 'Write', 'Edit', 'mcp__plugin_context7_context7__*', 'mcp__plugin_chrome-devtools-mcp_chrome-devtools__*',
  'WebFetch(domain:code.claude.com)'], { cwd: ROOT, stdio: 'inherit' });
if (!existsSync(result)) throw new Error('the run wrote no result');

// A run that ended in an error (a usage limit, a refused start) is not a score: rerun it.
let failed = false;
console.log('\ncase                     devio');
for (const { name, arms: { with: runs } } of JSON.parse(readFileSync(result, 'utf8')).cases) {
  const score = runs.reduce((sum, run) => sum + run.score, 0) / runs.length;
  const errored = runs.some((run) => run.error != null);
  failed ||= errored || score !== 1;
  console.log(`${!errored && score === 1 ? '✓' : '✗'} ${name.padEnd(22)} ${score.toFixed(2).padStart(5)}${errored ? '  (run error: rerun)' : ''}`);
}
process.exit(failed ? 1 : 0);
