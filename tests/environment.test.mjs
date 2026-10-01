/*
 * node --test tests/environment.test.mjs — the probe of skills/environment, checked against a
 * known machine: the one it was written on (Windows, WSL2 with Ubuntu holding bwrap, socat, claude,
 * node). On any other machine the WSL assertions are skipped, never loosened.
 */
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseDistros } from '../skills/environment/probe.mjs';

const PROBE = fileURLToPath(new URL('../skills/environment/probe.mjs', import.meta.url));
const probe = (...tools) => spawnSync('node', [PROBE, ...tools], { encoding: 'utf8' }).stdout;
const hasUbuntu = process.platform === 'win32' && spawnSync('wsl.exe', ['-d', 'Ubuntu', '-e', 'true']).status === 0;

test('the distro listing parses, default marker and state included', () => {
  const listing = '  NAME              STATE           VERSION\r\n* docker-desktop    Stopped         2\r\n  Ubuntu            Running         2\r\n';
  assert.deepEqual(parseDistros(listing), [
    { name: 'docker-desktop', state: 'Stopped', version: '2' },
    { name: 'Ubuntu', state: 'Running', version: '2' },
  ]);
});

test('a tool that is not there shows as missing, one that is does not', { skip: !hasUbuntu }, () => {
  const out = probe('tool-removed-on-purpose');
  assert.match(out, /^Ubuntu: tool-removed-on-purpose: MISSING$/m);
  for (const tool of ['bwrap', 'socat', 'claude', 'node']) assert.match(out, new RegExp(`^Ubuntu: ${tool}: /\\S+$`, 'm'));
  assert.match(out, /^wsl: .*Ubuntu Running v2/m);
});

test('Docker is reported with its CLI and its daemon separately', () => {
  assert.match(probe(), /^docker: (MISSING|.+; daemon (up|down))/m);
});
