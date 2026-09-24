# Spec: this repository's engineering, rebuilt coherent with mattpocock-skills and with devio's own hook text

**Status:** ready-for-agent

Settled in a grill with the designer on 2026-09-24. Evidence for the test seams is in
`research-test-seams.md` beside this spec.

## Problem Statement

The designer maintains devio but does not build Claude Code plugins themselves, so they depend on the
repository's engineering being right by construction. Today it is inconsistent in ways they cannot
see:

- The mattpocock-skills configuration was written from the setup skill's defaults and never adapted.
  The local issue tracker has no way to close a ticket, so the six tickets 0.2.0 shipped still read
  `ready-for-agent`. Research notes and the execution plan sit in the tracker's folders with no
  convention that says they belong there.
- The repository does not follow the hook text it ships. Its `CLAUDE.md` repeats what the hook text
  already says about review, and the README claims the repository "uses the same engineering
  structure" as mattpocock-skills when it only has the consumer configuration.
- The plugin's description still says it runs engineering through mattpocock-skills. Since 0.1.0 it
  has done much more: it routes every kind of task to its **specialist**.
- The hook's `SessionStart` matcher misses the `fork` source that Claude Code added, and the hook
  runs `cat` through a shell. On Windows without Git Bash that shell is PowerShell 5.1, which reads
  the file as ANSI and garbles the hook text's non-ASCII characters.
- The eval suite runs with `--ablation none`, so "30 of 30" never showed that devio made the
  difference. Its trace also never shows `SubagentStart`, so half of what the plugin does is not
  measured at all.
- `claude plugin validate --strict` fails, only because `CLAUDE.md` sits at the plugin root.
- The hook text says the **execution plan** goes "in the feature's folder of the issue tracker". A
  project whose tracker is GitHub Issues, the setup skill's default for a GitHub remote, has no
  such folder.

## Solution

The repository becomes a faithful consumer of mattpocock-skills and follows its own **hook text**:

- The tracker stays local markdown, and it gains a lifecycle: a ticket is deleted when the commit
  that resolves it lands, and a feature's folder is deleted when its last ticket goes.
- Research notes and the execution plan have a documented place.
- `CLAUDE.md` moves to the documented `.claude/` location and keeps only what is specific to
  maintaining the plugin.
- The two hooks become one Node script, run in exec form, with no shell.
- The hook text tells a session where the execution plan goes for whichever tracker the project
  uses.
- The suite measures devio's contribution against a no-plugin baseline.
- A contract test proves that both hooks emit what Claude Code accepts.

## User Stories

1. As the designer, I want every ticket that has shipped to disappear from the tracker, so that
   what I see in `.scratch/` is only the work still open.
2. As the designer, I want a resolved ticket's history to live in git and the CHANGELOG, so that
   deleting it loses nothing.
3. As the designer, I want a feature's folder (spec, execution plan, research) removed when its last
   ticket closes, so that no stale spec sits beside live work.
4. As the designer, I want the 0.2.0 tickets 01 to 06 deleted now, so that the tracker matches what
   has shipped.
5. As the designer, I want the field trial ticket kept open and pointed at 0.4.0, so that the trial
   I still plan to run checks the version that is installed.
6. As a session working on this repository, I want the issue-tracker doc to say where research notes
   and the execution plan live, so that I put them where the next session will look.
7. As a session running `mattpocock-skills:research` here, I want the convention to be a
   `research-<slug>.md` beside the feature's spec, so that I do not invent a location.
8. As a session running `/triage`, I want `.out-of-scope/` created the first time a request is
   rejected, so that the triage skill's knowledge base exists exactly when it is needed.
9. As the designer, I want the repository to keep only mattpocock-skills' consumer layer
   (`docs/agents/`, `CONTEXT.md`, `docs/adr/`) plus `.out-of-scope/`, so that it does not copy
   Matt's maintainer layer, which exists for a repository with twenty-odd skills.
10. As a session working on this repository, I want `CLAUDE.md` to hold only the rules for
    maintaining the plugin, so that I am not told twice, and possibly two different ways, what the
    hook text already tells me.
11. As a session working on this repository, I want the `## Agent skills` block to match the setup
    skill's template, so that every mattpocock skill finds its configuration where it expects it.
12. As the designer, I want `claude plugin validate --strict` to pass on both manifests, so that a
    misspelled field fails before release instead of loading silently.
