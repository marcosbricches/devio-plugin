# Working on this repository

This is the devio plugin for Claude Code. It ships two hooks that put `hooks/how-we-work.md` in
every session (`SessionStart`) and every subagent (`SubagentStart`), and it declares the specialists
that text routes to as `dependencies`. Keep it that small, and keep it an addition: nothing in it may
narrow what a session can use. A skill, hook, agent or tool enters only when research shows nothing
that already exists does the job.

A change to the hook text or the dependencies is measured before it ships: `node evals/prepare.mjs`,
then the `claude plugin eval` command in `README.md`. Every case passes on 3 runs.

Run `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json` after touching
either manifest. The one warning expected is this file: a `CLAUDE.md` at the plugin root is read
when working on the repository, not shipped as context, which is what it is for. Every release bumps `version` in `plugin.json`, gets a
`CHANGELOG.md` entry and a `v<version>` tag.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default roles, each label equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the root, created when a term or a decision is first resolved. See `docs/agents/domain.md`.

### Review

Claude Code's built-in `code-review` skill at low effort: the Skill tool with `skill: "code-review"` and `args: "low"`, no plugin prefix. `mattpocock-skills:code-review` answers to the same name, so name the built-in one explicitly wherever a workflow says `/code-review`.
