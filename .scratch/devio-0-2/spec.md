# devio 0.2.0: what the Bioage field trial taught

Status: ready-for-agent

## Problem Statement

The first field trial of devio 0.1.1, the Bioage intranet prototype on 2026-09-23, gave the designer a
quality result for the first time. Its trial report, at `C:\Users\marco\Dev\bio-age\handoff\2026-09-23-devio-plugin-trial\`,
also shows where the hook text did not hold:

- The app shell header changed height from route to route, and content shifted sideways between
  pages with and without a scrollbar. The designer found it. The session, Impeccable's detector and
  Impeccable's finish reviewer did not. The designer's rule against it lived only in that project's
  memory, so no other project will ever see it.
- After the grill, the session wrote the spec itself and went straight to the build. `/to-spec`,
  `/to-tickets` and `/implement` never ran, although the hook routes specs and tickets to them.
- The built-in `code-review` cost two wasted runs because every file of the new project was
  untracked, and so invisible to it.
- The deploy did not use the `vercel:` skills. The session pushed without inspecting the Vercel
  project, and the result was a deploy that built nothing.
- No eval measures the rule that 0.1.1 added (references are opened as images), and none measures
  any of the behaviours above.

The hook text is also closer to a hard limit than it looks. Claude Code caps hook context at
10,000 characters; anything over is saved to a file, and the model sees only a 2,000-character
preview (code.claude.com/docs/en/hooks, read 2026-09-23). The text is at 6,232 characters today, and
five of its designer preferences repeat the designer's global CLAUDE.md almost word for word.

## Solution

A 0.2.0 release that changes the hook text only where the trial showed a failure, keeps the text at
roughly its current size, and adds evals for the new rules and the 0.1.1 rule:

- The fixed frame of the screen becomes a designer preference in the hook, with the check that
  would have caught the Bioage defect.
- The chains say that after a grill the session stops and the designer runs `/to-spec`,
  `/to-tickets` and `/implement`.
- The `code-review` row says that untracked files must be added with intent-to-add first.
- The preferences that the designer's CLAUDE.md already carries leave the hook, and so does one
  chain that repeats the table (ADR 0001).
- Three new eval cases: references are opened, the session stops after a grill, and a deploy goes
  to the `vercel:` skills. The vercel plugin becomes a dependency so that the eval measures what an
  install brings.
- A new field trial on a project started from zero accepts the release.

## User Stories

1. As the designer, I want every screen of a build to keep the same app shell height, so that moving between routes feels calm and nothing jumps.
2. As the designer, I want content to start at the same x on every route, so that pages with and without a scrollbar line up.
3. As the designer, I want titles, search, filters and metrics placed in the page body rather than in the app shell header, so that the header never grows with a page's content.
4. As the designer, I want the session to measure header height and the content's left edge on every route, at phone and desktop widths, before it shows me a multi-route build, so that I am not the one who finds the shift.
5. As the designer, I want the hook to say plainly that Impeccable's detector and reviewer do not compare routes, so that the session doesn't treat their pass as proof of consistency.
6. As the designer, I want the fixed-frame rule to apply in every project, not only in the one where I first asked for it, so that I stop repeating the correction.
7. As the designer, I want the session to stop when a grill ends and ask me to run `/to-spec`, so that the spec is the community's format and I decide when it happens.
8. As the designer, I want the session never to write a spec or tickets on its own, so that `/to-tickets` and `/implement` (and the TDD that `/implement` brings) actually run.
9. As the designer, I want the stop-after-grill rule to hold whichever grill ran (`grill-with-docs`, `grill-me`, or `grilling` called directly), so that the flow doesn't depend on which entry point I typed.
10. As the designer, I want the `code-review` row to warn about untracked files in a new project, so that the first review of a field trial is not wasted.
11. As the designer, I want a deploy to go through the `vercel:` skills, so that the Vercel project's settings are inspected before a push.
12. As the designer, I want installing devio to install the vercel plugin, so that the deploy row of the table names a specialist the install actually brings.
13. As the designer, I want the hook to stay about the size it is now, so that it doesn't break the way heavily specified versions of devio did.
14. As the designer, I want the preferences already in my CLAUDE.md removed from the hook, so that the same sentence doesn't reach the model twice.
15. As the designer, I want the removed preferences, and the fact that they would have to come back for a second designer, recorded, so that a future reader doesn't put them back by mistake.
16. As the maintainer, I want the eval preparation to fail when the hook text is over 10,000 characters, so that the text is never silently cut to a preview.
17. As the maintainer, I want an eval that fails when a session composes from references without opening the images, so that the 0.1.1 rule is measured at last.
18. As the maintainer, I want an eval that fails when a session writes a spec after a grill instead of asking for `/to-spec`, so that the new chain line is proven.
19. As the maintainer, I want an eval that fails when a deploy request doesn't reach a `vercel:` skill, so that the deploy row is proven.
20. As the maintainer, I want every new and existing case to pass on 3 runs before release, so that no change to the hook text ships unmeasured.
21. As the maintainer, I want a hook on `UserPromptExpansion` for the grill commands only if the stop-after-grill eval fails with the chain line alone, so that a new hook enters only on evidence.
22. As the maintainer, I want the CHANGELOG to say which rule is not measured (the fixed frame), so that the release doesn't claim more than the suite shows.
23. As the maintainer, I want `claude plugin validate` to pass on both manifests after the dependency change, with only the expected CLAUDE.md warning.
24. As the maintainer, I want the release to bump the version to 0.2.0, update the CHANGELOG and README, and be tagged `v0.2.0`, as the repository's CLAUDE.md requires.
25. As the designer, I want the `fixed-layouts` memory in the Bioage project deleted once the rule is in the hook, so that no duplicate rule sits anywhere.
26. As the designer, I want every `/to-tickets` run to leave an execution plan beside the tickets, so that I have a guide to which tickets run in parallel without asking for it.
27. As the designer, I want the execution plan to show the waves, the critical path, what to watch for between parallel tickets and the command that starts each ticket, with no durations, so that it guides the work without setting a deadline I did not set.
28. As the designer, I want to accept 0.2.0 with a new field trial on a project started from zero, ending with `/handoff` for the session that maintains devio, so that the unmeasured rule is checked in real work.

## Implementation Decisions

- **Hook text: the fixed frame.** It goes among the designer's preferences, in English, in the
  hook's declarative register. Agreed wording:
  "The frame of the screen stays put. The app shell (header, navigation) has one height on every
  route and content starts at the same x; titles, search, filters and metrics go in the page body,
  never in the header; `html { scrollbar-gutter: stable }` keeps pages with and without a scrollbar
  aligned. Before a build with several routes is shown, the header height and the content's left
  edge are measured on every route at phone and desktop widths with Playwright, and they match:
  neither Impeccable's detector nor its reviewer looks across routes."
  Sources are in the research note in this folder: app shell and page header (Chrome/Workbox,
  Carbon, GOV.UK, Atlassian, Polaris), `scrollbar-gutter` on `html` (CSS Overflow Level 3 §5.2; MDN,
  Baseline 2024), and Impeccable 4.3.1 having no cross-route rule. All were read on 2026-09-23.
- **Hook text: the chain after a grill.** One line in the Chains: a grill ends with the session
  asking the designer to run `/to-spec`, then `/to-tickets`, then `/implement`; the session writes
  neither a spec nor tickets itself. Those three skills are `disable-model-invocation: true`
  (mattpocock-skills 1.2.3), so the Skill tool cannot reach them.
- **Hook text: the execution plan.** The same chain line says that when `/to-tickets` has published
  the tickets, the session writes an execution plan beside them, in the feature's folder in the
  issue tracker. The plan groups the tickets into waves that can run in parallel, marks the critical
  path, notes what to watch for between parallel tickets (shared files, merge order), gives the
  command that starts each ticket, and has no durations. mattpocock-skills 1.2.3 has no such
  artifact: `/to-tickets` records only each ticket's blocking edges and says to work the frontier
  (grep of the installed skills, 2026-09-23). The designer asked for it as plugin behaviour on
  2026-09-23. If the eval fails with the line alone, the `UserPromptExpansion` fallback matches
  `to-tickets` too.
- **Hook text: the code-review row.** It gains: in a new project, `git add -N` the new files first,
  because untracked files are not in the diff it reviews. Sources: the official page says it
  reviews "commits ahead of its upstream plus any uncommitted changes"
  (code.claude.com/docs/en/code-review, read 2026-09-23), and the Bioage trial showed the empty run.
- **Hook text: cuts.** Five preferences leave: Portuguese and English, the screen as the
  deliverable, grounded taste, reversible versus product decisions, and source and date on
  constraints. They stay in the designer's global CLAUDE.md, which reaches the session and non-fork
  subagents (code.claude.com/docs/en/sub-agents, read 2026-09-23). "References are seen, not
  described" stays in the hook. The chain "A critique of an existing screen" also leaves, because
  the table rows for Impeccable, Playwright and GSAP already say it. Recorded in ADR 0001.
- **Size budget.** The net change is about +100 characters over 6,232. The eval preparation script
  reads the hook text and stops with an error when it is over 10,000 characters.
- **Dependencies.** The vercel plugin, from `claude-plugins-official`, joins devio's `dependencies`.
  That marketplace needs no cross-marketplace allowance, and the preparation script then copies it
  into the eval dependencies with no special case. The README's install section and dependency
  list change to match.
- **No new hook in this release.** A `UserPromptExpansion` hook, matching the grill commands and
  appending the stop-after-grill line, is the documented fallback (code.claude.com/docs/en/hooks,
  read 2026-09-23). It is built only if the stop-after-grill eval fails with the chain line alone.
  The repository's CLAUDE.md admits a new hook only on that kind of evidence.
- **Version.** 0.2.0, with a CHANGELOG entry in Keep a Changelog form and a `v0.2.0` tag.
- **Git identity, done in the grill session, outside this spec.** The global git config includes a
  personal identity for remotes on the personal account (`hasconfig:remote.*.url`, from
  git-scm.com/docs/git-config, read 2026-09-23). The designer's global CLAUDE.md line was adjusted to
  match.

## Testing Decisions

- A good test here checks what a session did, meaning its tool calls, the files it wrote and its
  answer, and never the wording of the hook. The seam is the `claude plugin eval` suite. The
  designer confirmed it and the two checks below on 2026-09-23.
- **Prior art:** the five existing cases (critique-landing, scroll-reveal, library-docs,
  claude-code-question, no-specialist). Each is a `prompt.md` with frontmatter (the plugin list,
  `max_turns`, `allowed_tools`) plus a `graders/` folder of `tool_used` and `regex` graders, often
  with a sentence explaining why the pattern matches what it matches.
- **New cases:**
  - **References opened.** Two reference images as fixture files in the case, and a prompt asking
    for a hero section composed from them. A `tool_used` grader requires a `Read` of each image
    file. The eval docs support image fixtures (code.claude.com/docs/en/plugin-evals, read
    2026-09-23).
  - **Stop after a grill.** A prompt standing for the end of a grill, with every question answered
    and nothing left open, asking what comes next. An `llm` grader requires that the answer asks the
    designer to run `/to-spec`, and a `file_exists` grader, negated, requires that no spec file was
    written. The prompt must not tell the session to build, because the designer's direct
    instructions come first and would make the case meaningless.
  - **Execution plan after tickets.** A fixture issue tracker holding a spec and a few published
    tickets with blocking edges, and a prompt standing for the end of `/to-tickets`. A `file_exists`
    grader requires the execution plan in the feature's folder, and an `llm` grader requires waves
    that respect the blocking edges, a critical path, and no durations.
  - **Deploy goes to vercel.** A prompt asking to deploy a small project. A `tool_used` grader on
    the Skill tool requires a skill whose name starts with `vercel:`. The run must not reach a real
    deploy, so its allowed tools stop short of Bash.
- **Pass bar:** all nine cases pass on 3 runs with `--ablation none`, as in the README.
- **Static checks:** `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json`
  pass, with the one expected warning about the root CLAUDE.md. The size check runs inside
  `node evals/prepare.mjs`.
- **Not measured, and stated in the CHANGELOG:** the fixed-frame rule. Its case would need a
  multi-route fixture app, a running server and the Playwright MCP inside a run. The acceptance
  field trial covers it instead.

## Out of Scope

- An eval for the fixed-frame rule.
- A `UserPromptExpansion` hook, unless the stop-after-grill case fails.
- Making devio portable to a second designer: declaring the user-level skills and MCP servers
  (firecrawl, dataviz, client-report, Mobbin, shadcn), or restoring the preferences to the hook.
  Plugin `dependencies` can only name plugins (code.claude.com/docs/en/plugin-dependencies, read
  2026-09-23).
- Reinforcing the hook for the other specialists the trial skipped (`tdd`, `research`, firecrawl
  on the client's own site, the shadcn MCP, context7 for secondary libraries). The decision is to
  measure before rewording. `/implement` brings `tdd` at the agreed seams on its own.
- Upstream reports: the broken files from `shadcn init`, Impeccable's unrecorded build path and its
  skipped decision page. The `shadcn init` bug is recorded here only.
- Any change to Impeccable or mattpocock-skills.

## Further Notes

- Evidence: the Bioage trial report cited above (files 02, 03 and 07), and the research note
  `research-fixed-layouts.md` in this folder.
- Domain language: `CONTEXT.md` (Designer, Specialist, Routing table, Chain, Field trial, Trial
  report). Decision: `docs/adr/0001-one-designer-preferences-live-in-claude-md.md`.
- The field trial that accepts the release is a `ready-for-human` ticket. The designer picks the
  project, which must be new and started from zero. It ends with `/handoff` addressed to the
  session that maintains devio. Images the designer wants kept (captures, references) are copied
  next to it, since `/handoff` does not carry them.
- Every eval run is a real model call on the designer's plan.
