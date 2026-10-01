/*
 * node --test tests/background-tasks.test.mjs — the Stop hook, run as hooks/hooks.json declares it,
 * with Stop input shaped as code.claude.com/docs/en/hooks documents it (read 2026-10-01).
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const { hooks } = JSON.parse(readFileSync(new URL('../hooks/hooks.json', import.meta.url), 'utf8'));
const hook = hooks.Stop.flatMap((group) => group.hooks).find((h) => h.args[0].endsWith('background-tasks.mjs'));

const stop = (sessionId, backgroundTasks) => {
  const resolve = (value) => value.replaceAll('${CLAUDE_PLUGIN_ROOT}', ROOT);
  const input = { session_id: sessionId, transcript_path: '/tmp/t.jsonl', cwd: ROOT, hook_event_name: 'Stop', stop_hook_active: false, last_assistant_message: '', background_tasks: backgroundTasks, session_crons: [] };
  const run = spawnSync(resolve(hook.command), hook.args.map(resolve), { input: JSON.stringify(input), encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  return run.stdout ? JSON.parse(run.stdout) : null;
};
const shell = { id: 'task-1', type: 'shell', status: 'running', description: 'edit', command: "python3 - <<'EOF'" };
const fresh = () => {
  const id = `contract-${Math.random().toString(36).slice(2)}`;
  return [id, () => rmSync(join(tmpdir(), `devio-background-${id}.json`), { force: true })];
};

test('a running shell task blocks the stop and is named in the reason', () => {
  const [id, clean] = fresh();
  const out = stop(id, [shell]);
  clean();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /task-1: python3 -/);
  assert.match(out.reason, /TaskStop/);
});

test('the same task is not raised again straight after, so a dev server is not nagged each turn', () => {
  const [id, clean] = fresh();
  stop(id, [shell]);
  const second = stop(id, [shell]);
  clean();
  assert.equal(second, null);
});

test('nothing in flight, or only a subagent or a finished task, lets the turn end', () => {
  const [id, clean] = fresh();
  const out = [stop(id, []), stop(id, [{ ...shell, type: 'subagent' }]), stop(id, [{ ...shell, status: 'completed' }])];
  clean();
  assert.deepEqual(out, [null, null, null]);
});
