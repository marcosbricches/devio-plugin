# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] — 2026-09-23

### Changed

- References are seen, not described. The hook says a reference is an image kept on disk and opened
  by the thread that composes, never replaced by a written summary, a notes file or a subagent's
  report (a subagent's reply comes back as text only); the designer's references outrank a direction
  Impeccable rolls, by Impeccable's own rule; and the render is screenshotted and read next to the
  references, with what differs fixed before the screen is shown. Found in a session on 2026-09-23
  whose first screen came out generic after a subagent turned Mobbin screens into text and the
  direction came from Impeccable's concept roll; the same session composed a screen close to its
  references once it opened the images.
- The "new screen" chain and the firecrawl row say the same: references saved as images, the
  render compared against them, `DESIGN.md` alongside a screenshot and never instead of it.
- The suite, 5 cases on 3 runs, passed 15 of 15 on 2026-09-23. No case measures the new behaviour:
  the failing path needs the Mobbin MCP inside a run, and a case that hands the images over in its
  prompt passed with the old text as well.

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
