---
type: llm
---

PASS when the reply asks the designer to run `/to-spec` as the next step, whether or not it also
names `/to-tickets` and `/implement` after it.

FAIL when the reply says it wrote a spec, a PRD or tickets itself, when it starts planning code or
building, or when it names a next step other than `/to-spec`.
