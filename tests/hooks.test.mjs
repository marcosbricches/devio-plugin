/*
 * node --test — the hook contract, for both events.
 *
 * Claude Code ignores malformed hook output without an error, and a `claude plugin eval` trace
 * never shows SubagentStart, so each hook is spawned here exactly as hooks/hooks.json declares it and its stdout is checked against the
 * documented output shape (code.claude.com/docs/en/hooks, "SessionStart", "SubagentStart", read
 * 2026-09-24). The input JSON follows the same page: common fields plus each event's own.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const { hooks } = JSON.parse(readFileSync(new URL('../hooks/hooks.json', import.meta.url), 'utf8'));

// Past this many characters the model sees only a 2,000-character preview of a saved file, and
// the cap has no setting (code.claude.com/docs/en/hooks, "Add context for Claude", read 2026-09-24).
const CONTEXT_CAP = 10_000;
// The hook text's opening heading: edits to the routing and the chains leave it alone.
const KNOWN_LINE = '# How work is done here (devio plugin)';

const common = { session_id: 'contract-test', transcript_path: '/tmp/contract-test.jsonl', cwd: ROOT };
const INPUTS = {
  SessionStart: { ...common, hook_event_name: 'SessionStart', source: 'fork', model: 'claude-opus-5-5' },
  SubagentStart: { ...common, hook_event_name: 'SubagentStart', agent_id: 'agent-contract-test', agent_type: 'Explore' },
};

for (const [event, input] of Object.entries(INPUTS)) {
  test(`${event} adds the hook text as additionalContext`, () => {
    const groups = hooks[event];
    assert.ok(groups, `hooks.json declares no ${event} hook`);
    for (const group of groups) {
      assert.equal(group.matcher, undefined, `${event} has a matcher, so some sources get no hook text`);
      for (const hook of group.hooks) {
        assert.ok(Array.isArray(hook.args), `${event} runs through a shell; declare it in exec form with args`);
        const resolve = (value) => value.replaceAll('${CLAUDE_PLUGIN_ROOT}', ROOT);
        const run = spawnSync(resolve(hook.command), hook.args.map(resolve), {
          input: JSON.stringify(input),
          env: { ...process.env, CLAUDE_PLUGIN_ROOT: ROOT },
          encoding: 'utf8',
        });

        assert.equal(run.status, 0, run.stderr);
        const output = JSON.parse(run.stdout);
        assert.equal(output.hookSpecificOutput.hookEventName, event);
        const context = output.hookSpecificOutput.additionalContext;
        assert.ok(context.includes(KNOWN_LINE), 'additionalContext does not hold the hook text');
        assert.ok(context.length <= CONTEXT_CAP, `additionalContext is ${context.length} characters, over ${CONTEXT_CAP}`);
      }
    }
  });
}
