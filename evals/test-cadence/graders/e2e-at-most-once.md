---
type: tool_used
tool: Bash
input_match: 'run (verificar|test:e2e)|node --test|playwright test'
min: 0
max: 1
---

The gate runs the e2e suite, so `npm run test:e2e` before `npm run verificar` runs it twice. A CSS
change touches no flow with logic: the e2e suite runs at most once, inside the gate.
