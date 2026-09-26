# Working on this repository

This is the devio plugin for Claude Code. It ships two hooks that put `hooks/how-we-work.md` in
every session (`SessionStart`) and every subagent (`SubagentStart`), the skills that text points
to, and the specialists it routes to as `dependencies`. Keep it that small, and keep it an addition:
nothing in it may narrow what a session can use. A skill, hook, agent or tool enters only when
research shows nothing that already exists does the job.

The hook text is paid for in every session and every subagent, so it holds only what every task
needs: the routing table and the rules that fire without a skill to trigger them. Material only
some tasks reach goes into a skill.

A change to the hook text, a skill or the dependencies is measured before it ships with
`node evals/run.mjs`, which exits 0 only when every case scores 1.0 with devio and above the control
arm (the specialists without devio). A case where devio does not beat control measures the
specialists, not devio: fix the case, or delete the row of the hook text it was written for.

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
