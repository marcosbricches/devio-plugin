---
name: art-direction
description: The cycle for directing a screen — observe, research, compose, critique, deliver. Use when asked to compose, redesign, direct or critique a screen, a page, a section or a visual language; when choosing between visual alternatives; or when judging whether a rendered screen is good. Not for code-only work with no visual judgement in it.
user-invocable: false
---

Five stages, each closing on its own criterion. Skip a stage and the round pays for it later: composing without observing produces a screen that solves the wrong problem, composing without research produces a generic one.

An adjustment inside a direction already chosen skips to **Critique**. A new direction runs the whole cycle.

## 1. Observe

Open the real inputs — the client's pieces, the actual photos, the live screen — as images, never as a description of them. Read focus, type scale, crop, light, surfaces, space, and the character of any graphic device. Tie the feeling being asked for to the visitor's task on this screen.

**Closes when** you have named three things in writing: the intent to preserve, the visual problem to solve, and the inputs that are missing.

## 2. Research

Write the visual question before you search. A question about hierarchy, rhythm or density is answered by other products; colour and type come from the identity, not from a gallery.

Delegate the reading to the `researcher` agent. Point it at Mobbin `search_screens` with `platform: "web"` for composition, and at direct competitors for **competitive evaluation** (NN/g's term: several competing products compared early, to find the opportunity rather than to rank). Ask it back in the four fields it already writes: **source → mechanism → application → limit**.

Read the returned images yourself. Reuse research already in the effort when it still answers the question.

A count of sites or a proportion of colours describes the sample, not the right answer — Mobbin says this about its own data: a pattern found is a convention, not a proven best practice. Carry it as a hypothesis to compose with, and say so.

**Closes when** the proposal names a relevant reference and the search covered an alternative or a counter-example.

## 3. Compose

Build with real content and real photos. Settle photography, crop, scale, hierarchy and surface first; effects reinforce a composition that already works, they do not rescue one. When adapting a graphic technique, preserve what makes it recognisable.

An open visual decision is settled **side by side**: alternatives with the same finish, the same assets and the same content, varying only the hypothesis, each in its best version. A cheap version of the option you dislike is not a comparison.

Composition happens in the effort's cumulative prototype, not in production components.

**Closes when** the screen is rendered at 375 px and at desktop, ready to be compared against the reference and against the alternative. Until it is seen, the composition is a hypothesis; a spec without a prototype records that the proof is still owed.

## 4. Critique

This is **visual QA**: with images, fonts and motion loaded and running, look at the first screen, the whole scroll, and the movement. Six axes:

- **Focus** — does the first element perceived say what this screen is about?
- **Desire** — do photo and scale make the experience concrete and wanted?
- **Hierarchy** — do title, support, price and action carry legible weight and order?
- **Rhythm** — does each section change subject clearly?
- **Identity** — do graphics and photography keep their character across pages?
- **Use** — can the visitor tell products apart, find information, and reach the action with the real chrome present?

A generic screen needs a better photo, a better scale and a better composition — not ornament. A technical limit is proven with a standard or a trial in context, and then the hunt is for the execution that preserves the intent.

The eye judges the screen; code and premises get a reviewer that does not share your bias. Read `gates` for which reviewer runs on what changed, and `measure` for the questions the eye cannot settle alone — contrast of text over a photo, real line breaks, main-thread cost, focus order.

**Closes when** the round's defects are fixed or explained with a cause, the gates for what changed are green, and you have stated which device or emulation you used and what you could not inspect.

## 5. Deliver

Show the capture or the preview. Cite the references. Say what improved and **what trade you accepted**. A choice that belongs to the user goes up with the comparison already built and a recommendation.

Before turning one screen's solution into a rule, check a second instance of it and the locale with the longest text.

The ticket keeps the evidence, the decision and the rule for applying it; the prototype's direction document keeps the decision and what it revoked.
