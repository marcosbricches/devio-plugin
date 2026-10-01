---
type: tool_used
tool: Bash
input_match: 'npm (run|run-script)( -\S+)* verificar\b'
min: 1
max: 1
---

The project has no CI and the change goes to the client, so the gate runs exactly once, before
delivery. Twice is the gate repeated with nothing changed; never is a delivery with no gate.
