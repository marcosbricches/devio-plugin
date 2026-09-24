# 04: The suite measures what devio contributes

**What to build:** The designer reads, for every case, what devio added over Claude alone. A routing
case passes only when it passes with devio and its Δ against the no-plugin baseline is above zero;
the `no-specialist` guard passes at Δ ≥ 0. A case that passes the same without devio is removed.

**Blocked by:** 01, 02, 03

**Status:** needs-info

- [x] The README's measure command runs with the baseline (no `--ablation none`) and states the pass rule
- [x] The release rule in `.claude/CLAUDE.md` states the same pass rule
- [x] The full suite runs on 3 runs with the baseline, on the final hook script and hook text
- [x] Each case with Δ = 0 other than the guard is deleted, and the result (WITH, W/OUT, Δ per case) is recorded for the CHANGELOG
- [ ] `execution-plan` passes at 1.0 with devio

## Comments

2026-09-24. Tickets 01 to 03 were merged into this branch first, so the suite ran on the final hook
script and hook text. Full suite: 9 of 11 at 1.0 with devio. `deploy-vps` and `references-opened`
had Δ = 0 and are deleted. The two execution-plan cases' `llm` judges failed correct answers (Haiku
and Sonnet alike; Sonnet called directly passed the same reply), so they now grade with `regex`,
checked offline against all 24 stored replies before the rerun. The rerun: `execution-plan-github`
1.00 / 0.33 / +0.67; `execution-plan` 0.67 / 0.00 / +0.67. The table is in `CHANGELOG.md` under
`[Unreleased]`.

Open: in one run of three, in each of three rounds, `execution-plan` with devio names
`execution-plan.md` as the next step but holds it back until the ticket fixes it proposes are
settled, and asks the designer whether to fix the tickets first or plan them as they stand. Whether
that is right is the designer's call: the hook text could say to write the plan against the tickets
as published and list the fixes beside it, or the case could accept the question. Ticket 05 waits
on it.
