// SubagentStart hook: a subagent does not receive what SessionStart printed
// (code.claude.com/docs/en/hooks, "SubagentStart", read 2026-09-23), so the same text goes to it
// as additionalContext, the only way this event adds context.
import { readFileSync } from 'node:fs';

const additionalContext = readFileSync(new URL('./how-we-work.md', import.meta.url), 'utf8');
process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext } }));
