---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"vercel:'
---

Passes when the session called any `vercel:` skill, which is where the Vercel project's settings get
inspected before a push. The case gives no shell, so no run can reach a real deploy; the grade is
whether the request went to the specialist first.