13. As the designer, I want `CLAUDE.md` at `.claude/CLAUDE.md`, so that it still loads as project
    instructions and no longer trips the plugin-root warning.
14. As the designer, I want the README to describe the repository truthfully (a consumer of
    mattpocock-skills that follows its own hook text), so that nobody reads a false claim.
15. As someone browsing a marketplace, I want devio's description to say what it does (research
    first, the community's standard, the specialist called for each job), so that I install it
    for the right reason.
16. As the designer on Windows, I want both hooks to run without a shell, so that the hook text
    arrives intact whether or not Git Bash is installed.
17. As the designer, I want `SessionStart` to fire on every source, `fork` included, so that a
    session opened with `/branch` or `--fork-session` gets the hook text like any other.
18. As the designer, I want one script to serve both hook events, so that there is one mechanism to
    understand and to test.
19. As a subagent (Explore, Plan, general-purpose, a custom agent or an agent-team teammate), I want
    to receive the hook text at my start, so that I follow the same rules as the main session.
20. As the designer, I want a test that runs each hook exactly as `hooks.json` declares it and checks
    the output Claude Code accepts, so that a malformed output, which Claude Code ignores without an
    error, fails in the repository instead.
21. As the designer, I want that test to fail when the hook text passes 10,000 characters, so that
    the model never sees only a 2,000-character preview.
22. As the designer, I want the size guard to live in that test and not in the eval preparation, so
    that it runs where the hook is tested, without spending a model call.
23. As the designer, I want the eval suite to run with the no-plugin baseline, so that a case shows
    what devio contributed and not only what Claude does anyway.
24. As the designer, I want a routing case to count as passing only when it passes with devio and
    its Δ is above zero, so that a case that measures Claude and not devio is found and removed.
25. As the designer, I want the `no-specialist` case to count as passing at Δ ≥ 0, so that the guard
    that devio does not over-route still counts even though it passes without devio too.
26. As the designer, I want the README's measure command and the CLAUDE.md release rule to say the
    same thing about the baseline, so that the rule and the command cannot drift.
27. As a session in a project whose tracker is GitHub Issues, I want the hook text to tell me the
    execution plan goes as a comment on the spec's issue, so that the plan sits with the tickets in
    any tracker.
28. As a session in a project whose tracker is local markdown, I want the hook text to keep telling
    me the execution plan is a file in the feature's folder, so that the current behaviour holds.
29. As the designer, I want an eval case for the GitHub-tracker execution plan, so that the change
    to the hook text is measured before it ships, as `CLAUDE.md` requires.
30. As the designer, I want the glossary to name **Hook text**, so that every doc and ticket uses one
    word for the document devio adds.
31. As the designer, I want the release that carries this bumped, logged in the CHANGELOG and
    tagged, so that installs receive the hook fix.

## Implementation Decisions

- **Tracker lifecycle.** This is a local convention added to the issue-tracker doc under the
  mattpocock template's own sections, not a new status label:
  - a resolved ticket is deleted in the commit that resolves it, and the commit message names it;
  - a feature's folder, with its spec, execution plan and `research-<slug>.md` notes, is deleted
    when its last ticket is deleted;
  - triage labels stay the five defaults.
- **The original request ticket** for this work is resolved by this spec and is deleted with it,
  under the same rule.
- **`.out-of-scope/`** is not created now. `/triage` creates it lazily, as its own doc describes.
- **`CLAUDE.md` moves to `.claude/CLAUDE.md`**, which the memory docs list as a project-instructions
  location (code.claude.com/docs/en/memory, read 2026-09-24). What stays in it:
  - the scope rule ("keep it small, an addition, nothing may narrow");
  - the measure-before-ship rule;
  - the release rule;
  - the `## Agent skills` block in the setup template's exact shape.

  What goes: the `### Review` subsection, because the hook text's routing table already carries it
  and the repository follows its own hook text. The "one warning expected" sentence also goes,
  because the warning disappears.
- **Hooks.**
  - One Node script handles `SessionStart` and `SubagentStart`. It reads the event from the hook
    input on stdin and emits `hookSpecificOutput` with that event's name and the hook text as
    `additionalContext`.
  - Both hooks use exec form (`command: node`, `args` with the script path under
    `${CLAUDE_PLUGIN_ROOT}`). The hooks reference names "node plus script path" as the form that
    works on every platform, and it runs with no shell.
  - `SessionStart` has no matcher, so it fires for every source, `fork` included
    (code.claude.com/docs/en/hooks, read 2026-09-24).
  - `SubagentStart` has no matcher either. Claude Code itself avoids a second copy when a subagent
    resumes (same page).
