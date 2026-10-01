---
type: tool_used
tool: Bash
input_match: 'probe\.mjs|docker (--version|info)|wsl(\.exe)? .*(-l|--status)|command -v'
min: 1
---

A command read the machine's real state: the skill's probe, Docker's version or daemon, WSL's
listing, or `command -v`. Instructions given with no such command are a guess.
