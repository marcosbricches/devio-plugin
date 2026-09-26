# devio serves one designer, so preferences already in their CLAUDE.md stay out of it

devio is written for one designer on one machine. Their global `~/.claude/CLAUDE.md` already reaches
the main session and every non-fork subagent except the built-in Explore and Plan
(code.claude.com/docs/en/sub-agents, read 2026-09-26). So devio carries only the preferences that
CLAUDE.md does not: how references are used and the fixed frame of the screen, both in the `screen`
skill. It does not repeat language, the screen as the deliverable, grounded taste, reversible versus
product decisions, or sources on constraints. If a second designer installs devio, those preferences
come into devio, because that designer's CLAUDE.md will not have them.
