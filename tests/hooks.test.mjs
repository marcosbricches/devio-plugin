/*
 * node --test — the hook contract. Claude Code drops a malformed hook output without an error, and
 * an eval trace never shows SubagentStart, so each hook runs here exactly as hooks/hooks.json
 * declares it, with its event's input, and its output is checked against code.claude.com/docs/en/hooks
 * (read 2026-09-26).
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const { hooks } = JSON.parse(readFileSync(new URL('../hooks/hooks.json', import.meta.url), 'utf8'));
const TEXT = readFileSync(new URL('../hooks/how-we-work.md', import.meta.url), 'utf8');
// Past it, the model gets a file path and a 2,000-character preview instead ("Add context for Claude").
const CONTEXT_CAP = 10_000;

const common = { session_id: 'contract-test', transcript_path: '/tmp/contract-test.jsonl', cwd: ROOT };
const INPUTS = {
  SessionStart: { ...common, hook_event_name: 'SessionStart', source: 'fork', model: 'claude-opus-5-5' },
  SubagentStart: { ...common, hook_event_name: 'SubagentStart', agent_id: 'contract-test', agent_type: 'general-purpose' },
};

test('the hook text fits the context cap', () => assert.ok(TEXT.length <= CONTEXT_CAP, `${TEXT.length} characters`));

test('every session source gets the hook text', () => assert.equal(hooks.SessionStart[0].matcher, undefined));

test('subagents that do work get the hook text; lookup-only ones skip it', () => {
  const matches = (type) => new RegExp(hooks.SubagentStart[0].matcher).test(type);
  for (const type of ['general-purpose', 'Plan', 'devio-custom']) assert.ok(matches(type), type);
  for (const type of ['Explore', 'claude-code-guide']) assert.ok(!matches(type), type);
});

for (const [event, input] of Object.entries(INPUTS)) {
  test(`${event} adds the hook text as additionalContext`, () => {
    for (const hook of hooks[event].flatMap((group) => group.hooks)) {
      assert.ok(Array.isArray(hook.args), 'exec form with args, so no shell touches the text');
      const resolve = (value) => value.replaceAll('${CLAUDE_PLUGIN_ROOT}', ROOT);
      const run = spawnSync(resolve(hook.command), hook.args.map(resolve), { input: JSON.stringify(input), encoding: 'utf8' });
      assert.equal(run.status, 0, run.stderr);
      const { hookSpecificOutput } = JSON.parse(run.stdout);
      assert.equal(hookSpecificOutput.hookEventName, event);
      assert.equal(hookSpecificOutput.additionalContext, TEXT);
    }
  });
}
