# devio

A personal Claude Code plugin carrying how a Devio product designer works with an agent: research-backed composition, a cumulative HTML prototype, measurement instead of tests for what tests cannot judge, and gates chosen by what changed.

## Scope

Claude Code only, running beneath [`mattpocock-skills`](https://github.com/mattpocock/skills) — it adds the visual, measurement and gate layer under that package's idea → spec → tickets → implement flow and does not re-implement grilling, the wayfinder or the local tracker ([ADR-0001](docs/adr/0001-claude-code-only-under-mattpocock-skills.md)). Install both; `devio` alone is half a method.

What other agents must also honour belongs in each project's `AGENTS.md`, not in a skill here.

## Language

Every artifact in this repository — skills, agents, hooks, scripts, ADRs, `CONTEXT.md` — is written in English, so community terms recruit what the model already knows. The conversation with the user stays in Portuguese ([ADR-0002](docs/adr/0002-artifacts-in-english-conversation-in-portuguese.md)).

## What ships

- **Knowledge skills** the user never invokes — `art-direction`, `cumulative-prototype`, `gates`, `measure` — loaded by the model when the task or the file path matches ([ADR-0003](docs/adr/0003-knowledge-skills-not-commands.md)).
- **Commands** — `/devio:setup` embeds the project-side files into a repository; `/devio:next` reads the repository state and runs or names the next step.
- **`researcher`** — a Sonnet sub-agent that reads, fetches and writes one research file.
- **Hook** — `bash-cmdline-guard`, which blocks a Bash call that would be truncated silently by Git Bash on Windows. The ceiling and how it was measured are documented at the top of `hooks/bash-cmdline-guard.js`.

## Install

```bash
claude plugin marketplace add <path-to-this-repo>
claude plugin install devio@devio
```

Installing here replaces the user-level copy of the bash guard: remove any `PreToolUse` entry pointing at `~/.claude/hooks/bash-cmdline-guard.js` from `~/.claude/settings.json`, or the guard runs twice.

## Layout

| Path | Holds |
| --- | --- |
| `skills/` | Knowledge skills and commands |
| `agents/` | Sub-agents |
| `hooks/` | `hooks.json` and the hook scripts |
| `docs/adr/` | Decisions binding on the plugin |
| `docs/research/` | The sources those decisions rest on |
| `CONTEXT.md` | The plugin's vocabulary |

## Evolution

Decisions that last become an ADR; every release gets a `CHANGELOG.md` entry and a tag. At the close of an effort in any project, the harvest step promotes what generalises into this plugin and drops the rest.
