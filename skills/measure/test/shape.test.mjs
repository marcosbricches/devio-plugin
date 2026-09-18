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

  it('contrast-on-photo returns one entry per rendered line', async () => {
    const payload = await runScript('contrast-on-photo.mjs', env);
    assertEnvelope(payload, 'contrast-on-photo');
    assert.ok(payload.selector, 'the selector it measured is reported');
    for (const line of payload.results) {
      assert.equal(typeof line.route, 'string');
      assert.ok(['mobile', 'desktop'].includes(line.widthClass));
      assert.equal(typeof line.lineIndex, 'number');
      assert.equal(typeof line.text, 'string');
      assert.match(line.colour, /^rgba?\(/);
      assert.equal(typeof line.rect.width, 'number');
      assert.ok(line.samples > 0, 'at least one pixel sampled');
      for (const field of ['minContrast', 'medianContrast', 'maxContrast']) {
        assert.ok(line[field] >= 1, `${field} is a contrast ratio`);
      }
      assert.ok(line.minContrast <= line.medianContrast && line.medianContrast <= line.maxContrast);
      for (const field of ['shareBelow4_5', 'shareBelow3']) {
        assert.ok(line[field] >= 0 && line[field] <= 1, `${field} is a share`);
      }
    }
  });

  it('scroll-junctions returns three phases per junction per width class', async () => {
    const payload = await runScript('scroll-junctions.mjs', env);
    assertEnvelope(payload, 'scroll-junctions');
    assert.deepEqual(payload.phases, [0, 50, 100]);
    assert.equal(payload.results.length % 3, 0, 'junctions come in threes');
    for (const shot of payload.results) {
      assert.equal(typeof shot.junction, 'string');
      assert.equal(typeof shot.top, 'number');
      assert.ok(payload.phases.includes(shot.phase));
      assert.equal(typeof shot.scrollY, 'number');
      assert.match(shot.file, /--\d+\.png$/);
    }
  });

  it('line-breaks returns the real lines of each text block', async () => {
    const payload = await runScript('line-breaks.mjs', env);
    assertEnvelope(payload, 'line-breaks');
    assert.ok(payload.selector);
    for (const block of payload.results) {
      assert.equal(typeof block.tag, 'string');
      assert.equal(typeof block.fontSize, 'string');
      assert.ok(block.lineCount > 0);
      assert.equal(block.lines.length, block.lineCount);
      assert.equal(typeof block.widow, 'boolean');
      assert.ok(block.widestLine > 0);
      for (const line of block.lines) {
        assert.equal(typeof line.text, 'string');
        assert.ok(line.width >= 0);
      }
    }
    const title = payload.results.find((block) => block.tag === 'h1' && block.widthClass === 'mobile');
    assert.ok(title.lineCount > 1, 'the fixture title wraps at 375 px');
  });

  it('focus-path returns the stop order and the four machine-decidable checks', async () => {
    const payload = await runScript('focus-path.mjs', env);
    assertEnvelope(payload, 'focus-path');
    assert.equal(payload.minTargetPx, 24);
    for (const route of payload.results) {
      assert.equal(route.stopCount, route.stops.length);
      assert.equal(typeof route.returnSymmetric, 'boolean');
      for (const field of ['stopsWithoutRing', 'stopsUnderTarget', 'stopsInHiddenText']) {
        assert.ok(Array.isArray(route[field]), `${field} is an array`);
      }
      for (const stop of route.stops) {
        assert.equal(typeof stop.tag, 'string');
        assert.equal(typeof stop.signature, 'string');
        assert.equal(typeof stop.hasRing, 'boolean');
        assert.equal(typeof stop.inHiddenText, 'boolean');
        assert.equal(typeof stop.rect.width, 'number');
      }
    }
    const home = payload.results.find((route) => route.route === '/');
    assert.equal(
      home.stops.filter((stop) => stop.name === 'Read it').length,
      3,
      'repeated link names are three separate stops, not one',
    );
  });

  it('trace-cost returns self time per category between the two marks', async () => {
    const payload = await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          join(SKILL, 'scripts', 'trace-cost.mjs'),
          CONFIG,
          join(FIXTURE, 'trace.json'),
          'composition:start',
          'composition:end',
        ],
        { env: { ...process.env, ...env }, cwd: PLUGIN },
      );
      let out = '';
      let err = '';
      child.stdout.on('data', (chunk) => (out += chunk));
      child.stderr.on('data', (chunk) => (err += chunk));
      child.on('close', (code) =>
        code === 0 ? resolve(JSON.parse(out)) : reject(new Error(`trace-cost exited ${code}\n${err}`)),
      );
    });

    assertEnvelope(payload, 'trace-cost');
    assert.equal(payload.startMark, 'composition:start');
    assert.equal(payload.endMark, 'composition:end');
    assert.ok(payload.spanMs > 0);
    assert.equal(typeof payload.thread, 'string');
    assert.equal(typeof payload.totalSelfMs, 'number');
    for (const entry of payload.results) {
      assert.ok(['scripting', 'rendering', 'painting', 'loading', 'other'].includes(entry.category));
      assert.ok(entry.selfMs >= 0);
      assert.ok(entry.events > 0);
    }
  });
});
