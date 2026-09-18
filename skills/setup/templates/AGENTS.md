# <project>

<!-- Project facts only. How work is done lives in the devio plugin's skills and
     in mattpocock-skills; repeating it here is how it goes stale. -->

## What this is

<!-- One paragraph: what the product is, who it is for, what it has to do. -->

## Product limits

<!-- The constraints a change cannot break, each with its source and date.
     Examples of the shape, not of the content:
     - Purchase happens off-site; we never take payment (client brief, 2026-09-01).
     - The notice bar has a 54-character budget and counts toward the usable height (ADR-0035). -->

## Stack and commands

<!-- Only what `package.json` and the config files do not already say:
     which command builds, which serves a fixed port for measurement, and
     anything that surprises. -->

## Method

This repository works under two plugins. Do not restate their content here.

- **devio** — art direction, cumulative prototype, measurement, gates by change. Loads by itself when the task or the file path matches.
- **mattpocock-skills** — idea → spec → tickets → implement, plus the issue tracker and triage vocabulary configured in `docs/agents/`.

Measurement is configured for this repository in `measure.config.mjs`.

## Other agents

<!-- What an agent that does not load the plugins — Codex, a CI bot — still has
     to honour. This is the one place it belongs. -->
