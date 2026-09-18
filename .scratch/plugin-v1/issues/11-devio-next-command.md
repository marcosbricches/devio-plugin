# 11 — `/devio:next` command

**What to build:** the shortcut reads the repository state — map, spec, tickets and their status, prototype folder, roadmap — and either invokes the next model-invocable step (grilling, research, code-review, measurement) or names the exact command to type when the step belongs to a skill the model cannot invoke; it offers Codex adversarial review only for direction decisions, with the quota warning, and never enforces the order.

**Blocked by:** 05, 10

**Status:** resolved

- [x] `disable-model-invocation: true`; runs from `/devio:next`
- [x] State derivation covers: no tracker, map without spec, spec without tickets, open frontier ticket, all resolved, prototype awaiting critique
- [x] For each state, the output is one action or one command, with a one-line reason
- [x] Codex offer matches ADR-0005
- [x] Manual gate: run on viva-maracana at its current state and check the suggested step is right

## Manual gate — 2026-09-18

Walked the table row by row against viva-maracana at its current state.
`docs/agents/issue-tracker.md` is there, so row 1 passed; `measure.config.*`
is not, so row 2 fired and the step named is `/devio:setup`. That is the right
answer — the repository has an effort in flight but has not been embedded yet,
which is exactly what ticket 13 does. After that migration the same walk falls
through to the frontier-ticket row of the `linguagem-visual` effort.
