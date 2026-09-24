// SessionStart and SubagentStart: a subagent does not receive what SessionStart added, so both
// events get the hook text, and hookSpecificOutput.additionalContext is the one path that adds
// context for both (code.claude.com/docs/en/hooks, "SessionStart", "SubagentStart", read
// 2026-09-24). Run in exec form, with no shell: on Windows without Git Bash, `cat` went through
// PowerShell 5.1, which read the file as ANSI and garbled its non-ASCII characters.
import { readFileSync } from 'node:fs';

const { hook_event_name: hookEventName } = JSON.parse(readFileSync(0, 'utf8'));
const additionalContext = readFileSync(new URL('./how-we-work.md', import.meta.url), 'utf8');
process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext } }));
