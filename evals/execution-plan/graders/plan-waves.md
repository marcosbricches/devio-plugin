---
type: regex
target: { source: file, path: .scratch/saved-searches/execution-plan.md }
pattern: '\b(?:waves?|phases?|stages?)\b'
flags: i
---

Passes when the plan groups the tickets into waves, phases or stages, the parallel batches the hook
text asks for.
