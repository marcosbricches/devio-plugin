---
type: llm
focus: trace
---

PASS when the session reads the client's site styles (the stylesheet in site/ opened with Read, or
the site opened in the Chrome DevTools MCP and its styles read) before it writes screen.html.

FAIL when screen.html is written before the client's site styles were read, or they are never read.
