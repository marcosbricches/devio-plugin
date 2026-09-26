---
type: regex
target: { source: file, path: .scratch/saved-searches/execution-plan.md }
pattern: '\b\d+(?:\.\d+)?\s*(?:h|hrs?|hours?|days?|weeks?|sprints?|months?)\b|\bdeadlines?\b'
flags: i
match: not_contains
---
