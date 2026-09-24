# 02: One hook script, no shell, with a contract test

**What to build:** Every session and every subagent receives the hook text from one Node script run
in exec form, so it arrives intact on Windows with or without Git Bash, and `SessionStart` fires on
every source, `fork` included. A contract test proves both hooks emit output Claude Code accepts,
which the eval suite cannot see for `SubagentStart`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] One script reads the event from the hook input on stdin and emits `hookSpecificOutput` with that event's name and the hook text as `additionalContext`
- [x] Both hooks are declared in exec form (`node` plus the script path under `${CLAUDE_PLUGIN_ROOT}`), neither has a matcher, and the old `cat` command and the SubagentStart-only script are gone
- [x] A `node:test` suite with no dependencies spawns each hook exactly as `hooks.json` declares it, feeds that event's input JSON on stdin, and asserts exit 0, JSON stdout, the matching `hookEventName`, a known line of the hook text, and at most 10,000 characters
- [x] The 10,000-character guard leaves the eval preparation script, which keeps copying the dependencies and a dependency-free devio
- [x] The README says how to run the contract test and its Layout table lists it
- [x] A real session with the plugin loaded from this worktree shows the hook text at session start and in a subagent's first turn

## Comments

2026-09-24, implemented. The real session: `claude -p --plugin-dir . --output-format stream-json
--verbose --include-hook-events` on Claude Code 2.1.281, with a prompt that opened an Explore
subagent. The stream showed devio's `hook_response` for `SessionStart` and for `SubagentStart`, both
`success`, exit 0, 7,258 characters with `→` intact; the main session and the subagent each quoted
`# How work is done here (devio plugin)`. This also settles the spec's open question:
`--include-hook-events` does stream `SubagentStart`.
