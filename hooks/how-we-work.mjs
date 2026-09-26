// additionalContext is the one output both SessionStart and SubagentStart add to context
// (code.claude.com/docs/en/hooks). Node in exec form, not `cat`: without Git Bash, Windows ran `cat`
// through PowerShell 5.1, which read the file as ANSI and garbled its non-ASCII characters.
import { readFileSync } from 'node:fs';

const { hook_event_name: hookEventName } = JSON.parse(readFileSync(0, 'utf8'));
const additionalContext = readFileSync(new URL('./how-we-work.md', import.meta.url), 'utf8');
process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext } }));
