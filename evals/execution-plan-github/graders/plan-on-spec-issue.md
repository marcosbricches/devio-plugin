---
type: regex
pattern: '\b(?:comment|post(?:ed|ing)?)\b[^\n]{0,80}#12\b|#12\b[^\n]{0,80}\b(?:comment|post)|gh issue comment 12\b'
flags: i
---

Passes when the reply addresses the plan to the spec's issue, #12, as a comment: it says it posted,
or asks to post, the plan on #12, or gives `gh issue comment 12`. The project's tracker is GitHub
Issues, so the plan goes where the tickets are. This was an `llm` grader until 2026-09-24; on
replies of ~2,600 characters the judge failed correct replies, Haiku and Sonnet alike, while the
same Sonnet called directly passed them, and the docs keep `llm` graders for short outputs
(code.claude.com/docs/en/plugin-evals, read 2026-09-24).
