# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] — 2026-10-01

Less session time on checks, same design.

### Added

- The hook text sets the check cadence: nothing heavy while editing, the typecheck and the affected
  test once when closing a change, one `playwright screenshot` per width, the gate once, no check
  repeated with nothing changed, a dev server waited on by a condition, e2e only for flows with logic.
- A `Stop` hook (`hooks/background-tasks.mjs`) stops a turn from ending while a shell task of the
  session still runs. A command that passed its timeout had run orphaned for 2 hours.
- `devio:environment` reads the machine (WSL, Docker, sandbox, Node, plugins) before a task that needs
  them, so no install is instructed blind.
- Cases `test-cadence`, `environment-check`, `queue-conflict` and `deploy-cd`.

### Changed

- `devio:deploy` targets Devio's CD and writes a GitHub Actions workflow that runs the project's gate
  on each push and pull request. Vercel leaves.
- `devio:screen` iterates until the render matches the references and asks when a difference survives
  two fixes or needs a decision.
- The review row calls the built-in `code-review` for bugs and the built-in `simplify`
  (`args: "report only"`) for what to delete.
- Every eval runs from the WSL clone; `run.mjs` grants Bash only when a picked case lists it and
  never caches a control run that ended in an error.

### Removed

- Ponytail, as a dependency and from the hook text. The rule of three stays, worded without it.

### Measured

Claude Code 2.1.286, 3 runs per arm, sonnet judge, under WSL2, 2026-10-01. Each case was measured by
the change that touched it; the whole suite was not rerun for this release, on the designer's call,
to save the weekly usage limit after a full run died on it.

| Case | devio | control |
| --- | --- | --- |
| deploy-cd | 1.00 | 0.00 |
| designed-control (guard) | 1.00 | 1.00 |
| environment-check | 1.00 | 0.33 |
| new-screen | 1.00 | 0.00 |
| queue-conflict | 1.00 | 0.50 |
| review-change | 1.00 | 0.50 |
| rule-of-three | 1.00 | 0.00 |
| screen-direction | 1.00 | 0.25 |
| test-cadence | 1.00 | 0.42 |

The cases no change in this release touched keep their 0.8.0 scores, and were not re-measured
against the new hook text.

### Not measured

What 0.9.0 is for shows only in real work, so the next field trial records it at its end:

- The share of session span spent on checks. Before: 18% to 26%, 182 sessions read 2026-10-01.
- jscpd duplication, exact clones of 50 tokens or more. Before: 1.64% and 2.13% (2026-09-30). With
  Ponytail gone, the rule of three alone guards it.

## [0.8.0] — 2026-10-01

### Added

- Ponytail (github.com/DietrichGebert/ponytail, v4.10.0) is a dependency, and the README's install
  section adds its marketplace. It runs at its default level in every session and subagent. Why: a
  developer at Devio recommended it after asking whether the designer documents the project
  structure. It made his sessions stop writing repeated code. jscpd on the designer's last two
  projects (2026-09-30, exact clones of 50 tokens or more) found 1.64% and 2.13% duplicated lines.
  Some of it was a shared piece re-implemented anyway, such as a localStorage store copied 8 times,
  even where DESIGN.md documented the piece. The rest was a shared piece never extracted, such as
  three contact forms copied from each other. Documentation alone did not stop the cloning. A
  session that searches before it writes is what Ponytail brings.
- The "Review of a change" row calls `ponytail:ponytail-review` for what to delete, next to the
  built-in `code-review` for bugs.
- The hook text says that Ponytail governs the code, not the rest of the work. A screen matches its
  references, a recommendation carries its evidence, and an installed specialist is called,
  whatever the code rules say. Why: with Ponytail in both arms, `new-screen` built a page with no
  reference (0.00, against 1.00 in 0.7.1). Ponytail's "never stall on an answer you can default"
  beat the screen skill. `deploy-vercel` also stopped short of the `vercel:` skills in 1 of 3 runs.
- The hook text states the rule of three. Before writing markup or logic, look for copies already
  in the code. With two there, extract a shared piece and move the first two onto it. At the third
  copy this overrides Ponytail's "no unrequested abstractions". The first wording ("the third copy
  is not written") fired in 0 of 3 runs, because the session never saw itself as writing a third
  copy. Leading with the check scored 3 of 3.
- Cases `review-change`, `rule-of-three`, and the guard `designed-control`. In `designed-control`,
  the reference shows a designed calendar, and the screen must not fall back to `<input type="date">`.

### Changed

- `devio:screen` ends the turn on asking for references when it has none, with nothing built.
- `devio:deploy` calls the `vercel:` skills even when the Vercel MCP is signed out or no shell is at
  hand. `vercel:vercel-cli` hands the sign-in to the designer.
- `evals/run.mjs` grants `Edit`, which `screen-direction` lists and was denied. The allowed tools are
  part of the control cache key. The key's `--runs` regex had a literal backspace where `\b`
  belonged, so every control score was re-measured.

### Not measured

Whether Ponytail makes the designer's code shorter and less duplicated is left to the next field
trial. Ponytail runs in both arms, so the suite cannot see its effect on code. The trial report
records jscpd duplication and LOC at its end.

### Measured

Claude Code 2.1.286, 3 runs per arm, sonnet judge, Ponytail in both arms, 2026-10-01.

| Case | devio | control |
| --- | --- | --- |
| claude-code-question | 1.00 | 0.50 |
| client-formal | 1.00 | 0.42 |
| critique-landing | 1.00 | 0.50 |
| deploy-vercel | 1.00 | 0.25 |
| designed-control (guard) | 1.00 | 1.00 |
| execution-plan | 1.00 | 0.00 |
| execution-plan-github | 1.00 | 0.33 |
| lesson-recorded | 1.00 | 0.00 |
| library-docs | 1.00 | 0.50 |
| new-screen | 1.00 | 0.00 |
| no-specialist (guard) | 1.00 | 1.00 |
| recommendation | 1.00 | 0.33 |
| review-change | 1.00 | 0.00 |
| rule-of-three | 1.00 | 0.00 |
| screen-direction | 1.00 | 0.33 |
| scroll-reveal | 1.00 | 0.00 |
| stop-after-grill | 1.00 | 0.33 |

`designed-control` scores 1.00 in control too, so Ponytail did not swap the reference's calendar for
a native input in either arm. The guard stays to catch a hook text change that would.

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
