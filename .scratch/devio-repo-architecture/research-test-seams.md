# Research: test seams for a plugin that is two context-injection hooks

Question: devio's only runtime code is two hooks, `SessionStart` and `SubagentStart`, that put
`hooks/how-we-work.md` into Claude's context as `hookSpecificOutput.additionalContext`, planned as one
node script run in exec form. How should such a plugin be tested, and which test seams do the
official docs and well-maintained plugins use? Candidates: the `claude plugin eval` suite with its
no-plugin baseline, `claude plugin validate --strict`, unit tests of the hook script (JSON on stdin,
check stdout), and smoke runs (`--plugin-dir`, `/hooks`, `claude --debug`, `claude -p`).

All sources read 2026-09-24. Official docs were fetched as raw Markdown with `curl` from
`https://code.claude.com/docs/en/<page>.md`; GitHub sources with `gh api` at the commit named. Local
checks ran on Claude Code 2.1.281 (`claude --version`). Where this repository's state matters: today
`hooks/hooks.json` runs `SessionStart` as shell form (`cat .../how-we-work.md`, plain stdout) and
`SubagentStart` as shell form (`node .../subagent-start.mjs`, JSON); the single exec-form script is
the planned shape, not the current one.

## 1. Official docs: hooks reference and hooks guide

**The docs' own test for a hook script is piping JSON into it.** Under "Hook error in output":
"Test it manually by piping sample JSON", with `echo '{"tool_name":"Bash",...}' | ./my-hook.sh` and
`echo $?`. The plugins reference repeats it for plugin hooks: "Test the script manually".
https://code.claude.com/docs/en/hooks-guide.md, "Limitations and troubleshooting" (read 2026-09-24)
https://code.claude.com/docs/en/plugins-reference.md, "Hook troubleshooting" (read 2026-09-24)

**Several failure modes are silent at runtime, which is what a unit test is for.**
- "When your hook returns `permissionDecision` or `additionalContext` at the top level instead of
  inside `hookSpecificOutput`, the JSON still parses, and Claude Code ignores the misplaced fields
  without reporting an error." Seen only in the debug log as `Hook JSON output had unrecognized keys`.
- Output that does not start with `{` is treated as plain text and the JSON is ignored; "On exit 0
  nothing is reported in the transcript". Shell form on Windows goes through Git Bash, which can
  source the user's profile and prepend text; exec form spawns the executable directly with no shell.
- "Successful run: you see nothing, unless the hook's JSON surfaces something".
https://code.claude.com/docs/en/hooks-guide.md, "Hook JSON has no effect", "Debug techniques" (read 2026-09-24)
- When stdout looks like JSON but fails to parse, "On the events that add plain-text stdout as
  context, Claude Code doesn't add the text" (behaviour since v2.1.248).
- For most events plain stdout goes only to the debug log; `SessionStart` is one of the exceptions
  that adds plain stdout as context. `SubagentStart` is not in that list, so for it only the JSON
  `additionalContext` path adds context.
https://code.claude.com/docs/en/hooks.md, "Exit code 0" (read 2026-09-24)

**The size cap is a hard contract.** `additionalContext` and plain stdout "are capped at 10,000
characters"; over it, Claude gets a file path and "a preview of up to the first 2,000 characters",
and "this cap has no setting or environment variable to raise it".
https://code.claude.com/docs/en/hooks.md, "JSON output" and "Add context for Claude" (read 2026-09-24)

**Shapes to assert.** `SubagentStart` input carries `agent_id` and `agent_type` besides the common
fields; its output is `{"hookSpecificOutput": {"hookEventName": "SubagentStart", "additionalContext": ...}}`.
`SessionStart` takes the same shape with `hookEventName: "SessionStart"`; its matcher values are
`startup`, `resume`, `clear`, `compact` and `fork` (the last reported as `resume` before v2.1.214).
https://code.claude.com/docs/en/hooks.md, "SessionStart", "SubagentStart" (read 2026-09-24)

