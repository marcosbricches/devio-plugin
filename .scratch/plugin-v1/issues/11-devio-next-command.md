# 11 — `/devio:next` command

**What to build:** the shortcut reads the repository state — map, spec, tickets and their status, prototype folder, roadmap — and either invokes the next model-invocable step (grilling, research, code-review, measurement) or names the exact command to type when the step belongs to a skill the model cannot invoke; it offers Codex adversarial review only for direction decisions, with the quota warning, and never enforces the order.

**Blocked by:** 05, 10

**Status:** ready-for-agent

- [ ] `disable-model-invocation: true`; runs from `/devio:next`
- [ ] State derivation covers: no tracker, map without spec, spec without tickets, open frontier ticket, all resolved, prototype awaiting critique
- [ ] For each state, the output is one action or one command, with a one-line reason
- [ ] Codex offer matches ADR-0005
- [ ] Manual gate: run on viva-maracana at its current state and check the suggested step is right
