# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.1] — 2026-09-30

### Changed

- `devio:screen` composes the first screen itself, in code, from one lead reference: the one the
  designer named, or the real product closest to the job, followed the way "make it like Apple"
  follows apple.com. Each other reference supplies one named part. The screen is shown to the
  designer as the direction, naming the lead and what each reference gave. Impeccable only polishes,
  with scoped commands (`polish`, `critique`, `audit`) on the built code. Why: in the Maré field
  trial of 2026-09-27, Impeccable's new-work flow set six open references aside for a direction
  rolled from its own catalog, and the designer stopped the session as AI slop (ADR 0003).
- `devio:screen` gains a gotcha for Impeccable's `Stop` hook, which reviews the written file when the
  turn ends and turned the last reply into a lint report. The first measurement scored
  `screen-direction` 0.92: the direction reply named the lead, and the reply after the hook dropped it.
- `evals/run.mjs` treats "session limit" as a limit, so it is no longer cached as a real control
  score of 0 (seen 2026-09-27).
- `evals/run.mjs` points its copy of context7 at the anonymous `/mcp` endpoint. context7
  `ab024cdcfa7c` moved to `/mcp?client=claude-code-plugin`, which answers 401 and asks for OAuth. A
  run's fresh home cannot sign in, so `library-docs` and `deploy-vercel` failed in both arms (probed
  2026-09-30).

### Added

- Case `screen-direction`: the first screen of a new product follows a named lead, and Impeccable is
  not called. Each grader passed a real trace that did the thing and failed one that did not.

### Measured

Claude Code 2.1.286, 3 runs per arm, sonnet judge, 2026-09-30.

| Case | devio | control |
| --- | --- | --- |
| claude-code-question | 1.00 | 0.50 |
| client-formal | 1.00 | 0.42 |
| critique-landing | 1.00 | 0.50 |
| deploy-vercel | 1.00 | 0.25 |
| execution-plan | 1.00 | 0.00 |
| execution-plan-github | 1.00 | 0.44 |
| lesson-recorded | 1.00 | 0.00 |
| library-docs | 1.00 | 0.50 |
| new-screen | 1.00 | 0.00 |
| no-specialist (guard) | 1.00 | 1.00 |
| recommendation | 1.00 | 0.33 |
| screen-direction | 1.00 | 0.25 |
| scroll-reveal | 1.00 | 0.67 |
| stop-after-grill | 1.00 | 0.50 |

`execution-plan-github` scored 0.89 in the full run: one run of three wrote a `.scratch/` folder
instead of commenting on the spec's issue. Alone it scored 0.89, then 3 of 3. Neither the hook text
nor `execution-plan` changed in this release, so this is noise it already carried. It needs its own
look.

## [0.7.0] — 2026-09-27

### Added

- The hook text gains "How Devio works": a recommendation carries its evidence, what happens if it
  is taken and if it is not, and ends on one next step that is a single action; a mistake becomes a
  lesson in the repository in the same turn, not in personal memory; text for a client is formal,
  down to the sign-off.
- Cases `recommendation`, `lesson-recorded` and `client-formal`, one for each rule.

### Changed

- `evals/run.mjs` judges `llm` graders with sonnet. The default small judge scored all three new
  cases 1.00; sonnet, on the same replies, failed replies that broke the rubric
  (code.claude.com/docs/en/plugin-evals: "Re-run with `--judge-model sonnet`", read 2026-09-27).
- The control cache key includes `--judge-model`, so a new judge no longer reuses control scores
  from the old one.
- Each `llm` grader checks one criterion. A three-criterion rubric failed a correct reply in 9 of 9
  votes; split, the graders judged six fixed replies, good and bad, unanimously right three times
  each. Casual markers in `client-formal` are a regex, with Unicode lookarounds because `\b` treats
  accented letters as non-word.

### Measured

Claude Code 2.1.282, 3 runs per arm, sonnet judge, 2026-09-27, on this release's hook text and
skills. Control was re-measured with the sonnet judge.

| Case | devio | control |
| --- | --- | --- |
| claude-code-question | 1.00 | 0.50 |
| client-formal | 1.00 | 0.33 |
| critique-landing | 1.00 | 0.50 |
| deploy-vercel | 1.00 | 0.25 |
| execution-plan | 1.00 | 0.00 |
| execution-plan-github | 1.00 | 0.33 |
| lesson-recorded | 1.00 | 0.00 |
| library-docs | 1.00 | 0.50 |
| new-screen | 1.00 | 0.00 |
| no-specialist (guard) | 1.00 | 1.00 |
| recommendation | 1.00 | 0.33 |
| scroll-reveal | 1.00 | 0.67 |
| stop-after-grill | 1.00 | 0.50 |

