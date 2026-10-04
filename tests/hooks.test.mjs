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

// Ticket 19: plates come from any approved image on disk, not only an Impeccable comp, and the
// designer hears that plates need image generation before waiting for them.
test('the Assets row measures an outside image with comp-spec and names the image-generation need', () => {
  const row = TEXT.split('\n').find((line) => line.startsWith('| Assets'));
  assert.ok(row, 'no Assets row');
  for (const needle of ['impeccable-asset-producer', 'manual', 'comp-spec', 'new-work flow', 'OPENAI_API_KEY']) {
    assert.ok(row.includes(needle), `the Assets row lacks "${needle}"`);
  }
});

// Ticket 17: the field trial's miss was a session that never loaded a skill, so the row itself says
// a pick opens the round and only the designer's "this is it" closes it.
test('the References row routes to devio:references and says who closes a round', () => {
  const row = TEXT.split('\n').find((line) => line.startsWith('| References'));
  assert.ok(row, 'no References row');
  for (const needle of ['devio:references', 'moodboard', 'a pick opens the round', '"this is it"', 'firecrawl:firecrawl-search']) {
    assert.ok(row.includes(needle), `the References row lacks "${needle}"`);
  }
});

// Ticket 20: an identity, a manual or a prompt for a design tool is routed to devio:brand, not composed
// as a screen.
test('the routing table sends an identity, a brand manual or a design-tool prompt to devio:brand', () => {
  const row = TEXT.split('\n').find((line) => line.includes('`devio:brand`'));
  assert.ok(row, 'no row routes to devio:brand');
  for (const needle of ['identity', 'brand manual', 'prompt for a design tool', 'Claude Design']) {
    assert.ok(row.includes(needle), `the identity row lacks "${needle}"`);
  }
});

test('the subagent rule names devio:references for a subagent that gathers references', () => {
  const rule = TEXT.slice(TEXT.indexOf('Work handed to a subagent'), TEXT.indexOf('| Task |'));
  assert.ok(rule.includes('devio:references'), 'the subagent rule does not name devio:references');
  assert.equal(TEXT.split('devio:references').length - 1, 2, 'one routing row and the subagent rule name it; the bar is pasted nowhere');
});

// Ticket 18: a rejected design is deleted and the project keeps a rule, not an account; a lesson about
// devio's own process ends the reply as a Trial report and is never a file.
test('the lesson line deletes a rejected design and sends a process lesson to a Trial report', () => {
  const start = TEXT.indexOf('- A mistake in the work');
  assert.ok(start >= 0, 'no lesson line');
  const line = TEXT.slice(start, TEXT.indexOf('\n- ', start + 1)).replace(/\s+/g, ' ');
  for (const needle of ['A design the designer rejected is deleted', 'naming neither the design nor its look', 'Trial report', 'never as a file']) {
    assert.ok(line.includes(needle), `the lesson line lacks "${needle}"`);
  }
});

test('every session source gets the hook text',() => assert.equal(hooks.SessionStart[0].matcher, undefined));

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
