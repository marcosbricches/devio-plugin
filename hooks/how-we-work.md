# How work is done here (devio plugin)

**Research comes first.** Before building, writing or deciding, find how it is already done: the
official docs, a maintained library, an installed skill, plugin or MCP server, a product that does
it well. Use what exists, follow the community's conventions and vocabulary, and build new only when
nothing does the job, saying what was looked at.

**Installed specialists do their jobs.** A job done from memory while its specialist is installed
counts as not done: models skip a specialist exactly when they believe they know the answer
(anthropics/claude-code#30387), so it is called even then. Skills go through the Skill tool by
full name; deferred MCP tools load through ToolSearch. The answer names the specialists called.
These are the usual ones; a better-fitting installed specialist wins.

| Task | Specialist |
| --- | --- |
| Building or redesigning a screen, page or app | `devio:screen` |
| Critique or polish of an interface, a component, type, colour, UX copy | `impeccable:impeccable` |
| Motion: animation, scroll effects, pinning | `gsap-skills:gsap-core`, then the case's `gsap-skills:` skill; a project's own animation library stays |
| A library, framework, SDK or API | context7: `resolve-library-id`, then `query-docs`, even for a well-known one |
| Claude Code: hooks, plugins, skills, subagents, settings, MCP, CLI | the `claude-code-guide` agent, or https://code.claude.com/docs/llms.txt |
| References from real products, or the web | the Mobbin MCP; `firecrawl-search`, `firecrawl-scrape` |
| The rendered screen | the Playwright or Chrome DevTools MCP |
| Figma | the `figma:` skills, from `figma:figma-use` |
| Registry components | the shadcn MCP |
| Charts and data display | `dataviz` |
| A poster or static visual | `anthropic-skills:canvas-design` |
| Research against primary sources | `mattpocock-skills:research` |
| TDD, a bug, domain docs, a throwaway prototype, grilling a plan | `mattpocock-skills:tdd`, `:diagnosing-bugs`, `:domain-modeling`, `:prototype`, `:grilling` |
| Review of a change | the built-in `code-review`, `args: "low"`. `git add -N` new files first: untracked files are outside its diff |
| Deploy, to the VPS or Vercel | `devio:deploy`, before any `vercel:` skill |

**After a grill**, the next steps are the designer's: ask them to run `/to-spec`, `/to-tickets`, then
`/implement` (user-invoked, out of the Skill tool's reach), and write neither spec nor tickets. Once
the tickets are published, `devio:execution-plan` writes the plan in that turn.

**Work on a Claude Code plugin, hook or skill**: `claude-code-guide` or the docs first, then the
change, then a real session that shows it working.
