# 02: One hook script, no shell, with a contract test

**What to build:** Every session and every subagent receives the hook text from one Node script run
in exec form, so it arrives intact on Windows with or without Git Bash, and `SessionStart` fires on
every source, `fork` included. A contract test proves both hooks emit output Claude Code accepts,
which the eval suite cannot see for `SubagentStart`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One script reads the event from the hook input on stdin and emits `hookSpecificOutput` with that event's name and the hook text as `additionalContext`
- [ ] Both hooks are declared in exec form (`node` plus the script path under `${CLAUDE_PLUGIN_ROOT}`), neither has a matcher, and the old `cat` command and the SubagentStart-only script are gone
- [ ] A `node:test` suite with no dependencies spawns each hook exactly as `hooks.json` declares it, feeds that event's input JSON on stdin, and asserts exit 0, JSON stdout, the matching `hookEventName`, a known line of the hook text, and at most 10,000 characters
- [ ] The 10,000-character guard leaves the eval preparation script, which keeps copying the dependencies and a dependency-free devio
- [ ] The README says how to run the contract test and its Layout table lists it
- [ ] A real session with the plugin loaded from this worktree shows the hook text at session start and in a subagent's first turn
