# 03: Deploy goes to the vercel skills

**What to build:** Installing devio installs the vercel plugin (from `claude-plugins-official`),
so the routing table's deploy row names a specialist the install brings, and the eval preparation
copies it without a special case. A new eval case asks to deploy a small project and passes only
when the session calls a `vercel:` skill. The run is given no shell, so it cannot reach a real
deploy.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The vercel plugin is in devio's dependencies; `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json` pass with only the expected root CLAUDE.md warning
- [x] The README's install section and dependency list include vercel
- [x] The eval preparation copies vercel into the eval dependencies and the existing cases still load
- [x] A `tool_used` grader on the Skill tool requires a skill name starting with `vercel:`
- [x] A `file_exists` grader requires a Dockerfile
- [x] A second case, a deploy to the company's Docker VPS, requires a `Dockerfile` and a Compose file
- [x] The routing table's deploy row says every deploy ships one Docker image (ADR 0002)
- [x] Both cases pass 3 of 3 runs

## Comments

2026-09-23, implementation: during this ticket the designer said most deploys go to the company's
VPS with Docker and only some to Vercel, and chose one Docker image for every target (ADR 0002).
The deploy row now says so, and a second case, `deploy-vps`, joined `deploy-vercel`.

- `deploy-vps`: 3 of 3.
- `deploy-vercel`: the first wording named the Vercel beta as a caveat, and all three runs skipped
  the Dockerfile on purpose, citing it ("that feature is in beta ... it would add risk with no
  benefit"). The row now says the standard is the designer's, chosen knowing it is a beta: 3 of 3.
- `claude plugin validate` passes on both manifests with only the root CLAUDE.md warning.
- The five original cases load with vercel in their plugin list (no-specialist ran once, 1.00; the
  full suite in ticket 06 covers the rest).
