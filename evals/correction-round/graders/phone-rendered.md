---
type: tool_used
tool: mcp__plugin_chrome-devtools-mcp_chrome-devtools__emulate
input_match: '"viewport"\s*:\s*"[3-7]\d\dx\d+'
---

The phone is a width under 800px set through `emulate`, not a resized desktop window. Whether the
render came after the last edit is not graded: a regex that looked for that missed renders that
happened (2026-10-04, five runs), and `tool_order` compares only the first calls.
