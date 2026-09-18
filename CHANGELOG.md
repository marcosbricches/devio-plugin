# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — 2026-09-18

First release. The method that produced viva-maracana's visual-language round stops living in that repository and becomes a plugin.

### Added

- **Knowledge skills**, loaded by the model without being asked for: `art-direction` (observe → research → compose → critique → deliver, the six-axis critique, research delegated to the `researcher` agent as source → mechanism → application → limit), `cumulative-prototype` (scoped to an effort's prototype folder; layers, real content, `DIRECTION.md` with revocations), `gates` (gates by change, `/code-review` low as reviewer with findings filtered to correctness, the manual pass, the effort close with harvest and thesis counters), `measure` (when to measure what, and how to read each JSON).
- **Measurement library** on one shared module driven by a per-project `measure.config.mjs`: `capture`, `contrast-on-photo`, `scroll-junctions`, `trace-cost`, `line-breaks`, `focus-path`. LCP and CLS are documented as Chrome DevTools MCP calls rather than reimplemented. A fixture page and a shape test cover every script.
- **Prototype scaffold** — a dependency-free static server, an idempotent content-hash asset versioner, and `DIRECTION.md` / `README.md` skeletons.
- **`client-report`** — a project's markdown becomes the two-page `.docx` on Devio's paper, with its Python dependencies declared.
- **Commands** — `/devio:setup` embeds the project-side files into a repository; `/devio:next` reads the state and names one next step.
- **`researcher`** sub-agent on Sonnet, for reading and fetching out of the main context.
- **`bash-cmdline-guard`** hook, moved out of `~/.claude/settings.json` so the guardrail travels with the plugin.
- ADRs 0001–0005 and the five research files the decisions rest on.

### Changed

- The global `~/.claude/CLAUDE.md` shrank to twenty-one lines of rules valid in every project; the bash-limit table left it for the hook.
- viva-maracana became the first project on the plugin: its method documents and the six measurement scripts the plugin covers were removed, the implementation couplings moved into its `AGENTS.md`, and its effort roadmap gained the two thesis counters.
- viva-maracana's project memory went from eighteen files to eight, one fact each.

[0.1.0]: https://github.com/marcosbricches/devio-plugin/releases/tag/v0.1.0
