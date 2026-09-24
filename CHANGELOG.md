# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-09-24

Installs receive one hook script that works on every platform and every session source, and an
execution plan that goes wherever the tracker keeps the tickets.

### Added

- `tests/hooks.test.mjs`, the hook contract test: it spawns each hook as `hooks/hooks.json` declares
  it and checks the output Claude Code accepts, the 10,000-character cap included. Claude Code
  ignores a malformed hook output without an error, so this is where both hooks are checked.
  `node --test tests/hooks.test.mjs`, Node and nothing else.
- `execution-plan-github`, an eval case: with GitHub as the tracker, the plan is addressed to the
  spec's issue and nothing is written under `.scratch/`.

### Changed

- `SessionStart` and `SubagentStart` run one script, `hooks/how-we-work.mjs`, with `node` in exec
  form: no shell, so the hook text arrives intact on Windows without Git Bash, and no matcher, so it
  arrives on every session source, `fork` included. The size cap moves from `evals/prepare.mjs` to
  the contract test.
- The execution plan goes where the tracker keeps the tickets: `execution-plan.md` in the feature's
  folder for local markdown, a comment on the spec's issue for GitHub or GitLab. It is written
  against the tickets as published, in the same turn, with any fixes to the tickets listed beside
  it rather than asked about first.
- The repository's engineering is rebuilt on mattpocock-skills: its configuration lives in
  `docs/agents/`, the issue tracker says where research notes and the execution plan live and that
  a resolved ticket and a finished feature's folder are deleted, and `CLAUDE.md` moves to
  `.claude/CLAUDE.md`, so `claude plugin validate --strict` passes on both manifests. Both
  manifest descriptions state the README's three points.
- The suite runs with the no-plugin baseline: each case also runs with no plugin at all, devio and
  its specialists alike, and reports `WITH`, `W/OUT` and `Δ`. A case passes at 1.0 with devio and a
  `Δ` above zero; `no-specialist`, the guard against over-routing, passes at `Δ` ≥ 0. The README's
  command and the release rule in `.claude/CLAUDE.md` say the same.
- `execution-plan` and `execution-plan-github` grade with `regex` instead of an `llm` judge. On
  plans of about 2,000 characters and replies of about 2,600 the judge failed correct answers, Haiku
  and Sonnet alike, and the docs keep `llm` graders for short outputs
  (code.claude.com/docs/en/plugin-evals, read 2026-09-24).

### Removed

- `hooks/subagent-start.mjs`: both hooks run `hooks/how-we-work.mjs`.
- `deploy-vps` and `references-opened`: Claude alone passed them 3 of 3, so they measured Claude,
  not devio.

### Measured

Claude Code 2.1.281, 3 runs per arm, 2026-09-24, on the hook text and hook script this release
ships. Every case passes. The two removed cases are from the run before them, on the same hook
script.

| Case | WITH | W/OUT | Δ |
| --- | --- | --- | --- |
| claude-code-question | 1.00 | 0.00 | +1.00 |
| critique-landing | 1.00 | 0.00 | +1.00 |
| deploy-vercel | 1.00 | 0.00 | +1.00 |
| execution-plan | 1.00 | 0.00 | +1.00 |
| execution-plan-github | 1.00 | 0.33 | +0.67 |
| library-docs | 1.00 | 0.00 | +1.00 |
| no-specialist | 1.00 | 1.00 | 0.00 |
| scroll-reveal | 1.00 | 0.00 | +1.00 |
| stop-after-grill | 1.00 | 0.50 | +0.50 |
| deploy-vps (removed) | 1.00 | 1.00 | 0.00 |
| references-opened (removed) | 1.00 | 1.00 | 0.00 |

Before the last sentence of the plan's chain, `execution-plan` scored 0.67 with devio: in one run
of three the session held the plan back and asked whether to fix the tickets first.

## [0.4.0] — 2026-09-24

The hook text and the dependencies are the ones 0.2.0 shipped. What changes is the number.

### Changed

- `version` moves past 0.3.0. A retired line of this plugin, the one with the `measure`, `gates` and
  `art-direction` skills, shipped 0.3.0 from this marketplace on 2026-09-20 before this repository
  restarted at 0.1.0. Claude Code orders plugin versions by semver and does not downgrade
  (code.claude.com/docs/en/plugins-reference#version-management, read 2026-09-24), so an install
  of that 0.3.0 never received 0.1.0 through 0.2.0. 0.4.0 reaches it. 0.3.0 is skipped because
  that number already names the retired line.
- The suite is not rerun: nothing it measures changed. Its last result stands, 30 of 30 on
  2026-09-23.

## [0.2.0] — 2026-09-23

What the first field trial, the Bioage intranet prototype, showed the hook text missing.

### Added

- The frame of the screen stays put: one app shell height on every route, content at the same x,
  titles and filters in the page body, `html { scrollbar-gutter: stable }`, and header height and
  left edge measured with Playwright on every route at phone and desktop widths before a multi-route
  build is shown, since neither Impeccable's detector nor its reviewer looks across routes. In
  Bioage the header height changed between routes and only the designer found it.
- A chain for the end of a grill: the session asks the designer to run `/to-spec`, `/to-tickets` and
  `/implement`, and writes neither a spec nor tickets itself. In Bioage it wrote the spec itself and
  went straight to the build.
- An `execution-plan.md` beside the tickets `/to-tickets` publishes: waves, the critical path, what
  to watch between parallel tickets, the command that starts each ticket, no durations.
- The `code-review` row says to `git add -N` new files first, since untracked files are not in the
  diff it reviews (code.claude.com/docs/en/code-review, read 2026-09-23). Two Bioage reviews ran on
  an empty diff.
- Vercel joins the `dependencies`.
- `evals/prepare.mjs` stops when the hook text is over the 10,000 characters Claude Code shows in
  full (code.claude.com/docs/en/hooks, read 2026-09-23). The text is 7,258 characters.
- Five eval cases: `references-opened` (the 0.1.1 rule, measured for the first time),
  `stop-after-grill`, `execution-plan`, `deploy-vercel` and `deploy-vps`. The suite now runs with
  `--scaffold` and grants `Write`.

### Changed

- Deploy: every deploy ships one Docker image, run with Docker Compose on the company's VPS and as a
  container-image Function on Vercel through the `vercel:` skills (ADR 0002). In Bioage the session
  pushed without inspecting the Vercel project and the deploy built nothing.
- The suite, 10 cases on 3 runs with the README's command, passed 30 of 30 on 2026-09-23.
- Not measured: the fixed frame. Its case would need a multi-route app, a running server and the
  Playwright MCP inside a run; the acceptance field trial checks it instead.

### Removed

- The five preferences the designer's global `CLAUDE.md` already carries (language, the screen as
  the deliverable, grounded taste, reversible versus product decisions, sources on constraints),
  and the critique chain that repeated the routing table (ADR 0001).

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
