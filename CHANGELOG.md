# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-09-23

### Added

- A `SessionStart` hook that adds `hooks/how-we-work.md` to every session: research before any
  task, follow the community's standard, the designer's preferences, and who does what: the
  specialist skill or MCP server for each kind of task, with example chains. The text is written as
  statements rather than commands, as the hooks reference recommends for `additionalContext`
  (code.claude.com/docs/en/hooks, read 2026-09-23).
- A `SubagentStart` hook that gives subagents the same text, since they do not receive what
  `SessionStart` printed (obra/superpowers#237; code.claude.com/docs/en/hooks).
- `dependencies` on Impeccable, the GSAP skills, mattpocock-skills, context7 and Playwright, so
  installing devio installs its specialists (code.claude.com/docs/en/plugin-dependencies). The
  marketplace allows those three marketplaces in `allowCrossMarketplaceDependenciesOn`.
- An eval suite in `evals/`, run with `claude plugin eval`: a critique goes to Impeccable, scroll
  motion to the GSAP skills, a library question to context7, a Claude Code question to the official
  docs, and a sum to no specialist. 15 of 15 runs passed on 2026-09-23. `evals/prepare.mjs` copies
  devio and its installed dependencies into `.eval-deps/`, because a run loads only plugins inside
  the repository.
- The mattpocock-skills configuration in `docs/agents/`: a local markdown issue tracker in
  `.scratch/`, the default triage labels, and single-context domain docs.
