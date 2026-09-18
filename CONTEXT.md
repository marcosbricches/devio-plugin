# Devio design plugin

The Claude Code plugin that carries how a Devio product designer works with an agent: research-backed composition, executable prototypes, measurement instead of tests for what tests cannot judge, and gates by change. It runs under the mattpocock-skills flow (idea → spec → tickets → implement); it does not replace it.

## Language

**Effort**:
A body of work with its own map, roadmap, tickets, research and prototype, living in `.scratch/<effort>/` of a project.
_Avoid_: Feature, epic, sprint

**Roadmap**:
The layered execution board of an effort, derived from each ticket's `Blocked by`; the owner's guide to what can run now.
_Avoid_: Backlog, board

**Cumulative prototype**:
A real HTML/CSS/JS folder, composed from scratch in layers, where every prototype ticket adds a piece to the same artifact so coherence between pieces can be judged. Versioned in the effort; leaves the repo when the effort closes.
_Avoid_: Throwaway prototype, mockup, artifact

**Direction document**:
The prototype's decision log: each screen decision, what was revoked and why, and the rules that govern composition.
_Avoid_: Spec, brief

**Gate**:
The verification a change must pass, chosen by what changed; a green gate ends verification until the next change, failure or new question.
_Avoid_: Test suite, CI check

**Measurement**:
A script that answers a question about the rendered screen that a test cannot (contrast on photo, real sharpness, cost of a scroll). Feeds human judgement; asserts nothing.
_Avoid_: Test, benchmark

**Independent reviewer**:
A reviewer with a fresh context that sees only the diff and the criteria, not the reasoning that produced the change.
_Avoid_: Second opinion, QA

**Harvest**:
The step at the close of an effort that promotes project learnings that generalize into the plugin and drops the rest.
_Avoid_: Retro, post-mortem
