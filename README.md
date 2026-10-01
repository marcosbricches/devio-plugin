# devio

A Claude Code plugin that adds to every session and subagent, and takes nothing away:

- **Research first**: official docs, maintained libraries, installed skills, plugins and MCP servers.
- **The community's standard** over a process of our own.
- **The installed specialist for each job**: a short routing table, `hooks/how-we-work.md`, added to
  every session and every subagent that does work.
- **How Devio works**: a recommendation with its evidence, both outcomes and one next step; a mistake
  recorded in the repository in the same turn; formal text for clients.
- **Skills that load only when their task comes up** (below).

devio is written for one designer: preferences their global `CLAUDE.md` already carries stay out
of it.

## Install

Requires Claude Code and Node on `PATH`: the hook runs `node`.

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add greensock/gsap-skills
claude plugin marketplace add marcosbricches/devio-plugin
claude plugin install devio@devio
```

Installing devio installs its dependencies, so their marketplaces are added first: Impeccable, the
GSAP skills, mattpocock-skills, context7 and Playwright. Keep either Impeccable or
Anthropic's `frontend-design` enabled, not both: Impeccable is built on it.

The routing table also names specialists devio does not install. Each is used when present: the
Mobbin MCP, firecrawl, the Chrome DevTools MCP, the `figma:` skills, the shadcn MCP, `dataviz` and
`anthropic-skills:canvas-design`.

To update: `claude plugin update devio@devio`, or turn on auto-update for the `devio` marketplace.

## Skills

| Skill | Loads when |
| --- | --- |
| `devio:screen` | A screen, page or app is built or redesigned: references first, Impeccable, a render compared against the references, the app-shell frame measured across routes |
| `devio:execution-plan` | `/to-tickets` has just published a feature's tickets: waves, the critical path, what to watch between parallel tickets |
| `devio:deploy` | Anything is deployed, or a project with a gate has no CI: one Docker image for Devio's CD, and a GitHub Actions workflow that runs the gate |

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

Runs each case once with devio and its dependencies loaded, and exits 0 when every case scores 1.0.
Name the cases a change reaches: `node evals/run.mjs library-docs`. Other arguments go to
`claude plugin eval`. `llm` graders are judged by sonnet: the default small judge passed replies that
failed their rubric. The dependencies must be installed, and every run is a real model call on your
plan. No case grants Bash, so everything runs on native Windows.

## Release

1. Change the hook text, a skill or the dependencies only with `node evals/run.mjs <cases it reaches>`
   exiting 0.
2. Bump `version` in `.claude-plugin/plugin.json` and add a `CHANGELOG.md` entry with the measured
   table.
3. `claude plugin validate . --strict` and `claude plugin validate .claude-plugin/plugin.json --strict`.
4. Commit, push, then `claude plugin tag --push`, which tags `devio--v<version>`.

Users receive a release when `version` changes (code.claude.com/docs/en/plugins/host-marketplace).

## Layout

| Path | Holds |
| --- | --- |
| `.claude-plugin/` | The manifest with its dependencies, and the repository as its own marketplace |
| `hooks/` | `SessionStart` and `SubagentStart`: one script and the text it adds |
| `skills/` | `screen`, `execution-plan`, `deploy` |
| `tests/` | The hook contract test |
| `evals/` | The eval cases and `run.mjs` |
