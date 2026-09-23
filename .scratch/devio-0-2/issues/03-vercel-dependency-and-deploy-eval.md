# 03: Deploy goes to the vercel skills

**What to build:** Installing devio installs the vercel plugin (from `claude-plugins-official`),
so the routing table's deploy row names a specialist the install brings, and the eval preparation
copies it without a special case. A new eval case asks to deploy a small project and passes only
when the session calls a `vercel:` skill. The run is given no shell, so it cannot reach a real
deploy.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The vercel plugin is in devio's dependencies; `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json` pass with only the expected root CLAUDE.md warning
- [ ] The README's install section and dependency list include vercel
- [ ] The eval preparation copies vercel into the eval dependencies and the existing cases still load
- [ ] A `tool_used` grader on the Skill tool requires a skill name starting with `vercel:`
- [ ] The case passes 3 of 3 runs