- **No other hook events.** `SessionStart` already fires after compaction, and nothing else in the
  docs gives devio a reason to hook more.
- **Hook text change.**
  - The execution-plan sentence in the chain after a grill says the plan goes where the tracker
    keeps the tickets: a file in the feature's folder for local markdown, a comment on the spec's
    issue for GitHub or GitLab.
  - The text stays under 10,000 characters.
- **Manifests.**
  - The description in `plugin.json` and in the marketplace entry is rewritten to match the README's
    three points.
  - No field is added or removed: only `name` is required, and `$schema` is documented
    (code.claude.com/docs/en/plugins-reference, read 2026-09-24).
- **Eval preparation** keeps copying the dependencies and a dependency-free devio into `.eval-deps/`,
  since a run loads only plugins inside the repository. It loses the size guard, which moves to the
  contract test.
- **README.**
  - The false "same engineering structure" sentence goes.
  - The Measure section runs with the baseline and states the pass rule (with devio, Δ > 0; the
    guard case at Δ ≥ 0).
  - The Layout table adds `.claude/` and the test.
- **Release.** A minor version, since the hook text changes: CHANGELOG entry, tag.

## Testing Decisions

A good test here exercises what Claude Code sees, not how the script is written. The evidence is in
`research-test-seams.md`. The work tests at two seams and adds one static check.

- **Seam 1: the eval suite, with the baseline.** It is the highest seam: a real headless session
  with devio's hooks loaded, graded on what it did. The docs confirm an eval run loads the plugin's
  hooks and that Δ is what the plugin contributed (code.claude.com/docs/en/plugin-evals, read
  2026-09-24).
  - It covers the routing, the GitHub-tracker execution plan (a new case whose fixture's issue-tracker
    doc names GitHub, graded on the plan being addressed to the spec's issue and not written as a
    file) and the unchanged local-tracker case.
  - Prior art: the ten existing cases, especially `execution-plan`, whose fixture shape the new case
    copies.
  - Every case is run on 3 runs.
- **Seam 2: the hook contract test**, with `node:test`, so there are no dependencies. For each
  event, it spawns the command exactly as `hooks.json` declares it, writes that event's input JSON to
  stdin and asserts:
  - exit 0;
  - stdout parses as JSON;
  - `hookEventName` equals the event;
  - `additionalContext` holds a known line of the hook text;
  - `additionalContext` is at most 10,000 characters.

  This is the seam the eval cannot reach. Four real eval traces from 2026-09-23 show
  `SessionStart` and never `SubagentStart`, though three of them opened subagents. The docs also
  say Claude Code ignores malformed hook output without an error. Prior art in maintained plugins:
  Vercel's `tests/session-start-*.test.ts` (read in the installed vercel 0.48.0), Superpowers'
  `test-session-start.sh`, and the Codex plugin's `node:test` suite (all cited in the research note).
- **Static check:** `claude plugin validate --strict` on the marketplace and on the plugin
  manifest. It is a check, not a test seam: it catches schema and field errors, not behaviour. It
  passes on the marketplace today and fails on the plugin manifest only for the plugin-root
  `CLAUDE.md`.
- **A real session** shows the change working, as the hook text's chain for plugin work asks: the
  hook text visible at session start and in a subagent's first turn.

## Out of Scope

- Module-level architecture of the code (`improve-codebase-architecture`, deep modules): the runtime
  is one script, and the deletion test finds nothing to deepen.
- Matt's maintainer layer (`.agents/`, changesets, docs pages): it serves a repository shipping
  twenty-odd skills and two install routes.
- Moving the tracker to GitHub Issues: the designer kept local markdown.
- Making the local tracker the default for every project devio runs in: that would narrow a choice
  the setup skill leaves open.
- Any change to the routing table or the designer's preferences in the hook text beyond the
  execution-plan sentence.
- Running the field trial: it stays the designer's open ticket.

## Further Notes

- **Cost.** The baseline doubles each suite run's model calls, and the designer accepted that on
  2026-09-24.
- **Not confirmed:**
  - whether `claude -p --include-hook-events` would show `SubagentStart`. The contract test does not
    depend on it;
  - whether any grader can see a subagent's injected context.
- **ADR 0001 still holds.** The hook text still leaves out what the designer's global `CLAUDE.md`
  carries.
