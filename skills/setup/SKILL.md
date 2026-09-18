---
name: setup
description: Embed the project-side files of the devio method into this repository.
disable-model-invocation: true
---

Explore first, write second, overwrite never without consent.

Method stays in the plugin; only project facts are written here. A file this command writes that restates a skill is a bug — it will go stale the moment the skill changes.

## 1. Explore

Read before writing. Report what is already there:

- `git remote -v`, and whether the working tree is clean.
- `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` at the root — do they exist, and what do they already carry?
- `docs/adr/`, `docs/agents/` — has `mattpocock-skills` setup already run here?
- `.scratch/` — are there efforts in flight?
- `measure.config.*` at the root.
- `package.json` — the build command, and whether a fixed-port serve exists for measurement.
- Whether this repository already carries method documents of its own (a process doc, a gates table, measurement scripts). Name them; they are candidates for deletion once the plugin covers them, but that is the user's call, not this command's.

State what is missing and what would change. Then ask once, and wait.

## 2. Write

| File | Content | If it exists |
| --- | --- | --- |
| `AGENTS.md` | From `templates/AGENTS.md`, with the project's name and whatever product facts exploration already found | Show a diff of the additions and ask; never rewrite what is there |
| `CONTEXT.md` | From `templates/CONTEXT.md` | Show a diff and ask |
| `docs/adr/` | Created empty if absent | Leave alone |
| `.scratch/README.md` | From `templates/scratch-README.md` | Leave alone |
| `measure.config.mjs` | From `templates/measure.config.mjs`, with placeholders | Show a diff and ask |
| `.gitignore` | Append `.scratch/*/measure/` if absent | Append only |

On an empty directory: create exactly these and nothing else. No source tree, no framework, no README of your own invention.

**Prototype scaffold** — only when asked, and only into a named effort. Copy `../cumulative-prototype/scaffold/` into `.scratch/<effort>/prototype/`. Do not create an effort folder speculatively.

Fill the templates with what exploration actually found. A placeholder left in `AGENTS.md` is better than a product limit you invented.

## 3. Close

Print, in this order, the commands the model cannot invoke — the human types them:

```
/mattpocock-skills:setup-matt-pocock-skills   once, to configure the issue tracker and triage labels
/mattpocock-skills:grill-with-docs            to sharpen the idea and write the ADRs and the glossary
/mattpocock-skills:to-spec                    to turn the conversation into a spec
/mattpocock-skills:to-tickets                 to break the spec into tickets with their blocking edges
/mattpocock-skills:implement <ticket>         one ticket per session
```

Then say, in one line each:

- `/devio:next` reads the repository state and names the next step.
- The devio knowledge skills load by themselves; there is nothing to remember.
- `measure.config.mjs` needs this project's real selectors before any measurement runs.

Closes when every file in the table exists or was explicitly declined, and the closing message has been printed.
