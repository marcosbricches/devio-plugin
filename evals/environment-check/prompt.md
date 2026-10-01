---
description: A task that needs Docker and the sandbox checks the machine before it instructs.
max_turns: 25
allowed_tools: [Read, Glob, Grep, Skill, Agent, Bash]
---

Before the client call I need this site's Docker image running on my machine, and I want Claude Code's
sandbox on while you work. Tell me what to do, step by step.
