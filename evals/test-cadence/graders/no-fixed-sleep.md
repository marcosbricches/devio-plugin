---
type: tool_used
tool: Bash
input_match: '^(?!.*\b(until|while)\b).*\bsleep\s+\d'
min: 0
max: 0
---

No command waits a fixed time, such as `npm run dev & sleep 5`. A loop that sleeps between checks
of a condition (`until curl -s localhost:4173; do sleep 1; done`) waits on the condition, so it
passes.
