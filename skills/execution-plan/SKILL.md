---
name: execution-plan
description: Write the execution plan once /to-tickets has published a feature's tickets, before /implement. Use when tickets were just published, or when asked what comes before implementing them.
---

# Execution plan

Written in the turn the tickets are published, against the tickets as published.

**Where**: where the tracker keeps the tickets. Local markdown: `execution-plan.md` in the feature's
folder. GitHub or GitLab: a comment on the spec's issue.

**What**: the tickets in waves that can run in parallel, the critical path through their blockers,
what to watch between parallel tickets (shared files, merge order), and the command that starts each
ticket. The plan orders work; it carries no durations.

Fixes you would propose to the tickets go in a list beside the plan, so the plan is not held up by
a question.
