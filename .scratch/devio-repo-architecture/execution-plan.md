# Execution plan: devio-repo-architecture

Tickets in `issues/`, from `spec.md`.

## Waves

| Wave | Tickets | Runs in parallel |
| --- | --- | --- |
| 1 | 01 The repository is coherent, 02 One hook script, 03 The execution plan in any tracker | Yes |
| 2 | 04 The suite measures what devio contributes | No |
| 3 | 05 Release 0.5.0 | No |
| 4 | 06 Acceptance field trial (the designer, on a new project) | No |

## Critical path

02 → 04 → 05 → 06. Ticket 04 is the only step that spends a full suite run with the baseline, so it
waits until the hook script (02), the hook text (03) and the rules it rewrites (01) are final: the
suite runs once, on what ships.

## Watch between parallel tickets

- **README:** 01 edits the claim and the Layout table, 02 adds the contract test to the Layout table
  and says how to run it. Merge 01 first; 02 rebases on it.
- **Hook text vs hook script:** 03 edits the hook text; 02's contract test asserts a known line of
  it. 02 picks a line 03 does not touch (for example the opening heading).
- **Eval preparation:** 02 removes the size guard from it; 03 only adds a case directory. No shared
  lines.
- **`CLAUDE.md`:** 01 moves it to `.claude/`; 04 edits the release rule there. 04 starts after 01,
  so it edits the new location.
- **Cost:** 03 runs two cases with the baseline; 04 runs the full suite with the baseline. Both are
  real model calls on the designer's plan.

## Start each ticket

Each in a fresh session, from the repository root:

- 01: `/implement .scratch/devio-repo-architecture/issues/01-repository-coherent.md`
- 02: `/implement .scratch/devio-repo-architecture/issues/02-one-hook-script.md`
- 03: `/implement .scratch/devio-repo-architecture/issues/03-execution-plan-any-tracker.md`
- 04: `/implement .scratch/devio-repo-architecture/issues/04-suite-measures-contribution.md`
- 05: `/implement .scratch/devio-repo-architecture/issues/05-release.md`
- 06: no command; the designer starts a new project with devio 0.5.0 installed
