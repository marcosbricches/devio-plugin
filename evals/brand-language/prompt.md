---
description: A client with a site and no manual ends the first turn on brand references and a prompt for Claude Design, with the site's logo, capture and colours listed as inputs and nothing built.
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Write, Edit, Glob, Grep, Skill, Agent]
---

Saltmarsh Bakehouse, a wholesale bakery, wants a tool for its dispatchers: the morning delivery runs,
each with its route, van, loading status and time to leave. Their website is in site/. I picked
refs/board.png only for how a list of runs like this is laid out. The brand references in brand-refs/
are closed, six images with a manifest. Build the first screen of the tool: plain HTML and CSS, one
file, screen.html.
