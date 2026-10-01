/*
 * node probe.mjs [tool ...] — what this machine has, one `item: state` line each, read live.
 *
 * Runs on the host (Windows or Linux). On Windows it also looks inside the default WSL distro: the
 * first one that is not docker-desktop. Extra arguments are tools to look for inside WSL, besides
 * the usual bwrap socat claude node git. `MISSING` is a tool that is not there; `unknown` is a probe
 * that could not run, never a guess.
 *
 * Two traps, both hit on 2026-10-01 (research: .scratch/environment-awareness/research.md):
 * `wsl.exe` writes UTF-16LE while everything else writes UTF-8, and a non-login `sh` has no
 * ~/.local/bin on PATH, so it reported claude and node missing inside Ubuntu when they were there.
 * The distro is therefore asked through `bash -lc`.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TOOLS = ['bwrap', 'socat', 'claude', 'node', 'git'];

const run = (command, args, { utf16 = false, timeout = 15_000 } = {}) => {
  const result = spawnSync(command, args, { timeout, encoding: utf16 ? 'buffer' : 'utf8' });
  if (result.error || result.status !== 0) return null;
  const text = utf16 ? result.stdout.toString('utf16le') : result.stdout;
  return text.replace(/\0/g, '').trim();
};

export const parseDistros = (listing) =>
  listing
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.replace(/^\*?\s*/, '').trim().split(/\s{2,}/))
    .filter(([name]) => name)
    .map(([name, state, version]) => ({ name, state, version }));

const wslLines = () => {
  const listing = run('wsl.exe', ['-l', '-v'], { utf16: true });
  if (listing === null) return ['wsl: MISSING (wsl.exe absent or no distro installed)'];
  const distros = parseDistros(listing);
  const lines = [`wsl: ${distros.map((d) => `${d.name} ${d.state} v${d.version}`).join(', ')}`];
  const distro = distros.find((d) => !d.name.startsWith('docker-desktop'));
  if (!distro) return [...lines, 'wsl distro: MISSING (only docker-desktop; wsl --install -d Ubuntu)'];
  const script = [...new Set([...TOOLS, ...process.argv.slice(2)])]
    .map((tool) => `printf '%s: ' ${tool}; command -v ${tool} || echo MISSING`)
    .join('; ');
  const inside = run('wsl.exe', ['-d', distro.name, '-e', 'bash', '-lc', script]);
  lines.push(...(inside ?? 'tools: unknown (the distro did not answer)').split('\n').map((l) => `${distro.name}: ${l}`));
  const plugins = run('wsl.exe', ['-d', distro.name, '-e', 'bash', '-lc', 'claude plugin list']);
  const names = plugins?.match(/^\s*❯ (\S+)/gm)?.map((l) => l.replace(/^\s*❯ /, ''));
  lines.push(`${distro.name} plugins: ${names ? names.join(', ') : plugins === null ? 'unknown (claude plugin list failed)' : 'none'}`);
  return lines;
};

const dockerLines = () => {
  const cli = run('docker', ['--version']);
  if (cli === null) return ['docker: MISSING'];
  const server = run('docker', ['info', '--format', '{{.ServerVersion}}'], { timeout: 8_000 });
  return [`docker: ${cli}; daemon ${server ? `up (${server})` : 'down'}`];
};

export const probe = () => {
  const windows = process.platform === 'win32';
  return [
    `os: ${process.platform} ${process.arch}`,
    `node: ${process.version}`,
    `claude: ${run('claude', ['--version'], { timeout: 8_000 }) ?? 'MISSING'}`,
    `sandbox (native): ${windows ? 'none, Claude Code runs it on macOS, Linux and WSL2 only' : 'see the tools below'}`,
    ...(windows ? wslLines() : TOOLS.map((tool) => `${tool}: ${run('sh', ['-c', `command -v ${tool}`]) ?? 'MISSING'}`)),
    ...dockerLines(),
  ].join('\n');
};

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(probe());
