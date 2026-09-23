# How work is done here (devio plugin)

**Research comes before any task.** Before something is built, written or decided, the way it is
already done gets found first: the official documentation, a maintained library, an installed skill,
plugin or MCP server, a product that already does it well. What exists is used. Something new is
built only when nothing that exists does the job, and the answer says what was looked at.

**The community's standard is followed**: its conventions, its vocabulary and its tools. No process,
format or rule is invented where one already exists.

**Specialists are installed for most jobs, and the designer expects them to be called.** A job done
from memory while its specialist is installed counts as not done. Models tend to skip a specialist
exactly when they believe they already know the answer (anthropics/claude-code#30387), so the
specialist is called even then. A skill is called with the Skill tool by its full name; an MCP
server's tools are loaded through ToolSearch when they are deferred. The answer names the
specialists that were called. A subagent dispatched for one narrow task calls the ones its task
needs. The designer's direct instructions come first.

## Who does what

The usual cases. The table is not a closed list: any other installed skill, plugin or MCP server that
fits the task is used as well, and a better fit beats the one listed here.

| When the task involves | The specialist |
| --- | --- |
| Any interface: a screen, page, component, layout, type, colour, UX copy; designing, redesigning, critiquing, auditing, polishing | `impeccable:impeccable`. Impeccable's own README starts a new project with `/impeccable init`, which writes `PRODUCT.md` |
| Motion: animation, scroll effects, pinning, sequencing, reveal on scroll | When the project has no animation library of its own yet (the GSAP skills themselves say to respect one already chosen): `gsap-skills:gsap-core`, then the one for the case: `gsap-skills:gsap-scrolltrigger`, `gsap-skills:gsap-timeline`, `gsap-skills:gsap-react`, `gsap-skills:gsap-frameworks`, `gsap-skills:gsap-plugins`, `gsap-skills:gsap-performance` |
| Code that uses a library, framework, SDK or API, or a question about one | The context7 MCP: `resolve-library-id`, then `query-docs`, even for a library that seems well known |
| Claude Code itself: hooks, plugins, skills, subagents, settings, MCP, the CLI | The Agent tool with `subagent_type: "claude-code-guide"`, or the official index at https://code.claude.com/docs/llms.txt |
| References from real products: screens, flows, sections | The Mobbin MCP: `search_screens`, `search_flows`, `search_sections` |
| References from the web, or a site's design system | `firecrawl-search`, `firecrawl-scrape` with a screenshot, `firecrawl-website-design-clone`; its `DESIGN.md` goes with the screenshot, never instead of it |
| Looking at the rendered screen | The Playwright MCP or the Chrome DevTools MCP |
| Figma files | The `figma:` skills, starting with `figma:figma-use` |
| Components from a registry | The shadcn MCP |
| Charts and data display | `dataviz` |
| A poster or a static visual piece | `anthropic-skills:canvas-design` |
| Researching a question against primary sources | `mattpocock-skills:research` |
| TDD, a bug, domain docs, a throwaway prototype, grilling a plan | `mattpocock-skills:tdd`, `mattpocock-skills:diagnosing-bugs`, `mattpocock-skills:domain-modeling`, `mattpocock-skills:prototype`, `mattpocock-skills:grilling` |
| A spec, tickets, an implementation run | `/to-spec`, `/to-tickets`, `/implement`: user-invoked, so the Skill tool cannot reach them and the designer is asked to run them |
| Review of a change | Claude Code's built-in `code-review` skill, `args: "low"`, with no plugin prefix |
| Deploy | One Docker image for every target, Vercel included, even for a single static page: the designer's standard, chosen knowing that Vercel's container images are a beta enabled per account. A `Dockerfile`, `compose.yaml` and `.dockerignore` in the shape `docker init` writes, from Docker's docs through context7, are written first. The company's VPS runs the image with Docker Compose; Vercel runs it as a container-image Function, through the `vercel:` skills, which inspect the Vercel project before anything is pushed |

A specialist that is not installed is named, and the designer is asked to install it rather than the
job being done by hand with something worse.

## Chains

One task often needs several specialists in a row. These are examples, not fixed sequences: each
task takes the steps it needs, in the order it needs them.

- **A new screen or a redesign**: Mobbin and firecrawl for references, saved as images and opened →
  `impeccable:impeccable` to shape and build, composing from those images → the GSAP skills for its
  motion → context7 for every library it uses → Playwright to screenshot the render and read it next
  to the references → `impeccable:impeccable` to critique and polish.
- **After a grill** (`grill-with-docs`, `grill-me`, or `mattpocock-skills:grilling` called directly):
  the session stops and asks the designer to run `/to-spec`, then `/to-tickets`, then `/implement`;
  it writes neither a spec nor tickets itself. Once `/to-tickets` has published the tickets, an
  `execution-plan.md` goes beside them in the feature's folder of the issue tracker: the tickets in
  waves that can run in parallel, the critical path, what to watch for between parallel tickets
  (shared files, merge order) and the command that starts each ticket, with no durations.
- **A feature in code**: context7 for the libraries → `mattpocock-skills:tdd` → the built-in
  `code-review` at low effort.
- **Work on a Claude Code plugin, hook or skill**: `claude-code-guide` or the docs index first → the
  change → a real session that shows it working.

## The designer's preferences

- References are seen, not described. A reference is an image and stays one: it is saved to disk and
  the thread that composes opens it with Read and looks at it. A written summary of it, a notes file
  or a subagent's report, loses the composition and the character the image carries, and a
  subagent's reply comes back as text only, so it never replaces opening the images. The composition
  is taken from the references the designer pointed to: a direction Impeccable rolls does not replace
  them (its own rule: the roll never outranks the user or the brief). What gets built is
  screenshotted and read next to the references, image against image, and what differs is fixed
  before the screen is shown.
