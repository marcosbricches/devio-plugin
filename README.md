# devio

A Claude Code plugin that adds to every session and subagent, and takes nothing away:

- **Research first**: official docs, maintained libraries, installed skills, plugins and MCP servers.
- **The community's standard** over a process of our own.
- **The installed specialist for each job**: a short routing table, `hooks/how-we-work.md`, added to
  every session and every subagent that does work.
- **How Devio works**: a recommendation with its evidence, both outcomes and one next step; a mistake
  recorded in the repository in the same turn (a rejected design deleted, a lesson about devio itself
  ending the reply as a Trial report); formal text for clients.
- **Skills that load only when their task comes up** (below).

devio is written for one designer: preferences their global `CLAUDE.md` already carries stay out
of it.

## Install

Requires Claude Code and Node on `PATH`: the hook runs `node`.

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add greensock/gsap-skills
claude plugin marketplace add blader/humanizer
claude plugin marketplace add marcosbricches/devio-plugin
claude plugin install devio@devio
```

Installing devio installs its dependencies, so their marketplaces are added first: Impeccable, the
GSAP skills, mattpocock-skills, context7, the Chrome DevTools MCP, Firecrawl and humanizer. Keep
either Impeccable or Anthropic's `frontend-design` enabled, not both: Impeccable is built on it.

`.mcp.json` adds the Mobbin and shadcn MCP servers. A server you already registered at the same URL
or command wins and devio's copy is skipped (code.claude.com/docs/en/mcp, scope hierarchy, read
2026-10-01). Every specialist the routing table names lives on the machine, none on the claude.ai
account, so switching accounts removes none of them.

shadcn is pinned to one version. Claude Code gives a server 30 seconds to start, and plugins cannot
raise that limit: only `agent` and `subagentStatusLine` apply from a plugin's settings
(code.claude.com/docs/en/plugins-reference, read 2026-10-02). With `shadcn@latest`, the first start
after each shadcn release downloads the package, which took 29.8 s on 2026-10-02 against 4.6 s from
the cache. The logs on this machine showed 28 `CONNECT_TIMEOUT`s. Warm the cache once after
installing or updating devio:

```bash
npx -y shadcn@4.21.1 --version
```

A shadcn you registered yourself with another command, such as `npx shadcn@latest mcp`, runs beside
devio's and brings back the timeouts. Remove it with `claude mcp remove shadcn -s user`.

Two specialists need a sign-in of your own, which no session handles: Mobbin asks for OAuth on first
use, and Firecrawl needs its CLI and key, `npm install -g firecrawl-cli`, then
`firecrawl login --browser` (or `FIRECRAWL_API_KEY` in your environment).

To update: `claude plugin update devio@devio`, or turn on auto-update for the `devio` marketplace.

## Skills

| Skill | Loads when |
| --- | --- |
| `devio:references` | References are gathered, judged or steered: the bar (currency, the product's own world, tone, depth), images saved to disk with their source and year, and the round, which only the designer's "this is it" closes |
| `devio:brand` | A product needs an identity or a brand manual, or a prompt for a design tool: the order of the effort, the Lean prompt for Claude Design, the Version review of each round, the Closing pass on the manual, and the cuts to make when a result comes back generic |
| `devio:screen` | A screen, page or app is built, redesigned or corrected: the visual language first (the approved brand manual's, else one the designer brings or the client's site), the Lead from one ladder, a render at desktop and phone width and every control clicked in every round, Impeccable, the app-shell frame measured across routes |
| `devio:execution-plan` | `/to-tickets` has just published a feature's tickets: waves, the critical path, what to watch between parallel tickets |
| `devio:deploy` | Anything is deployed, or a project has no CI: one Docker image for Devio's CD, and a GitHub Actions workflow that runs the gate, or GitHub's Node.js starter steps when there is none |

## Test

```bash
node --test tests/hooks.test.mjs tests/skills.test.mjs
```

`hooks.test.mjs` runs each hook as `hooks/hooks.json` declares it and checks the output Claude Code
accepts, within the 10,000-character cap. Claude Code drops a malformed hook output silently, and no
eval trace shows `SubagentStart`, so this is where both hooks are checked. `skills.test.mjs` checks
that the standing rule of `devio:screen`, `devio:references` and `devio:brand` sits in the first
5,000 tokens, the part Claude Code keeps after compaction, and that the trigger words fit each
description.

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
   exiting 0. A change to `screen`, `references`, `brand` or a design row of the hook text reaches the
   design set, run once: `moodboard-round`, `reference-bar`, `brand-lean-prompt`, `generic-result`,
   `screen-direction`, `brand-language`, `manual-wins`, `new-screen`, `queue-conflict`, `designed-control`,
   `rendered-screen`, `correction-round`, `control-inventory`, `delegation` (14 cases).
2. Bump `version` in `.claude-plugin/plugin.json` and add a `CHANGELOG.md` entry with the measured
   table. Move the shadcn pin in `.mcp.json` and the warm-up line above to `npm view shadcn version`.
3. `claude plugin validate . --strict` and `claude plugin validate .claude-plugin/plugin.json --strict`.
4. Commit, push, then `claude plugin tag --push`, which tags `devio--v<version>`.

Users receive a release when `version` changes (code.claude.com/docs/en/plugins/host-marketplace).

## Layout

| Path | Holds |
| --- | --- |
| `.claude-plugin/` | The manifest with its dependencies, and the repository as its own marketplace |
| `.mcp.json` | The Mobbin and shadcn MCP servers |
| `hooks/` | `SessionStart` and `SubagentStart`: one script and the text it adds |
| `skills/` | `references`, `brand`, `screen`, `execution-plan`, `deploy` |
| `tests/` | The hook contract test and the skills' compaction test |
| `evals/` | The eval cases and `run.mjs` |
