# devio

A Claude Code plugin that adds to a session, and takes nothing away:

- **Research before any task**, and use what already exists: official docs, maintained libraries,
  installed skills, plugins and MCP servers.
- **Follow the community's standard** instead of inventing a process of our own.
- **Call the specialist**: each session and each subagent is told which installed skill or MCP
  server does which kind of task, such as Impeccable for interfaces, the GSAP skills for motion,
  context7 for library docs and the official docs for Claude Code, and how they chain. The table is
  not a closed list; any installed specialist that fits is used.
- **The designer's preferences** that their own `CLAUDE.md` does not already carry: references are
  opened as images, never replaced by a description of them, and the frame of the screen (app shell
  height, content's left edge) stays the same on every route, measured before a build is shown. The rest of the designer's
  preferences stay in that `CLAUDE.md` ([ADR 0001](docs/adr/0001-one-designer-preferences-live-in-claude-md.md)).

This repository is a consumer of [mattpocock-skills](https://github.com/mattpocock/skills): its
configuration lives in `docs/agents/`, and the repository follows its own hook text.

## Install

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add greensock/gsap-skills
claude plugin marketplace add marcosbricches/devio-plugin
claude plugin install devio@devio
```

Installing devio installs its dependencies: Impeccable, the GSAP skills, mattpocock-skills, context7,
Playwright and Vercel. Their marketplaces have to be added first. Claude Code adds
`claude-plugins-official` itself only the first time it starts interactively
(code.claude.com/docs/en/discover-plugins, read 2026-09-24), so an install run before that leaves
devio unloaded for want of mattpocock-skills; adding it again when it is there already does nothing.
Impeccable is built on Anthropic's `frontend-design`: keep one of the two enabled.

## Test

```bash
node --test tests/hooks.test.mjs
```

It runs each hook exactly as `hooks/hooks.json` declares it, with that event's input on stdin, and
checks what Claude Code accepts: exit 0, JSON on stdout, the event's `hookEventName`, the hook text
in `additionalContext`, and no more than the 10,000 characters Claude Code shows in full. Claude Code
ignores a malformed hook output without an error, and no eval trace shows `SubagentStart`, so this
is where both hooks are checked. It needs Node and nothing else.

## Measure

```bash
node evals/prepare.mjs
claude plugin eval . --runs 3 --no-publish --allow-real-servers --scaffold \
  --allow-tools Write "mcp__plugin_context7_context7__*" "WebFetch(domain:code.claude.com)"
```

Each case checks from the run's transcript and the files it wrote that the right specialist was
called and the right step taken. `--scaffold` runs the cases' own `scaffold.sh`, which copy their
fixtures into the run's workspace; `Write` lets a run write a spec or a plan, so the cases that
check for one, or for its absence, measure something.

Each case also runs without any plugin, devio and its specialists alike, which is Claude alone, and
the table shows `WITH`, `W/OUT` and their difference `Δ` (code.claude.com/docs/en/plugin-evals, read
2026-09-24). A case passes when it scores 1.0 with devio and its `Δ` is above zero: a case Claude
passes as well without devio measures Claude, not devio, and is removed. The one exception is
`no-specialist`, the guard that devio does not over-route, which passes at `Δ` ≥ 0. The baseline
doubles the runs, and every run is a real model call on your plan.

## Layout

| Path | Holds |
| --- | --- |
| `.claude-plugin/` | The plugin manifest with its dependencies, and the repository as its own marketplace |
| `hooks/` | The `SessionStart` and `SubagentStart` hooks, one script, and the text they add |
| `tests/` | The hook contract test |
| `evals/` | The eval suite and `prepare.mjs` |
| `docs/agents/` | The mattpocock-skills configuration: issue tracker, triage labels, domain docs |
| `.claude/` | `CLAUDE.md`: how to work on this repository |