**Exec form.** Runs when `args` is present; no shell; `${CLAUDE_PLUGIN_ROOT}` is substituted into
`command` and each `args` element; on Windows, `command` must be a real executable, and "The `node`
plus script-path pattern works on every platform because `node.exe` is a real binary". Both forms
also export `CLAUDE_PLUGIN_ROOT` to the process.
https://code.claude.com/docs/en/hooks.md, "Exec form and shell form" (read 2026-09-24)

**Where a live run shows hook execution.** "Hook execution details are written to the debug log
file": `claude --debug-file <path>` or `claude --debug` (log at `~/.claude/debug/<session-id>.txt`);
`CLAUDE_CODE_DEBUG_LOG_LEVEL=verbose` adds matcher counts. `/hooks` lists registered hooks with
their source; it is read-only.
https://code.claude.com/docs/en/hooks.md, "Debug hooks"; https://code.claude.com/docs/en/hooks-guide.md, "Verify the configuration"; https://code.claude.com/docs/en/debug-your-config.md, "Check hooks" (read 2026-09-24)

## 2. Official docs: plugins, validate, headless

**`--plugin-dir` is the documented manual smoke.** "Use the `--plugin-dir` flag to test plugins
during development"; for hooks, "Trigger the event each hook matches ... and confirm its effect.
Claude Code records which hooks matched, their exit codes, and their output in the debug log". The
same page then points to evals: "Trying the plugin with `--plugin-dir` tells you it can work. To
find out how often Claude actually reaches for it and gets the right result, run it against a set of
test prompts with `claude plugin eval`."
https://code.claude.com/docs/en/plugins.md, "Test your plugins locally" (read 2026-09-24)
A plugin and its dependency can be loaded together with two `--plugin-dir` flags; the local copy
satisfies a dependency entry that names a marketplace (since v2.1.242).
https://code.claude.com/docs/en/plugin-dependencies.md, "Test a plugin and its dependency locally" (read 2026-09-24)

**`claude plugin validate`** checks "`plugin.json`, `hooks/hooks.json`, and the frontmatter of the
skills, agents, and commands" for syntax and schema errors. It exits 0/1/2. `--strict`: "Treat
warnings as errors and exit 1 on them. Use in CI to catch issues the runtime tolerates, such as
unrecognized fields". `--json` (v2.1.259+) prints one report object with per-file `errors`,
`warnings` and `notes`. Pointed at a marketplace directory, the validator "doesn't open the plugins'
skill, agent, command, or hook files".
https://code.claude.com/docs/en/plugins-reference.md, "plugin validate", "Debugging and development tools" (read 2026-09-24)
https://code.claude.com/docs/en/plugin-marketplaces.md, "Marketplace validation errors" (read 2026-09-24)
The eval page draws the line itself: to check "syntax and schema errors rather than its behavior,
use `claude plugin validate`".
https://code.claude.com/docs/en/plugin-evals.md, intro (read 2026-09-24)

**Headless runs expose hook events and load errors as data.** In `-p` with
`--output-format stream-json`, `hook_started`, `hook_progress` and `hook_response` events stream
for `SessionStart` before `system/init`. `system/init` carries `plugins` and `plugin_errors`, under a
heading "Fail CI when a plugin or MCP server doesn't load". `--include-hook-events` includes "hook
lifecycle events in the output stream. `SessionStart` and `Setup` hook events are always included
and don't need this flag"; it lists events that never produce `hook_started`, and `SubagentStart`
is not among them. The `hook_response` message carries `hook_event`, `output`, `stdout`, `stderr`,
`exit_code` and `outcome`.
https://code.claude.com/docs/en/headless.md, "Read session metadata", "Fail CI when a plugin or MCP server doesn't load" (read 2026-09-24)
https://code.claude.com/docs/en/cli-reference.md, `--include-hook-events` (read 2026-09-24)
https://code.claude.com/docs/en/agent-sdk/typescript.md, `SDKHookResponseMessage` (read 2026-09-24)

## 3. Official docs: `claude plugin eval`

