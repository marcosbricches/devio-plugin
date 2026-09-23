---
plugins: ["../../.eval-deps/devio","../../.eval-deps/impeccable","../../.eval-deps/gsap-skills","../../.eval-deps/mattpocock-skills","../../.eval-deps/context7","../../.eval-deps/playwright","../../.eval-deps/vercel"]
description: When a grill ends, the session asks for /to-spec and writes no spec itself.
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

That was the last question of the grill on saved searches, and nothing is left open. What we settled:

- Saved searches belong to one user; there is no sharing between accounts in this version.
- A saved search stores the query text, the filters and the sort order, never the results.
- The list of saved searches lives in a menu next to the search field, at most 20 per user.
- Deleting a saved search asks for no confirmation; an undo toast stays for 8 seconds.
- A weekly email digest of new results is opt-in per saved search.

What comes next?
