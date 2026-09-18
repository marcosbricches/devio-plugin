# devio plugin v1

Status: ready-for-agent

## Problem Statement

The way of working that produced the "ponto de fuga" round in viva-maracana — research-backed composition, a cumulative HTML prototype, measurement instead of tests for the screen, gates by change, a short client report — lives in that repository's markdown, its memory files and its scripts. Nothing of it is a mechanism Claude Code loads by itself: a new project starts from zero, the method is rediscovered by reading links, memories grow with noise, and the scripts are tied to one site's routes and selectors. The designer does not want commands to remember; they want a repository to already work the expected way, and the method to evolve in one place.

## Solution

A personal Claude Code plugin, `devio`, that ships the method as knowledge skills the model loads on its own, one `setup` command that embeds the project-side engineering into a repository, one `next` shortcut that knows the order of the flow, a reusable measurement library driven by a per-project measure config, and the client report generator. The global CLAUDE.md shrinks to the rules that hold in every project; memory is audited down to facts. viva-maracana becomes the first project on the plugin.

## User Stories

1. As a designer, I want the art-direction cycle to load by itself when I ask to compose, review or direct a screen, so that I never have to remember a command.
2. As a designer, I want the cumulative-prototype rules to load when the agent works inside an effort's prototype folder, so that composition starts from scratch in layers and the direction document stays current.
3. As a designer, I want the gates table to load when a change is about to be verified or committed, so that the right check runs for the kind of change and nothing else.
4. As a designer, I want the reviewer to be Claude's `/code-review` at low effort, so that verification does not depend on the Codex quota.
5. As a designer, I want reviewer findings filtered to correctness and stated requirements, so that the round does not drift into over-engineering.
6. As a designer, I want Codex adversarial review offered for direction decisions only, with a quota warning, so that I choose when to spend it.
7. As a designer, I want research to run in a dedicated Sonnet sub-agent by default, so that I do not have to restate that every time.
8. As a designer, I want `/devio:setup` to embed the project-side files into a new repository, so that the repository works the expected way from the first session.
9. As a designer, I want `/devio:setup` to tell me exactly which mattpocock-skills commands to type and in what order, so that the parts the agent cannot invoke are not forgotten.
10. As a designer, I want `/devio:setup` to work on an existing repository, so that viva-maracana can migrate without a rewrite.
11. As a designer, I want `/devio:next` to read the repository state and run or name the next step, so that I have a shortcut without being locked into an order.
12. As a designer, I want measurement scripts that run on any project from a measure config, so that contrast on photo, scroll junctions, main-thread cost, captures, line breaks and focus order are available on day one.
13. As a designer, I want LCP and CLS measured through Chrome DevTools MCP rather than plugin scripts, so that the plugin does not reimplement what the tooling already does.
14. As a designer, I want the measurement scripts to share one module for browser setup, font wait, full-page scroll and base URL, so that each script is short and consistent.
15. As a designer, I want the prototype scaffold (static server, asset versioning, direction document) created by setup, so that a new effort's prototype runs with Node alone.
16. As a designer, I want the client report generated from a markdown text with Devio's brand, so that every project ships the same two-page document.
17. As a designer, I want the report's Python dependencies declared, so that it runs on another machine after one install command.
18. As a designer, I want each effort's roadmap to count prototype rounds until client approval and composition fixes after implementation, so that the prototype-first thesis has its own data.
19. As a designer, I want a harvest step at the close of every effort, so that learnings that generalize are promoted into the plugin and the rest is dropped.
20. As a designer, I want the global CLAUDE.md to hold only the rules valid in every project, in English, under twenty-five lines, so that instructions are followed rather than diluted.
21. As a designer, I want code written with comments only for what the code cannot say, so that scripts read clean.
22. As a designer, I want the agent to stop and ask me to install a missing tool instead of working around it, so that quality does not degrade silently.
23. As a designer, I want the bash command-line guard to travel with the plugin, so that the same guardrail applies on any machine.
24. As a designer, I want the project memory audited down to one fact per file, with procedures moved into skills and universal rules into CLAUDE.md, so that memory stops growing with noise.
25. As a designer, I want the plugin versioned in git with a private remote, so that it survives this machine and can become Devio's design plugin.
26. As a designer, I want `claude plugin validate` to pass, so that the manifest and every skill frontmatter are well-formed.
27. As a designer, I want viva-maracana migrated to the plugin in its own batch, so that the setup command is proven on a real repository.
28. As a designer, I want every artifact in English and every conversation in Portuguese, so that community terms recruit what the model knows and I still work in my language.
29. As a designer, I want the plugin's own decisions recorded as ADRs and a changelog, so that the method's evolution has a trail.

## Implementation Decisions