**A run loads the plugin's hooks.** "`claude plugin eval` loads the target plugin's skills and
hooks"; each run is "a `claude -p` child process with only your plugin loaded" in a throwaway home,
with no user settings, hooks, `CLAUDE.md`, other plugins or memory. Graders can target
`last_message`, `trace` ("The session as JSON, one message per line"), `files`, one file's contents,
or `mock_calls`. The page says nothing about which hook events appear in the trace.
https://code.claude.com/docs/en/plugin-evals.md, "How runs are isolated", "What a grader can look at" (read 2026-09-24)

**The baseline.** Each case runs again with no plugin; "Their difference, `Δ`, is what the plugin
contributed. If a case scores 1.0 both with and without the plugin, the plugin isn't what made it
pass." `--ablation none` runs one arm and "halves the cost when you don't need the comparison, such
as while iterating on graders".
https://code.claude.com/docs/en/plugin-evals.md, "The no-plugin baseline", "Score against the no-plugin baseline" (read 2026-09-24)

**CI.** Run with `--json`, fail on the exit code, pass `--trust-plugin`, pin `--model` and
`--judge-model`, `--no-publish`, `--max-cost-usd`. Exit 0 all cases at threshold, 1 below threshold
or setup failure, 2 partial. The runner needs credentials such as `ANTHROPIC_API_KEY`. "To keep
costs predictable, give quick every-change suites only graders that don't call a judge, use
`--ablation none` where you don't need `Δ`". When a plugin ships hooks, "treat its scores as
advisory unless you ran it in an isolated environment such as a container or CI runner".
https://code.claude.com/docs/en/plugin-evals.md, "Run evals in CI", "What a run can access" (read 2026-09-24)
`claude plugin eval` shipped in the week of 2026-09-07 to 09-11.
https://code.claude.com/docs/en/whats-new/2026-w37.md (read 2026-09-24)

## 4. What devio's own eval traces show

The docs do not say whether hook-injected context reaches a grader, so the traces of this
repository's earlier eval runs were read (`%TEMP%\claude-eval-*\out\trace.jsonl`, four runs from
2026-09-23, Claude Code 2.1.281, devio 0.1.1, which already had both hooks per `CHANGELOG.md`):
- Each trace is the stream-json session. It opens with `system/hook_started` and
  `system/hook_response` events for `SessionStart:startup`; devio's response has `outcome: "success"`,
  `exit_code: 0`, and its `output` holds the hook text (the string "Research comes before any task"
  appears once per trace). `system/init` lists devio under `plugins` as `devio@inline`.
- Three of the four runs started a subagent (`system/task_started`, `subagent_type:
  "general-purpose"`, and messages with a `parent_tool_use_id`). None of the four contains a
  `SubagentStart` event, and the hook text does not appear a second time.
