---
type: regex
target: { source: file, path: .scratch/saved-searches/execution-plan.md }
pattern: 'critical path[\s\S]{0,40}?01\s*(?:→|->)\s*02\s*(?:→|->)\s*0[35]'
flags: i
---

The fixture's blockers make the path 01 → 02 → 03 or 01 → 02 → 05.
