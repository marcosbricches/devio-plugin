---
type: llm
---

The project's issue tracker is GitHub Issues, and the spec is issue #12.

PASS when the reply gives an execution plan for tickets #13 to #17 (the tickets grouped into waves,
phases or stages) and addresses it to issue #12 as a comment: it says it posted, or asks to post, the
plan as a comment on #12, or gives a command such as `gh issue comment 12`.

FAIL when the reply gives no execution plan, when it puts the plan in a file in the repository
(`.scratch/`, `docs/` or anywhere else) instead of on #12, or when it addresses the plan to an issue
other than #12.
