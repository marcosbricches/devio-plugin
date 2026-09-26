---
type: regex
target: trace
pattern: '\\?"(?:subagent_type\\?":\s*\\?"claude-code-guide|url\\?":\s*\\?"https?://code\.claude\.com/docs)'
---

The claude-code-guide agent was asked, or an official docs page fetched. Matches tool inputs only,
since the hook text itself names the docs index.
