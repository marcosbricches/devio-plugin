---
name: gates
description: Which verification a change has to pass, and when verification is over. Use before verifying, reviewing or committing a change, when deciding whether to run more checks, and when closing an effort.
user-invocable: false
---

A **gate** is the verification a change must pass, chosen by what changed. A green gate ends verification — repeat it only after a new change, a failure, or a new question. Running the suite again on unchanged code buys nothing and costs the round's time.

Tests protect logic and contracts. Composition is reviewed by looking at it, and by `measure` for the questions looking cannot settle.

## Gates by change

Each row is cumulative with the rows above it where they apply. Substitute the project's own commands — they are in `package.json`, `AGENTS.md` or the measure config, not in this table.

| What changed | Gate |
| --- | --- |
| Process documentation | Diff read end to end, local links resolved, no rule duplicated or contradicted |
| Content, translation or logic | The project's verify command (lint, types, unit) |
| CSS, tokens, type, composition or motion | Verify command + inspection at 375 px and desktop, with fonts and photos loaded |
| JS of motion, measurement or tooling | The above + independent reviewer |
| Colour pair | The above + contrast measurement; text over a photo is measured on the final composition, never against a flat approximation |
| Route, metadata, sitemap, link or section markup | Verify command + the end-to-end suite |
| Direction decision (direction document, spec, ADR) | Adversarial review of the premise, before it goes to the user |
| Effort close or publish | Everything above that applies + production build + reviewer over the whole range since the last close + the manual pass |

A failure arriving as a block of errors has one first cause. Read it, check the infrastructure, then work down — do not fix nine symptoms of one broken server.

## The reviewer

The default reviewer is Claude's `/code-review` at low effort: a fresh context that sees the diff and the criteria, not the reasoning that produced them. Low effort is the deliberate setting for a design team that values iteration speed over exhaustive review ([ADR-0005](../../docs/adr/0005-reviewer-is-code-review-low.md)).

**Filter the findings.** A finding counts when it affects correctness or a requirement that was actually stated. Everything else is optional, and chasing all of it produces the damage Anthropic names directly: extra abstraction layers, defensive code, and tests for cases that cannot happen. A counted finding is fixed or answered with its cause; an optional one is noted and dropped.

Codex `adversarial-review` is an **offer**, for direction decisions only — a premise in the direction document, a spec, a trade-off. Offer it with the warning that the Codex plan quota runs out and fails silently mid-task, and let the user choose to spend it. Never make it a default gate.

What no reviewer sees — focus, desire, rhythm, identity — stays inspection by eye, with the images loaded.

## The manual pass

Before publishing, a person runs what automation cannot judge. Automation covers roughly the machine-decidable half of accessibility; the rest needs judgement.

- **Keyboard** — tab to the end and `Shift+Tab` back, on mobile and desktop, with the real chrome on screen. Does the order tell the page's story? Does the focus ring survive photos and colour blocks? Does every carousel, map or embed let focus in and back out?
- **Screen reader** — one page of each type. Headings descend without skipping. Every outbound link says it opens externally, and its accessible name contains the visible text. Validation errors are announced, not only painted. Pending-content skeletons are not announced.
- **External validators** — anything only a vendor's tool can confirm (rich results, embed eligibility), run on the real URL.

Record the date, who passed, and what they found — including "nothing". An unrecorded pass counts as not done.

## Closing an effort

1. Run the close gate above.
2. Record the two thesis counters in the effort's roadmap. They are the evidence for Devio's prototype-first hypothesis, which is not a documented community practice and needs data:
   - **Prototype rounds until client approval** — how many times the prototype went back before it was approved.
   - **Composition fixes after implementation** — visual defects found after the screen was built, which the prototype should have caught.
3. **Harvest.** Read what the effort learned and sort each learning: it generalises to every project, or it belongs to this one, or it was wrong. What generalises is promoted into the plugin — a skill edit, an ADR, a new measurement. What belongs to the project stays in its `AGENTS.md`. The rest is dropped.
4. Remove the effort's prototype folder. What survives it was promoted in step 3.

Closes when the counters are in the roadmap and every learning has been promoted, kept or dropped by name.
