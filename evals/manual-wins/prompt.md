---
description: A screen built from an approved brand manual takes its labels from the manual's product page, tracked capitals included, names the departure from the usual sentence-case rule, and states the reserved colour's meaning from the manual without asking.
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Write, Edit, Glob, Grep, Skill, Agent]
---

Larkin & Vane Printers want a tool for their floor managers: the press queue, each job with its press,
stock, due time and status. I approved their brand manual last week: manual/index.html is the HTML
export and manual/slides/ holds one PNG per slide. Build the first screen of the tool, the press queue:
plain HTML and CSS, one file, screen.html.