So a `regex` grader on `trace` can confirm the `SessionStart` injection; nothing in the trace shows
whether `SubagentStart` fired or what it injected. This matches the CLI reference: only
`SessionStart` and `Setup` events are streamed without `--include-hook-events`, and the eval docs
list no way to pass that flag. This repository's grader `evals/claude-code-question/graders/official-docs-consulted.md`
already relies on the first point ("The hook text itself names the docs index, so the pattern
matches tool inputs only").

## 5. Maintained plugins

**Vercel (`vercel/vercel-plugin`, installed 0.49.1; repo HEAD `95fdc45`).** Three `SessionStart`
command hooks (`node .../inject-claude-md.mjs` and two more), plus `PostToolUse` and `SessionEnd`.
46 files under `tests/`, run by `bun test`. `tests/inject-claude-md.test.ts` spawns
`node hooks/inject-claude-md.mjs`, writes a JSON payload to stdin, and asserts exit code 0 and what
stdout contains and does not contain ("injects the always-on capability-routing contract",
environment variants such as `VERCEL_PLUGIN_GREENFIELD=true`). `tests/hooks-json-structural.test.ts`
imports `hooks/hooks.json` and asserts which scripts are and are not registered. CI
(`.github/workflows/ci.yml`): generated-file checks, build, typecheck, `bun run validate` (its own
skill validator), `bun test`. A separate `scripts/benchmark-runner.ts` runs `claude --print` over
scenario projects with trace logging to check which skills got injected; it is not in CI.
Local: `~/.claude/plugins/cache/claude-plugins-official/vercel/0.49.1/` (read 2026-09-24)

**Superpowers (`obra/superpowers`, HEAD `5bf4e78`; test file at `5151e7a`, 2026-07-24).** One
`SessionStart` hook. `tests/hooks/test-session-start.sh` runs the hook under `env -i` with a
throwaway `HOME`, parses stdout with `node`, and asserts per host: for Claude Code, `hookSpecificOutput`
present, no top-level context field, `hookEventName === "SessionStart"`, `additionalContext` a
non-empty string, forbidden strings absent. It also asserts the registration in `hooks/hooks.json`
(`shell: "bash"`, with a comment on why: Windows PowerShell and cmd break on the quoted command) and
runs the hook both directly and through its `run-hook.cmd` wrapper. Separately,
`tests/claude-code/` drives `claude -p` with a prompt and greps the output (`run_claude`,
`assert_contains`, `assert_order`); its README calls the integration tests slow (10 to 30
minutes). The repository has no `.github/workflows`.
https://github.com/obra/superpowers/blob/5151e7aebece23c77545df8af6b9902f9fda7364/tests/hooks/test-session-start.sh (read 2026-09-24)
https://github.com/obra/superpowers/tree/5bf4e78011075bcfc0dc295f0724994cd123ee71/tests/claude-code (read 2026-09-24)

**OpenAI's Codex plugin (`openai/codex-plugin-cc`, HEAD `db52e28`; installed 1.0.6).** `SessionStart`
and `SessionEnd` run `node .../session-lifecycle-hook.mjs <event>`. `tests/runtime.test.mjs`
(`node:test`) spawns that script with a JSON payload on stdin and a temporary `CLAUDE_ENV_FILE`, and
asserts exit 0 and the exact file contents it wrote. CI (`pull-request-ci.yml`): `npm ci`,
`npm test`, `npm run build`.
https://github.com/openai/codex-plugin-cc/blob/db52e28f4d9ded852ab3942cea316258ae4ef346/tests/runtime.test.mjs (read 2026-09-24)

**Anthropic's official marketplace (`anthropics/claude-plugins-official`, HEAD `6bfd4e0`).**
`explanatory-output-style` and `learning-output-style` are the closest to devio: a `SessionStart`
hook (`hooks-handlers/session-start.sh`) that injects instructions. Neither ships tests. The
repository's gate is `validate-plugins.yml`, which calls
`anthropics/claude-plugins-community/.github/actions/validate-plugins`, described in its
`action.yml` as "`claude plugin validate` (the source-of-truth schema check) plus a layer of"
invariant checks; the workflow's path filters include `plugins/*/hooks/**`.
https://github.com/anthropics/claude-plugins-official/tree/6bfd4e0c6d3da6050984fa5ed8281d915fa7ed69 (read 2026-09-24)

**mattpocock-skills (installed 1.2.3).** No hooks and no tests; its only workflow is `release.yml`
(changesets). Not evidence either way for hooks.

No maintained plugin found uses `claude plugin eval`; the feature is two weeks old (section 3).

## 6. mattpocock-skills on seam choice

- `tdd`: "A seam is the public boundary you test at: the interface where you observe behavior without
  reaching inside." "Test only at pre-agreed seams ... confirm them with the user." Tests "verify
  behavior through public interfaces, not implementation details". Anti-patterns include
  implementation-coupled tests and tautological ones, whose expected value "recomputes the expected
  value the way the code does"; expected values "must come from an independent source of truth".
  `mocking.md`: mock "at system boundaries only".
- `to-spec`: "Existing seams should be preferred to new ones. Use the highest seam possible. If new
  seams are needed, propose them at the highest point you can. The fewer seams across the codebase,
  the better - the ideal number is one."
- `diagnosing-bugs`: a regression test goes in only at a "correct seam", one that "exercises the real
  bug pattern as it occurs at the call site"; a seam that is too shallow "gives false confidence".
- `codebase-design`: "The interface is the test surface. Callers and tests cross the same seam."
`~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.2.3/skills/engineering/{tdd/SKILL.md,tdd/tests.md,tdd/mocking.md,to-spec/SKILL.md,diagnosing-bugs/SKILL.md,codebase-design/SKILL.md}` (read 2026-09-24)

## 7. Local checks on this worktree

- `claude plugin validate .` resolves to the marketplace manifest and passes; per the docs it does
  not open the hook files from there.
- `claude plugin validate .claude-plugin/plugin.json --strict` exits 1 on the one warning this
  repository expects, "CLAUDE.md at the plugin root is not loaded as project context". Without
  `--strict` it passes with that warning. So `--strict` as written would fail every run.
- `echo '{"hook_event_name":"SubagentStart",...}' | node hooks/subagent-start.mjs` prints JSON with
  `hookEventName: "SubagentStart"` and a 7,258-character `additionalContext`.

## What the evidence supports

The ideal of one seam does not hold here, because the highest seam cannot see half the product.
Two seams, each covering what the other cannot, plus the manifest check the docs keep separate:

- **Seam 1: the eval suite, for behaviour.** It is the highest seam, a real `claude -p` session with
  the plugin's hooks loaded (section 3), and it is the only one that answers whether the text
  changes what Claude does. Its trace shows the `SessionStart` injection and its outcome (section 4).
  The docs say Δ is "what the plugin contributed" and a case at 1.0 in both arms proves nothing about
  the plugin; the suite currently runs `--ablation none`. Running the baseline at release doubles
  the agent runs; `--ablation none` while iterating is what the docs suggest. That split is the
  designer's call. The eval needs credentials (`ANTHROPIC_API_KEY` or equivalent) and costs a model
  call per run, so it runs locally or in a credentialed CI job, not free on every change.
- **Seam 2: the hook process, for the contract.** Spawn the script exactly as `hooks/hooks.json`
  declares it (`command` plus `args`, with `CLAUDE_PLUGIN_ROOT` set), write each event's documented
  input to stdin, and assert: exit 0; stdout starts with `{` and parses; `hookSpecificOutput.hookEventName`
  equals the event; `additionalContext` is non-empty, contains a known literal from the hook text,
  and is at most 10,000 characters. This is what Vercel, Superpowers and the Codex plugin all do
  (section 5), it is what the docs suggest for a failing hook (section 1), and it is the only
  deterministic seam that sees `SubagentStart`'s output, which no eval trace shows (section 4). It
  also catches the failures the runtime keeps silent: fields at the wrong level, a non-JSON prefix,
  unparsable JSON, text over the cap. Reading the command from `hooks.json` instead of hard-coding the
  script path keeps registration and script in one test, as Superpowers does. `node:test` needs no
  dependency. Comparing `additionalContext` to the file the script reads would be tautological by
  the `tdd` skill's rule; a known literal and the cap are independent.
- **Not a seam, a check: `claude plugin validate` on the plugin manifest.** It covers `hooks.json`
  schema, which neither seam above tests. Without `--strict` for now: `--strict` fails on the
  expected `CLAUDE.md` warning (section 7). `--json` would let a script fail on any other warning
  (section 2).
- **Manual, when debugging:** `claude --plugin-dir . --debug-file <path>` and `/hooks`. These are
  what the docs prescribe for finding out why a hook did not fire, not a repeatable test.

Could not be confirmed:
- That `claude -p --output-format stream-json --verbose --include-hook-events` emits a
  `hook_response` for `SubagentStart`. The CLI reference implies it (the event is not on the list of
  those that never produce `hook_started`), but no run was made. If it does, a headless smoke run
  could observe `SubagentStart` in a live session.
- Whether any eval grader can see a subagent's injected context. The docs are silent; four traces
  say no, which is observation, not contract.
- No maintained plugin was found testing with `claude plugin eval`, so there is no community
  precedent yet for the eval half.
