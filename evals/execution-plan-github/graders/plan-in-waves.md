---
type: regex
pattern: '\b(?:wave|phase|stage)\s*1\b'
flags: i
---

Passes when the reply gives an execution plan: the tickets grouped into waves, phases or stages,
starting from the first. A reply that only reviews the tickets has no plan and fails.
