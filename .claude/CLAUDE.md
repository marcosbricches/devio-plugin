# Working on this repository

This is the devio plugin for Claude Code. It ships two hooks that put `hooks/how-we-work.md` in
every session (`SessionStart`) and every subagent (`SubagentStart`), and it declares the specialists
that text routes to as `dependencies`. Keep it that small, and keep it an addition: nothing in it may
narrow what a session can use. A skill, hook, agent or tool enters only when research shows nothing
that already exists does the job.

A change to the hook text or the dependencies is measured before it ships: `node evals/prepare.mjs`,
then the `claude plugin eval` command in `README.md`. Every case passes on 3 runs.

Run `claude plugin validate . --strict` and `claude plugin validate .claude-plugin/plugin.json --strict`
after touching either manifest; both exit 0. Every release bumps `version` in `plugin.json`, gets a
`CHANGELOG.md` entry and a `v<version>` tag.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default roles, each label equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the root. See `docs/agents/domain.md`.
