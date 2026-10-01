# How work is done here (devio plugin)

**Research comes first.** Before building, writing or deciding, find how it is already done: the
official docs, a maintained library, an installed skill, plugin or MCP server, a product that does
it well. Use what exists, follow the community's conventions and vocabulary, and build new only when
nothing does the job, saying what was looked at.

**Installed specialists do their jobs.** A job done from memory while its specialist is installed
counts as not done: models skip a specialist exactly when they believe they know the answer
(anthropics/claude-code#30387), so it is called even then. Skills go through the Skill tool by
full name; deferred MCP tools load through ToolSearch. The answer names the specialists called.
These are the usual ones; a better-fitting installed specialist wins.

| Task | Specialist |
| --- | --- |
| Building or redesigning a screen, page or app | `devio:screen` |
| Critique or polish of an interface, a component, type, colour, UX copy | `impeccable:impeccable` |
| Motion: animation, scroll effects, pinning | `gsap-skills:gsap-core`, then the case's `gsap-skills:` skill; a project's own animation library stays |
| A library, framework, SDK or API | context7: `resolve-library-id`, then `query-docs`, even for a well-known one |
| Claude Code: hooks, plugins, skills, subagents, settings, MCP, CLI | the `claude-code-guide` agent, or https://code.claude.com/docs/llms.txt |
| References from real products, or the web | the Mobbin MCP; `firecrawl-search`, `firecrawl-scrape` |
| The rendered screen | the Playwright or Chrome DevTools MCP |
| Figma | the `figma:` skills, from `figma:figma-use` |
| Registry components | the shadcn MCP |
| Charts and data display | `dataviz` |
| A poster or static visual | `anthropic-skills:canvas-design` |
| Research against primary sources | `mattpocock-skills:research` |
| TDD, a bug, domain docs, a throwaway prototype, grilling a plan | `mattpocock-skills:tdd`, `:diagnosing-bugs`, `:domain-modeling`, `:prototype`, `:grilling` |
| Review of a change | both: the built-in `code-review`, `args: "low"`, for bugs; `ponytail:ponytail-review` for what to delete. `git add -N` new files first: untracked files are outside their diff |
| Deploy, to the VPS or Vercel | `devio:deploy`, before any `vercel:` skill |

**How Devio works.** Devio exists to give people their time back by removing inefficiency, so a
task is measured by the problem it solves for the client's user, not by what it produces.

- A recommendation carries its evidence, what happens if it is taken and if it is not, and ends on
  one next step: one verb, one action. A second action, even a check of the first, waits.
- A mistake becomes a lesson in the repository in the same turn, where the next person will find it:
  the project's CLAUDE.md, an ADR, the docs. Personal memory does not reach the team.
- Text for a client is formal, down to the sign-off.
- Ponytail governs the code, not the rest of the work: a screen matches its references, a
  recommendation carries its evidence, and an installed specialist is called, whatever the code
  rules say.
- Before writing markup or logic, look for copies of it already in the code. With two there, the
  third is not written: extract a shared piece and move the first two onto it in the same change.
  At the third copy this overrides Ponytail's "no unrequested abstractions".

**Checks run once, sized to the change.** In any project:

- While editing, nothing heavy: no build, no e2e, no whole-project typecheck.
- Closing a change: the typecheck once and the affected test once, by file or title; while fixing,
  only the failures (`--last-failed`).
- The screen: one `npx playwright screenshot --wait-for-selector` per width at the end, compared
  with the references. No screenshot script written on the spot.
- The **gate** (the project's full check) once, before delivery, or in CI where the project has it.
- A check is never repeated with nothing changed since it last ran.
- A dev server starts once, in the background (`run_in_background`), and is waited on by a
  condition such as Monitor until it answers, never a fixed `sleep`.
- E2e covers flows with logic: forms, navigation, data. Whether a screen looks right is the
  screenshot's job.

**After a grill**, the next steps are the designer's: ask them to run `/to-spec`, `/to-tickets`, then
`/implement` (user-invoked, out of the Skill tool's reach), and write neither spec nor tickets. Once
the tickets are published, `devio:execution-plan` writes the plan in that turn.

**Work on a Claude Code plugin, hook or skill**: `claude-code-guide` or the docs first, then the
change, then a real session that shows it working.
