# 01: The repository is coherent with mattpocock-skills and with its own hook text

**What to build:** A session working on this repository finds each mattpocock skill's configuration
where the setup skill's template puts it, a tracker that shows only open work, and no rule that
repeats or contradicts the hook text. The designer sees `claude plugin validate --strict` pass on
both manifests, and a README and marketplace description that say what devio does.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The issue-tracker doc keeps the setup template's sections and adds the lifecycle: a resolved ticket is deleted in the commit that resolves it, named in the message; a feature's folder (spec, execution plan, `research-<slug>.md` notes) is deleted with its last ticket
- [ ] `CLAUDE.md` lives at `.claude/CLAUDE.md`, keeps the scope, measure and release rules and the `## Agent skills` block in the template's exact shape, and no longer carries the `### Review` subsection or the "one warning expected" sentence
- [ ] The README drops the "same engineering structure" claim and its Layout table lists `.claude/`
- [ ] The description in the plugin manifest and in the marketplace entry states the README's three points (research first, the community's standard, the specialist called for each job)
- [ ] `claude plugin validate . --strict` and `claude plugin validate .claude-plugin/plugin.json --strict` both exit 0
- [ ] A session opened in the repository lists `.claude/CLAUDE.md` under memory files in `/context`
