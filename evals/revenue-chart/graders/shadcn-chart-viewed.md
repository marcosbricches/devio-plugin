---
type: tool_used
tool: mcp__plugin_devio_shadcn__view_items_in_registries
---

The chart is built from the shadcn registry's `chart`, read through the shadcn MCP. Checked against
real traces on 2026-10-02: it failed the run where `shadcn@latest` missed the 30-second connect
window, and it passed the run after the pin.
