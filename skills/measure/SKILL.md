---
name: measure
description: Measurement scripts for a rendered screen — contrast over a photo, scroll junctions, main-thread cost, captures, line breaks, focus path. Use when a visual question needs a number rather than an opinion, when editing a measure config or a measurement script, and when reading the JSON one of them printed.
user-invocable: false
paths:
  - "**/measure.config.*"
  - "**/skills/measure/**"
---

A **measurement** answers a question about the rendered screen that a test cannot, and asserts nothing. It produces JSON for a person to read. The decision that follows — move the text, recrop the photo, rewrite the line — stays with the designer.

Reach for one when looking has produced a disagreement, or when the thing to judge is smaller than the eye resolves: a line that only fails contrast on its left third, a junction that only jars mid-scroll, a cost that only shows in a trace.

Every script takes the project's [measure config](CONFIG.md) as its first argument and prints one JSON object. Run the site from a build on a fixed port, not the dev server, whenever numbers will be compared between runs.

```bash
node <plugin>/skills/measure/scripts/<script>.mjs ./measure.config.mjs
```

`<plugin>` is this plugin's root — the directory holding the `skills/` folder this file sits in. Read it off the absolute path of this `SKILL.md`; it is not a project path and not the current working directory.

The scripts run on the plugin's own Playwright, not the project's. A script that stops asking for
`npm install` is telling you the plugin was checked out without its dependencies — run the command
it prints, in the plugin root.

## What to reach for

| Question | Script | Read |
| --- | --- | --- |
| Is the screen what I think it is, at both widths? | `capture` | The images. `documentSize` catches a page that grew unexpectedly. |
| Does the text on the photo hold up everywhere along the line? | `contrast-on-photo` | `shareBelow4_5` per line — one number saying how much of the line fails. `minContrast` says how bad the worst pixel is. |
| Does the seam between two sections read while scrolling? | `scroll-junctions` | The three images per junction, in order. 50 % is where a seam usually breaks. |
| What is the main thread paying for, between these two moments? | `trace-cost` | `selfMs` per category against `spanMs`. Scripting dominating a scroll is the usual finding. |
| How does this title actually break at 375 px? | `line-breaks` | `lines` — the real words per line. `widow: true` is the break most worth fixing. |
| Does the keyboard path tell the page's story? | `focus-path` | `stops` in order, then `returnSymmetric`, `stopsWithoutRing`, `stopsUnderTarget`, `stopsInHiddenText`. |

`trace-cost` takes three more arguments: the trace file and the two mark names.

```bash
node trace-cost.mjs ./measure.config.mjs ./trace.json composition:start composition:end
```

The marks are the page's own `performance.mark()` calls, so mark the span you are judging before recording.

## LCP and CLS

Take them through Chrome DevTools MCP, not through a script here — `performance_start_trace` with `reload: true` and `autoStop: true`, then `performance_analyze_insight`. It is the same engine the Performance panel uses, and reimplementing it would only produce a second set of numbers to reconcile.

Record: the value, the element LCP resolved to, which shifts made up CLS, the width class, and whether throttling was on. A Core Web Vital without its conditions is not comparable to anything.

## Reading any of them

The envelope is the same everywhere: `measurement`, `generatedAt`, `baseUrl`, `results`. Numbers are CSS pixels and milliseconds unless the field name says otherwise.

A measurement describes one build on one machine. Say which, next to the number. A script that cannot find its selector stops and names the missing config key rather than guessing a class — trust that, and fix the config.

## Browsers that lie about motion

Two measured traps, both of which make a working prototype look broken:

- **A background tab throttles `requestAnimationFrame` to about one frame per second**, and with it `IntersectionObserver` and CSS transitions. A capture taken that way shows a scroll-reveal that never revealed. Call `page.bringToFront()` at the start of any script that measures motion, and wait at least 1.2 s after scrolling.
- **A browser opened by an MCP server may carry `prefers-reduced-motion: reduce`**, so motion never starts at all, and outside a trace its frame rate is meaningless. Check the media query before concluding anything about motion; measure frame cost inside a trace, or drive the page with Playwright at `reducedMotion: 'no-preference'`.

The scripts here already open their own foreground context, so this bites when measuring by hand through an MCP browser, not when running them.

## Per-project measurements

Some measurements are worth writing, once, inside the project they belong to, because their subject is that project's own composition: chrome and notice-bar height against the usable viewport, shadow depth across a surface set, a specific colour pair from the identity. Write those under the project's own scripts folder, in the same shape — config in, one JSON object out — and leave them there. Only what generalises comes back into this plugin, at the effort's harvest.

## Changing a script

The shape test (`npm test` at the plugin root) runs every script against the fixture and asserts the declared fields and their types, never the values. Add a field, extend the test in the same pass. The fixture is deliberately imperfect — its hero text fails contrast over the bright part of the photo, and its cards repeat a link name — so the scripts are exercised against the cases they exist to catch.
