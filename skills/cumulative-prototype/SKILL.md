---
name: cumulative-prototype
description: How an effort's cumulative HTML prototype is built and kept. Use when working inside a `.scratch/<effort>/prototype/` folder, when composing a screen before it is implemented, or when scaffolding a new prototype for an effort.
user-invocable: false
paths:
  - "**/.scratch/*/prototype/**"
  - "**/.scratch/*/prototipo/**"
---

One real HTML/CSS/JS folder per effort, grown across tickets. Every composition ticket adds a piece to the same artifact, because what gets judged is whether the pieces cohere — a set of separate mockups cannot show that.

It runs on Node alone, lives in the effort, and leaves the repository when the effort closes. It is never imported by production code; production reads it and rebuilds.

This is not mattpocock's `/prototype`, which is one throwaway prototype per question on its own branch. That stays the right tool for a logic or state question. Never run it for a composition ticket, and never move this folder onto a throwaway branch ([ADR-0004](../../docs/adr/0004-cumulative-prototype-diverges-from-mattpocock-prototype.md)).

## Scaffold

Copy `scaffold/` into `.scratch/<effort>/prototype/`. It carries `tools/serve.mjs`, `tools/version-assets.mjs`, and the `DIRECTION.md` and `README.md` skeletons — headings only, waiting for this effort's content.

```bash
node tools/serve.mjs          # serves the folder, default port 4321
node tools/version-assets.mjs # before publishing: rewrites every ?v= to a content hash
```

`version-assets.mjs` is idempotent: it hashes with the `?v=` values stripped, so running it twice in a row changes nothing.

## Compose in layers

Build from scratch, bottom up, and let each layer settle before the next leans on it:

1. **Primitives** — reset, type scale, spacing scale, the grid.
2. **Tokens** — colour, type and space as named values, used by name from here on.
3. **Components** — the repeated pieces, each in its own state.
4. **Pages** — real screens assembled from the above.

A page that reaches past the layer below it for a one-off value is the signal that the token or component is missing, not that the page is special.

## Real content

Real copy and real photos, from the start. Lorem ipsum and grey boxes hide exactly the problems this prototype exists to expose — line breaks, crop, contrast over a photo, the length of the longest locale.

Proposed text is a separate artifact: keep it in `text/` as markdown for the client to read and approve, and let the prototype consume the approved version. A copy change that only exists inside a `<p>` is a change nobody can review.

## DIRECTION.md

The decision log, current at all times. Each entry: what was decided, the reference behind it, the trade accepted. A rule that stops holding is recorded as a **revocation** — what replaced it and why it failed — not deleted. The revocations are the part that stops the same rejected idea coming back three rounds later.

Write the entry in the same pass as the change. A direction document reconstructed at the end of an effort is fiction.

## Publishing

Before any link goes to the client: run `version-assets.mjs`, check the screens at 375 px and at desktop, and make sure `README.md` says what the prototype deliberately does not cover.

## Closing the effort

The prototype is removed with the effort. What survives it is what was promoted: decisions into ADRs, composition into production code, learnings into the plugin. Read `gates` for the close.
