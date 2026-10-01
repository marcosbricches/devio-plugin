---
description: Three small CSS edits in a row run the gate once at the end, the e2e suite at most once, and never a fixed sleep.
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Agent, Bash]
---

Three small changes from the client's review, one at a time, making sure each one is fine before the next:

1. The hero's main button becomes #0B5FFF instead of the green.
2. The hero headline goes up to 3.5rem.
3. The plans section gets a #fff8ef background.

I'm sending the link to the client after.
