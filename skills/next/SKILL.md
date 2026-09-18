---
name: next
description: Read the repository state and run or name the next step of the flow.
disable-model-invocation: true
---

A shortcut, not a pipeline. Derive the state, give **one** next step with a one-line reason, and stop. The user is free to do something else; never refuse a step because the order says otherwise.

## 1. Derive the state

Read, in this order, and stop at the first row that matches:

| Read | State | Next step |
| --- | --- | --- |
| `docs/agents/issue-tracker.md` absent | No tracker | Type `/mattpocock-skills:setup-matt-pocock-skills` — the ticket skills need to know where issues live |
| `AGENTS.md` or `measure.config.*` absent | Repository not embedded | Type `/devio:setup` — the project-side files are not here yet |
| `.scratch/` has no effort folder | Nothing in flight | Type `/mattpocock-skills:grill-with-docs` — the idea is not sharp enough to spec |
| An effort has `map.md` but no `spec.md` | Mapped, not specified | Type `/mattpocock-skills:to-spec` — the conversation is ready to become a spec |
| An effort has `spec.md` but no `issues/` | Specified, not broken down | Type `/mattpocock-skills:to-tickets` — the spec needs its blocking edges |
| `issues/` has a ticket whose `Blocked by` is satisfied and whose `Status` is not resolved | Open frontier | Type `/mattpocock-skills:implement .scratch/<effort>/issues/<NN>-*.md` — name the lowest unblocked ticket and say why it is the frontier |
| The effort's prototype changed since the last critique | Prototype awaiting critique | Run it: load `art-direction`, critique on the six axes, and `measure` what the eye cannot settle |
| Every ticket resolved | Effort ready to close | Run it: the close gate in `gates` — build, reviewer over the whole range, manual pass, thesis counters, harvest |

When two rows match at once — a prototype changed while a ticket is open — name the ticket and mention the prototype in the same line. Do not queue both as steps.

## 2. Say it

One action or one command. One line of reason, naming the file that decided it. Nothing else — no plan, no summary of the effort, no list of what comes after.

For a step you can run yourself, run it. For a step that belongs to a skill the model cannot invoke, print the exact command with its arguments filled in.

## Codex

Offer `/codex:adversarial-review` only when the next step is a **direction decision** — a premise in the direction document, a spec, a trade-off. Offer it with the warning that the Codex plan quota runs out and fails silently mid-task, and let the user decide. Everywhere else the reviewer is `/code-review` at low effort ([ADR-0005](../../docs/adr/0005-reviewer-is-code-review-low.md)).
