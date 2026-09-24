---
type: regex
target: { source: file, path: .scratch/saved-searches/execution-plan.md }
pattern: '\b\d+(?:\.\d+)?\s*(?:h|hrs?|hours?|days?|weeks?|sprints?|months?)\b|\bdeadlines?\b'
flags: i
match: not_contains
---

Passes when the plan puts no amount of time on the work: the hook text asks for a plan with no
durations. Words about order, such as "before", "after" or "slip", are not amounts of time. A
missing plan fails here too, since there is no file to read.
