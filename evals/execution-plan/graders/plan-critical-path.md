---
type: regex
target: { source: file, path: .scratch/saved-searches/execution-plan.md }
pattern: 'critical path[\s\S]{0,40}?01\s*(?:→|->)\s*02\s*(?:→|->)\s*0[35]'
flags: i
---

Passes when the plan names the critical path through the fixture's tickets: 01 blocks 02, which
blocks 03 and 05, so the path runs 01 → 02 → 03 or 01 → 02 → 05. A path in the wrong order does not
match. This was an `llm` grader until 2026-09-24; on the ~2,000-character plan the judge failed
correct plans, Haiku and Sonnet alike, and the docs keep `llm` graders for short outputs and grade
long files with `regex` (code.claude.com/docs/en/plugin-evals, read 2026-09-24).
