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
 * depend on: the case's files, the specialists' installed versions, the Claude Code version, and
 * --runs and --model. The arms run one after the other: every run shares one rate limit, and a
 * rate-limited run scores 0 without failing the suite (same page, "Usage limit reached").
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
const options = args.filter((arg) => !allCases.includes(arg));
if (!options.some((arg) => arg === '-j' || arg.startsWith('--concurrency'))) options.push('-j', '4');

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
for (const dir of ['.claude-plugin', 'hooks', 'skills']) copyPlugin(join(ROOT, dir), join(DEPS, 'devio', dir));
const { dependencies, ...plugin } = manifest;
writeFileSync(join(DEPS, 'devio', '.claude-plugin', 'plugin.json'), `${JSON.stringify(plugin, null, 2)}\n`);

const claudeVersion = spawnSync('claude', ['--version'], { encoding: 'utf8' }).stdout.trim();
// Of the options passed through, only these change what a run does.
const scoring = options.filter((arg, i) => /^--(runs|model)/.test(arg) || /^--(runs|model)$/.test(options[i - 1] ?? ''));
const keyOf = (name) => {
  const hash = createHash('sha256').update(JSON.stringify([versions, claudeVersion, scoring]));
  const files = readdirSync(join(EVALS, name), { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name)).sort();
  for (const file of files) hash.update(relative(EVALS, file)).update(readFileSync(file));
  return hash.digest('hex');
};
const isGuard = (name) => /^tags:.*\bguard\b/m.test(readFileSync(join(EVALS, name, 'prompt.md'), 'utf8'));

// Each case's mean score across its runs, and whether a run hit a usage or rate limit instead of
// failing on its own. The docs point to the error for the limit message but do not give its
// wording, so the pattern is a guess at the usual ones. A limited control score is not cached.
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
    '--allow-tools', 'Write', 'mcp__plugin_context7_context7__*', 'WebFetch(domain:code.claude.com)'], { cwd: ROOT, stdio: 'inherit' });
  if (!existsSync(result)) throw new Error(`the ${arm} arm wrote no result`);
  return Object.fromEntries(JSON.parse(readFileSync(result, 'utf8')).cases.map(({ name, arms: { with: runs } }) => [name, {
    score: runs.reduce((sum, run) => sum + run.score, 0) / runs.length,
    limited: runs.some((run) => /usage limit|rate limit|overloaded/i.test(run.error ?? '')),
  }]));
};

const specialists = manifest.dependencies.map(({ name }) => name);
const devio = runArm('devio', ['devio', ...specialists], cases);
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const keys = Object.fromEntries(cases.map((name) => [name, keyOf(name)]));
const stale = cases.filter((name) => cache[name]?.key !== keys[name]);
if (stale.length) {
  for (const [name, { score, limited }] of Object.entries(runArm('control', specialists, stale))) {
    cache[name] = { key: limited ? null : keys[name], score, limited };
  }
  writeFileSync(CACHE, `${JSON.stringify(cache, null, 2)}\n`);
}

let failed = false;
console.log('\ncase                     devio  control');
for (const name of cases) {
  const { score, limited } = devio[name];
  const control = cache[name];
  const guard = isGuard(name);
  const pass = !limited && !control.limited && score === 1 && (guard ? score >= control.score : score > control.score);
  failed ||= !pass;
  const note = [guard && 'guard', !stale.includes(name) && 'control cached', (limited || control.limited) && 'hit a limit: rerun']
    .filter(Boolean).join(', ');
  console.log(`${pass ? '✓' : '✗'} ${name.padEnd(22)} ${score.toFixed(2).padStart(5)}  ${control.score.toFixed(2).padStart(7)}${note ? `  (${note})` : ''}`);
}
process.exit(failed ? 1 : 0);
