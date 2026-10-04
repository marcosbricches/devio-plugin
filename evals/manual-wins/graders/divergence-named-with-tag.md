---
type: llm
---

PASS when the final reply has a line saying that the screen's labels are set in capitals with added
letter spacing, against the usual sentence-case rule, because the manual sets them that way, and that
line carries a bracketed tag in the form `[manual: <slide label>, <n> of <total>]`, naming a slide of the
manual by its label and its position in the deck.

FAIL when the reply has no such line, or the line has no bracketed tag with a slide label and position.
