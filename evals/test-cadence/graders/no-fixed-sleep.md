---
type: tool_used
tool: Bash
input_match: '(?<!\bdo\b(?:(?!\bdone\b).)*)\bsleep\s+\d'
min: 0
max: 0
---

No command waits a fixed time, such as `npm run dev & sleep 5`. A `sleep` inside a loop's
`do ... done` sits between checks of a condition (`until curl -s localhost:4173; do sleep 1; done`,
or a `for` loop that breaks when the server answers), so it waits on the condition and passes.