- **Plugin layout.** `.claude-plugin/plugin.json` (name `devio`, semantic version bumped on every release), `skills/`, `agents/`, `hooks/hooks.json`, `docs/adr/`, `docs/research/`, `CONTEXT.md`, `README.md`, `CHANGELOG.md`. Skills are pointed at from the manifest as `./skills`.
- **Knowledge skills** (`user-invocable: false`, description-triggered, path-scoped where a folder identifies the task): `art-direction` (cycle with closing criteria, six-axis critique, visual research with source → mechanism → application → limit, side-by-side alternatives, delivery), `cumulative-prototype` (paths `.scratch/**/prototype/**`; layers, direction document with revocations, proposal-of-text kept apart from the prototype, versioning before publish), `gates` (gates-by-change table, reviewer and finding filter, manual pass, effort close with harvest and thesis counters), `measure` (paths `measure.config.*` and the scripts folder; when to measure what, and how to read results). Bodies under the documented size, task steps inline, reference behind pointers, community names where they exist.
- **Commands.** `/devio:setup` and `/devio:next`, `disable-model-invocation: true`. Setup explores the repository first, writes only project-side files, never overwrites without showing a diff, and ends by printing the mattpocock-skills commands the model cannot invoke. Next derives the state from `.scratch/` (map, spec, tickets, prototype, roadmap) and either invokes a model-invocable skill or names the command to type.
- **Sub-agent.** `agents/researcher.md` with `model: sonnet`, tools limited to reading, fetching and writing the research file; used by `art-direction` research and by `/devio:next` when the next step is research.
- **Reviewer.** Gates call Claude's built-in `/code-review` at low effort; the finding filter is text in `gates`. Codex `adversarial-review` is offered with a quota warning for direction decisions only.
- **Measurement library.** ESM under the `measure` skill: one shared module (browser context by width class, font readiness, full-page scroll, base URL and route list from the config), and scripts `contrast-on-photo`, `scroll-junctions`, `trace-cost`, `capture`, `line-breaks`, `focus-path`. Each script prints JSON with declared fields and takes the config path as its argument. LCP and CLS are documented as Chrome DevTools MCP calls. Header, shadow and colour-pair scripts are not ported; they are listed as per-project examples.
- **Measure config.** A JS module in the project root exporting base URL, routes, width classes, and the selectors the scripts need (text on photo, junctions, hidden text). Setup writes it with placeholders.
- **Prototype scaffold.** Static server, content-hash asset versioning, `DIRECTION.md` skeleton and `README.md` skeleton, written by setup into the effort's prototype folder on request.
- **Client report.** Python generator kept, with `requirements.txt`, Devio logo and palette as skill assets, input `text.md`, output name derived from the project.
- **Hooks.** `hooks/hooks.json` carries the bash command-line guard (moved from user settings). A roadmap-sync hook is recorded as a candidate in an ADR, not built.
- **Global CLAUDE.md.** Rewritten in English, under twenty-five lines: git identity, the screen is the deliverable, reversible choices are the agent's and product decisions go to the user with a comparison, deadline and commercial scope belong to the user, code ships ready, every constraint has a dated source, taste is grounded in research, missing tools are installed not bypassed, comments only for what code cannot say. The bash-guard explanation moves to the plugin.
- **Memory audit.** Procedures become skill content; universal rules become CLAUDE.md lines; project facts stay; duplicates and superseded items are deleted; target one fact per file and a dozen files.
- **Evolution.** Harvest at effort close; ADR for lasting decisions; changelog per version; `/doctor` monthly; `claude plugin eval` deferred until skills stabilize.
- **viva-maracana migration.** Setup runs on the repository; `docs/agents/especialistas-por-etapa.md`, `docs/agents/passe-manual.md` and `scripts/medicao/` are removed where the plugin covers them; `AGENTS.md` keeps product limits and the pointer to the plugin; project-specific measurement examples stay in the repository; the roadmap gains the thesis counters.

## Testing Decisions

- A good test here fails for a reason the design cannot change: the manifest is invalid, or a script's output lacks a declared field. Nothing asserts on prose or pixels.
- Seam 1: `claude plugin validate` over the whole plugin.
- Seam 2: each measurement script run against a fixture page served by the plugin's static server with a sample measure config, asserting the JSON shape. Prior art: the output-shape checks and `Range.getClientRects` line counting in viva-maracana's `scripts/medicao/`.
- Manual gates, recorded in the ticket: `/devio:setup` on an empty directory; the viva-maracana migration; a reading of every skill against the writing-for-agents no-op and sediment tests.

## Out of Scope

- Any change to mattpocock-skills; forks of its skills; a prototype command.
- Porting the client report to Node; a marketplace; multi-machine sync beyond a git remote.
- `claude plugin eval` suites; a roadmap-sync hook; Codex as the default reviewer.
- Product-specific rules of viva-maracana (notice bar, external purchase, client copy) — they stay in that repository's `AGENTS.md`.
- Header, shadow and colour-pair measurement scripts.

## Further Notes

- The prototype-first discipline is Devio's hypothesis, not a documented community practice (research 03); the thesis counters exist so that claim gains data.
- Research files in `docs/research/01–05` are the sources for every decision above and stay in the plugin.
- ADRs 0001–0005 in `docs/adr/` are binding for the tickets.
