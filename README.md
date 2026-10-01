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

`claude plugin eval` compares a plugin only with a run that loads no plugin at all, where a case like
"context7 was called" can never pass. So each case runs twice: devio with its dependencies, and the
dependencies alone, the control. A case passes at 1.0 with devio and above control; a case tagged
`guard` checks that devio does not over-route and only has to match control. Control is cached per
case until the case, a specialist, Claude Code or the judge changes. `llm` graders are judged by
sonnet: the default small judge passed replies that failed their rubric.

Case names narrow the run, and other arguments go to `claude plugin eval`:
`node evals/run.mjs library-docs --runs 1`. The dependencies must be installed. Every run is a real
model call on your plan.

### On Windows

A case that lists `Bash` (`test-cadence`) needs a sandbox, and native Windows has none: the run is
refused and scores 0 (code.claude.com/docs/en/sandboxing, read 2026-10-01). Such cases, and any
whole-suite run, go through WSL2. Set it up once:

1. In an administrator PowerShell, `wsl --install -d Ubuntu`, then restart Windows if asked.
2. The account prompt takes the password without echoing it. If keystrokes do not reach it, close
   the window, enter as root with `wsl -d Ubuntu -u root`, create the user with
   `adduser --disabled-password --gecos "" <name>`, add it to `sudo`, write `[user]` /
   `default=<name>` to `/etc/wsl.conf`, then `wsl --terminate Ubuntu`.
3. Inside Ubuntu: `sudo apt-get install -y bubblewrap socat nodejs npm git`, then
   `curl -fsSL https://claude.ai/install.sh | bash`, `exec bash -l`, and `claude` once to sign in.
4. Add the marketplaces and install the plugins listed in `dependencies` in
   `.claude-plugin/plugin.json` with `claude plugin marketplace add` and `claude plugin install`.
   The Windows install does not carry over: `run.mjs` reads the plugins of the home it runs in.
5. Run from a clone in the Linux home, not from `/mnt/c`. Git refuses the Windows checkout as
   another user's until `git config --global --add safe.directory /mnt/c/<path>/.git`; then
   `git clone /mnt/c/<path> ~/devio` and `node evals/run.mjs <case>` there.

## Release

1. Change the hook text, a skill or the dependencies only with `node evals/run.mjs` exiting 0.
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
