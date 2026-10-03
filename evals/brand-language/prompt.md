---
description: A tool for a client speaks the client's visual language, read from their site and translated for a tool, with the lead giving only the structure.
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Write, Edit, Glob, Grep, Skill, Agent]
---

Orbita Studios, a post-production house, wants a tool for its editors: the render queue, with each
job's project, stage, machine and time left. Their website is in site/. I picked refs/board.png only
for how a queue like this is laid out. Build the first screen of the tool: plain HTML and CSS, one
file, screen.html.
