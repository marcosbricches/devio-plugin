# 04: The suite measures what devio contributes

**What to build:** The designer reads, for every case, what devio added over Claude alone. A routing
case passes only when it passes with devio and its Δ against the no-plugin baseline is above zero;
the `no-specialist` guard passes at Δ ≥ 0. A case that passes the same without devio is removed.

**Blocked by:** 01, 02, 03

**Status:** ready-for-agent

- [ ] The README's measure command runs with the baseline (no `--ablation none`) and states the pass rule
- [ ] The release rule in `.claude/CLAUDE.md` states the same pass rule
- [ ] The full suite runs on 3 runs with the baseline, on the final hook script and hook text
- [ ] Each case with Δ = 0 other than the guard is deleted, and the result (WITH, W/OUT, Δ per case) is recorded for the CHANGELOG
