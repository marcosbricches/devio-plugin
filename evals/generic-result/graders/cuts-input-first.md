---
type: llm
---

PASS when the final reply's first move is to cut input from the request, one change at a time: it
takes out the prohibitions, hard rules, domain nouns and look words of the 66-line request first, keeps
the six images, and sends that shorter request before changing anything else.

FAIL when the reply's first move is anything other than cutting: rewriting the request with a new
concept or more rules, changing several things at once, or replacing the images before the request is
cut.
