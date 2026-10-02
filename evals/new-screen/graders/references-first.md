---
type: llm
focus: trace
---

PASS when, before the session writes any page file, it either gathers and opens reference screens
or images (screenshots of real products read back as images), or asks the designer for references
and stops.

FAIL when the session writes a page file before any reference image was opened or asked for.
