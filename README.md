# devio

A Claude Code plugin that adds to a session, and takes nothing away:

- **Research before any task**, and use what already exists: official docs, maintained libraries,
  installed skills, plugins and MCP servers.
- **Follow the community's standard** instead of inventing a process of our own.
- **Call the specialist**: each session and each subagent is told which installed skill or MCP
  server does which kind of task, such as Impeccable for interfaces, the GSAP skills for motion,
  context7 for library docs and the official docs for Claude Code, and how they chain. The table is
  not a closed list; any installed specialist that fits is used.
- **The designer's preferences**: Portuguese in conversation and English in artifacts, the screen as
  the deliverable, taste grounded in real products, product decisions left to the designer, and a
  source and a date on every constraint.

Engineering follows [mattpocock-skills](https://github.com/mattpocock/skills), and this repository
uses the same engineering structure.

## Install

```bash
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add greensock/gsap-skills
claude plugin marketplace add marcosbricches/devio-plugin
claude plugin install devio@devio
```

Installing devio installs its dependencies: Impeccable, the GSAP skills, mattpocock-skills, context7
and Playwright. Their marketplaces have to be added first; `claude-plugins-official` comes with
Claude Code. Impeccable is built on Anthropic's `frontend-design`: keep one of the two enabled.

## Measure

```bash
node evals/prepare.mjs
claude plugin eval . --runs 3 --ablation none --no-publish --allow-real-servers \
  --allow-tools "mcp__plugin_context7_context7__*" "WebFetch(domain:code.claude.com)"
```

Each case checks from the run's transcript that the right specialist was called. Every run is a real
model call on your plan.

## Layout

| Path | Holds |
| --- | --- |
| `.claude-plugin/` | The plugin manifest with its dependencies, and the repository as its own marketplace |
| `hooks/` | The `SessionStart` and `SubagentStart` hooks and the text they add |
| `evals/` | The eval suite and `prepare.mjs` |
| `docs/agents/` | The mattpocock-skills configuration: issue tracker, triage labels, domain docs |
| `CLAUDE.md` | How to work on this repository |
