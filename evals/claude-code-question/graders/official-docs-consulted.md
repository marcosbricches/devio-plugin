---
type: regex
target: trace
pattern: '\\?"(?:subagent_type\\?":\s*\\?"claude-code-guide|url\\?":\s*\\?"https?://code\.claude\.com/docs)'
---

Passes when a tool call asked the claude-code-guide agent or fetched a page of the official docs.
The hook text itself names the docs index, so the pattern matches tool inputs only. The agent does
not exist inside an eval run, so fetching the docs is the path the run can take.
