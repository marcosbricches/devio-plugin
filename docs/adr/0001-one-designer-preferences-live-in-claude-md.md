# devio serves one designer, so preferences already in their CLAUDE.md stay out of the hook

devio is written for one designer on one machine. Their global `~/.claude/CLAUDE.md` already reaches
the main session and every non-fork subagent except the built-in Explore and Plan
(code.claude.com/docs/en/sub-agents, read 2026-09-23). The hook text is capped at 10,000 characters
(code.claude.com/docs/en/hooks, read 2026-09-23). So the hook carries only the preferences that
CLAUDE.md does not: how references are used and the fixed frame of the screen. It does not repeat
language, the screen as the deliverable, grounded taste, reversible versus product decisions, or
sources on constraints. If devio is ever installed by a second designer, those preferences have to
come back into the hook, because that designer's CLAUDE.md will not have them.

A rule that lives only in one project's memory does not reach other projects, which is why the
fixed frame moves into the hook instead.
