/*
 * npm test — runs every measurement script against the fixture and asserts the
 * shape of its JSON.
 *
 * This is the one thing worth asserting here: prose and pixels are judged by
 * eye, but a script that drops a declared field breaks every caller silently.
 * The test therefore checks that the fields exist and are of the right type,
 * never what the numbers are — the fixture's contrast or line count is free to
 * change without the test having an opinion.
 *
 * The fixture is served by the plugin's own static server on a port taken from
 * the OS, so a stray server from an earlier run cannot make this pass or fail.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

const HERE = import.meta.dirname;
const SKILL = join(HERE, '..');
const PLUGIN = join(SKILL, '..', '..');
const SERVER = join(PLUGIN, 'skills', 'cumulative-prototype', 'scaffold', 'tools', 'serve.mjs');
const FIXTURE = join(SKILL, 'fixture');
const CONFIG = join(FIXTURE, 'measure.config.mjs');

const freePort = () =>
  new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on('error', reject);
    probe.listen(0, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });

const reachable = async (url, attempts = 60) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      /* server not up yet */
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`fixture server never answered on ${url}`);
};

const runScript = (name, env) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(SKILL, 'scripts', name), CONFIG], {
      env: { ...process.env, ...env },
      cwd: PLUGIN,
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (chunk) => (out += chunk));
    child.stderr.on('data', (chunk) => (err += chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`${name} exited ${code}\n${err}`));
      try {
        resolve(JSON.parse(out));
      } catch {
        reject(new Error(`${name} did not print JSON\n${out}\n${err}`));
      }
    });
  });

const assertEnvelope = (payload, measurement) => {
  assert.equal(payload.measurement, measurement);
  assert.ok(Date.parse(payload.generatedAt), 'generatedAt is an ISO timestamp');
  assert.match(payload.baseUrl, /^https?:\/\//);
  assert.ok(Array.isArray(payload.results), 'results is an array');
  assert.ok(payload.results.length > 0, 'results is not empty');
};

describe('measurement scripts', { timeout: 180_000 }, () => {
  let server;
  let env;
  let outDir;

  before(async () => {
    const port = await freePort();
    outDir = await mkdtemp(join(tmpdir(), 'devio-measure-'));
    server = spawn(process.execPath, [SERVER, String(port), FIXTURE], { stdio: 'ignore' });
    const baseUrl = `http://127.0.0.1:${port}`;
    env = { FIXTURE_BASE_URL: baseUrl, MEASURE_OUT_DIR: outDir };
    await reachable(`${baseUrl}/`);
  });

  after(async () => {
    server?.kill();
    if (outDir) await rm(outDir, { recursive: true, force: true });
  });

  it('capture returns one entry per route per width class', async () => {
    const payload = await runScript('capture.mjs', env);
    assertEnvelope(payload, 'capture');
    assert.equal(payload.results.length, 4);
    assert.ok(payload.outDir, 'outDir is reported');
    for (const entry of payload.results) {
      assert.equal(typeof entry.route, 'string');
      assert.match(entry.url, /^https?:\/\//);
      assert.ok(['mobile', 'desktop'].includes(entry.widthClass));
      assert.equal(typeof entry.viewport.width, 'number');
      assert.equal(typeof entry.documentSize.height, 'number');
      assert.match(entry.file, /\.png$/);
    }
  });
});