A full run before this one scored `claude-code-question` 0.83: one run of three answered without
`additionalContext`, after consulting the docs. The case alone then scored 3 of 3.

## [0.6.1] — 2026-09-26

- `devio:deploy` states its reason itself instead of linking a file outside the plugin.
- The repository holds only the plugin, its tests and its evals; the maintainer's process files stay
  local.
- Measured: `deploy-vercel` 1.00 against a control of 0.25. A first run scored 0.92: one run of three
  wrote the Docker files and stopped before any `vercel:` skill.

## [0.6.0] — 2026-09-26

Rebuilt on Anthropic's context-engineering guidance (claude.dev/blog: "The new rules of context
engineering", "How we use skills", read 2026-09-26): progressive disclosure, nothing repeated that
another layer already says. The eval suite is rebuilt to measure devio itself.

### Changed

- The hook text drops from 7,538 to 2,700 characters: research first, the routing table, the stop
  after a grill. The table still names each specialist, because past 1% of the context window the
  skill listing drops the descriptions of the least-used skills (code.claude.com/docs/en/skills).
- `SubagentStart` skips `Explore` and `claude-code-guide`, which only look things up.
- The suite compares devio with its specialists alone (control), not with Claude alone. Against no
  plugin at all, "context7 was called" can never pass, so every Δ before this release was
  guaranteed. `evals/run.mjs` runs both arms from `plugin.json`'s `dependencies`, caches control,
  and exits 0 only when every case scores 1.0 and beats control.
- Graders fixed: `execution-plan-github` failed correct plans written as a table; each case gains a
  grader on the result beside the one on the route; `no-specialist` guards a language question
  instead of a sum.
- References may also be rebuilt as an HTML mockup, opened next to their image.
- Releases are tagged `devio--v<version>` by `claude plugin tag`, the documented convention
  (code.claude.com/docs/en/plugins/publish); earlier releases keep their `v<version>` tags.
- The README documents the Node requirement, updating, the optional specialists, the skills and the
  release steps.

### Added

- `devio:screen`, `devio:execution-plan` and `devio:deploy`, moved out of the hook text.
- `new-screen`: a screen starts from references.

### Removed

- `$schema`, which pointed to a web page, and the marketplace entry's copies of `plugin.json` fields.
- `evals/prepare.mjs`, folded into `evals/run.mjs`.

### Measured

Claude Code 2.1.282, 3 runs per arm, 2026-09-26, on this release's hook text and skills.

| Case | devio | control |
| --- | --- | --- |
| claude-code-question | 1.00 | 0.50 |
| critique-landing | 1.00 | 0.50 |
| deploy-vercel | 1.00 | 0.25 |
| execution-plan | 1.00 | 0.00 |
| execution-plan-github | 1.00 | 0.33 |
| library-docs | 1.00 | 0.50 |
| new-screen | 1.00 | 0.00 |
| no-specialist (guard) | 1.00 | 1.00 |
| scroll-reveal | 1.00 | 0.83 |
| stop-after-grill | 1.00 | 0.50 |

A shorter wording of "a job done from memory while its specialist is installed counts as not done"
dropped `library-docs` to 0.83; the sentence is back.

## [0.5.0] — 2026-09-24

- One hook script for both events, run by `node` in exec form, so the text arrives intact on
  Windows without Git Bash; `tests/hooks.test.mjs` checks its output.
- The execution plan goes where the tracker keeps the tickets.

## [0.4.0] — 2026-09-24

- `version` passes 0.3.0, which a retired line of this plugin had shipped from this marketplace;
  Claude Code does not downgrade (code.claude.com/docs/en/plugins-reference#version-management).

## [0.2.0] — 2026-09-23

From the first field trial:

- The app-shell frame stays put across routes, measured with Playwright.
- After a grill the session asks for `/to-spec`, `/to-tickets`, `/implement`.
- An execution plan beside published tickets.
- `git add -N` before `code-review`, whose diff leaves untracked files out.
- Every deploy ships one Docker image; Vercel joins the `dependencies`.
- Preferences the designer's `CLAUDE.md` already carries leave the hook.

## [0.1.1] — 2026-09-23

- References are opened as images, never replaced by a description of them.

## [0.1.0] — 2026-09-23

- `SessionStart` and `SubagentStart` hooks that add the routing text, `dependencies` on the
  specialists, and an eval suite.
