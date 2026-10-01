/*
 * node evals/run.mjs [case ...] [claude plugin eval options] — what devio adds to its specialists.
 *
 * `claude plugin eval` compares a plugin only with a run that loads no plugin at all
 * (code.claude.com/docs/en/plugin-evals, "Score against the no-plugin baseline", read 2026-09-26).
 * There, "context7 was called" can never pass, so its Δ says nothing about devio. Each case here runs
 * with devio and its dependencies, and with the dependencies alone (control), both with
 * --ablation none. A run loads plugins only from inside the repository, so both arms load copies in
 * .eval-deps/. devio's copy drops `dependencies`: with them, it did not load in a run.
 *
 * Control does not depend on devio, so its score is cached per case, keyed on everything it does
 * depend on: the case's files, the specialists' installed versions, the Claude Code version, the
 * tools a run is allowed, and --runs, --model and --judge-model. The arms run one after the other:
 * every run shares one rate limit. A run that ends in an error (a limit, a refused sandbox) scores 0,
 * is marked for rerun and is not cached (same page, "Usage limit reached").
 *
 * Passes when every case scores 1.0 with devio and above control; a case tagged `guard` (devio must
 * not over-route) only has to match control.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EVALS = join(ROOT, 'evals');
const DEPS = join(ROOT, '.eval-deps');
const CACHE = join(ROOT, 'eval-control.json');
const manifest = JSON.parse(readFileSync(join(ROOT, '.claude-plugin', 'plugin.json'), 'utf8'));
const installed = JSON.parse(readFileSync(join(homedir(), '.claude', 'plugins', 'installed_plugins.json'), 'utf8')).plugins;

const allCases = readdirSync(EVALS, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const args = process.argv.slice(2);
const picked = args.filter((arg) => allCases.includes(arg));
const cases = picked.length ? picked : allCases;
const promptOf = (name) => readFileSync(join(EVALS, name, 'prompt.md'), 'utf8');
const options = args.filter((arg) => !allCases.includes(arg));
if (!options.some((arg) => arg === '-j' || arg.startsWith('--concurrency'))) options.push('-j', '4');
// The default judge passed replies that sonnet, reading the same rubric, failed (both arms, 2026-09-27).
if (!options.some((arg) => arg.startsWith('--judge-model'))) options.push('--judge-model', 'sonnet');

// A plugin's symlinked agent docs and installed packages are not part of what a session loads.
const copyPlugin = (from, to) => cpSync(from, to, { recursive: true, filter: (path) => !/[\\/](node_modules|\.git)$|[\\/](AGENTS|CLAUDE|GEMINI)\.md$/.test(path) });
rmSync(DEPS, { recursive: true, force: true });
const versions = [];
for (const { name, marketplace } of manifest.dependencies) {
  const entries = installed[`${name}@${marketplace}`];
  if (!entries) throw new Error(`${name}@${marketplace} is not installed: claude plugin install ${name}@${marketplace}`);
  const entry = entries.find((candidate) => candidate.scope === 'user') ?? entries[0];
  versions.push(`${name}@${entry.version}:${entry.gitCommitSha ?? ''}`);
  copyPlugin(entry.installPath, join(DEPS, name));
}
// context7 ab024cdcfa7c points at /mcp?client=claude-code-plugin, which answers 401 and asks for
// OAuth. A run's fresh home cannot sign in, so context7 came up `needs-auth` and every case that
// needs it failed in both arms. The plain /mcp endpoint serves the same tools without auth (both
// probed 2026-09-30).
const context7 = join(DEPS, 'context7', '.mcp.json');
if (existsSync(context7)) {
  const patched = readFileSync(context7, 'utf8').replace('/mcp?client=claude-code-plugin', '/mcp');
  writeFileSync(context7, patched);
  versions.push(patched);
}
for (const dir of ['.claude-plugin', 'hooks', 'skills']) copyPlugin(join(ROOT, dir), join(DEPS, 'devio', dir));
const { dependencies, ...plugin } = manifest;
writeFileSync(join(DEPS, 'devio', '.claude-plugin', 'plugin.json'), `${JSON.stringify(plugin, null, 2)}\n`);

const claudeVersion = spawnSync('claude', ['--version'], { encoding: 'utf8' }).stdout.trim();
// Of the options passed through, only these change what a run does or how it is scored.
const scoring = options.filter((arg, i) => /^--(model|judge-model)\b/.test(arg) || /^--(model|judge-model)$/.test(options[i - 1] ?? ''));
// The key holds the runs a case gets, not how they were asked for: an omitted --runs means
// `case.runs ?? 3` (`claude plugin eval --help`, read 2026-10-01), so `--runs 3` and no flag share a control.
const runsAt = options.findIndex((arg) => /^--runs(=|$)/.test(arg));
const runsFlag = runsAt < 0 ? undefined : options[runsAt].split('=')[1] ?? options[runsAt + 1];
// A grant reaches every case in the run, and granted Bash runs only under a sandbox, which native
// Windows lacks: there each run is refused and scores 0 (plugin-evals, "Grant tools", read
// 2026-10-01). So Bash is granted only when a picked case lists it, and such a run needs WSL2.
const allowed = ['Write', 'Edit', 'mcp__plugin_context7_context7__*', 'WebFetch(domain:code.claude.com)',
  ...(cases.some((name) => /^allowed_tools:.*\bBash\b/m.test(promptOf(name))) ? ['Bash'] : [])];
const keyOf = (name) => {
  const runs = Number(runsFlag ?? promptOf(name).match(/^runs:\s*(\d+)/m)?.[1] ?? 3);
  const hash = createHash('sha256').update(JSON.stringify([versions, claudeVersion, scoring, runs, allowed]));
  const files = readdirSync(join(EVALS, name), { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name)).sort();
  for (const file of files) hash.update(relative(EVALS, file)).update(readFileSync(file));
  return hash.digest('hex');
};
const isGuard = (name) => /^tags:.*\bguard\b/m.test(promptOf(name));

// Each case's mean score across its runs, and whether a run ended in an error instead of being
// scored: a usage limit ("You've hit your session limit", 2026-09-27) or a refusal to start ("Sandbox
// required but unavailable ... feature gate off", for a case granted Bash on Windows, 2026-10-01).
// Matching only limit wordings cached that refusal as a real control score of 0. A scored run has
// `error: null`, so any error means rerun, and such a control score is not cached.
const runArm = (arm, plugins, names) => {
  const suite = join(ROOT, `eval-${arm}`);
  rmSync(suite, { recursive: true, force: true });
  for (const name of names) {
    cpSync(join(EVALS, name), join(suite, name), { recursive: true });
    const prompt = join(suite, name, 'prompt.md');
    const text = readFileSync(prompt, 'utf8');
    if (!text.startsWith('---\n')) throw new Error(`evals/${name}/prompt.md must open with frontmatter`);
    const list = JSON.stringify(plugins.map((id) => `../../.eval-deps/${id}`));
    writeFileSync(prompt, text.replace('---\n', `---\nplugins: ${list}\n`));
  }
  const result = join(suite, 'result.json');
  spawnSync('claude', ['plugin', 'eval', '.', '--eval-dir', `eval-${arm}`, '--ablation', 'none', '--json', result,
    '--scaffold', '--trust-plugin', '--no-publish', '--allow-real-servers', ...options,
    '--allow-tools', ...allowed], { cwd: ROOT, stdio: 'inherit' });
  if (!existsSync(result)) throw new Error(`the ${arm} arm wrote no result`);
  return Object.fromEntries(JSON.parse(readFileSync(result, 'utf8')).cases.map(({ name, arms: { with: runs } }) => [name, {
    score: runs.reduce((sum, run) => sum + run.score, 0) / runs.length,
    errored: runs.some((run) => run.error != null),
  }]));
};

const specialists = manifest.dependencies.map(({ name }) => name);
const devio = runArm('devio', ['devio', ...specialists], cases);
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const keys = Object.fromEntries(cases.map((name) => [name, keyOf(name)]));
const stale = cases.filter((name) => cache[name]?.key !== keys[name]);
if (stale.length) {
  for (const [name, { score, errored }] of Object.entries(runArm('control', specialists, stale))) {
    cache[name] = { key: errored ? null : keys[name], score, errored };
  }
  writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);
}

let failed = false;
console.log('\ncase                     devio  control');
for (const name of cases) {
  const { score, errored } = devio[name];
  const control = cache[name];
  const guard = isGuard(name);
  const pass = !errored && !control.errored && score === 1 && (guard ? score >= control.score : score > control.score);
  failed ||= !pass;
  const note = [guard && 'guard', !stale.includes(name) && 'control cached', (errored || control.errored) && 'run error: rerun']
    .filter(Boolean).join(', ');
  console.log(`${pass ? '✓' : '✗'} ${name.padEnd(22)} ${score.toFixed(2).padStart(5)}  ${control.score.toFixed(2).padStart(7)}${note ? `  (${note})` : ''}`);
}
process.exit(failed ? 1 : 0);
