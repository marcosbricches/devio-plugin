# devio

A Claude Code plugin that adds to every session and subagent, and takes nothing away:

- **Research first**: official docs, maintained libraries, installed skills, plugins and MCP servers.
- **The community's standard** over a process of our own.
- **The installed specialist for each job**: a short routing table in `hooks/how-we-work.md`.
- **Skills that load only when their task comes up**: `devio:screen` (references to a checked render,
  with the designer's rules on references and the app-shell frame), `devio:execution-plan` and
  `devio:deploy`.

The designer's other preferences live in their own `CLAUDE.md`
([ADR 0001](docs/adr/0001-one-designer-preferences-live-in-claude-md.md)).

## Install

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add greensock/gsap-skills
claude plugin marketplace add marcosbricches/devio-plugin
claude plugin install devio@devio
```

Installing devio installs its dependencies: Impeccable, the GSAP skills, mattpocock-skills, context7,
Playwright and Vercel, so their marketplaces are added first. Keep either Impeccable or Anthropic's
`frontend-design` enabled, not both: Impeccable is built on it.

## Test

```bash
node --test tests/hooks.test.mjs
```

Runs each hook as `hooks/hooks.json` declares it and checks the output Claude Code accepts, within
the 10,000-character cap. Claude Code drops a malformed hook output silently, and no eval trace shows
`SubagentStart`, so this is where both hooks are checked.

## Measure

```bash
node evals/run.mjs
```

`claude plugin eval` compares a plugin only with a run that loads no plugin at all, where a case
like "context7 was called" can never pass. So each case runs twice: devio with its dependencies, and
the dependencies alone, the control. A case passes at 1.0 with devio and above control; a case tagged
`guard` checks that devio does not over-route and only has to match control. Control is cached per
case until the case, a specialist or Claude Code changes. Case names narrow the run, and other
arguments go to `claude plugin eval`: `node evals/run.mjs library-docs --runs 1`. Every run is a
real model call on your plan.

## Layout

| Path | Holds |
| --- | --- |
| `.claude-plugin/` | The manifest with its dependencies, and the repository as its own marketplace |
| `hooks/` | `SessionStart` and `SubagentStart`: one script and the text it adds |
| `skills/` | `screen`, `execution-plan`, `deploy` |
| `tests/` | The hook contract test |
| `evals/` | The eval cases and `run.mjs` |
| `docs/`, `CONTEXT.md` | ADRs and the mattpocock-skills configuration |
