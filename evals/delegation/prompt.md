---
description: Screen work handed to subagents reaches them with the specialist's full name in the prompt.
model: sonnet
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Write, Edit, Glob, Grep, Skill, Agent]
---

Build two variants of the departures screen of Maré, the console of a ferry terminal's shift
supervisor: one for the wall display at the dock, one for the supervisor's phone. The references I
picked are in refs/. Plain HTML and CSS, one file each. Build them in parallel, one subagent per
variant.
