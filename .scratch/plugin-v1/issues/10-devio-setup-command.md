# 10 — `/devio:setup` command

**What to build:** on an empty directory or an existing repository, the command explores first, then embeds only the project-side files — `AGENTS.md` with product limits and the mattpocock-skills block, `CONTEXT.md`, `docs/adr/`, `.scratch/` tracker, the measure config with placeholders, and the prototype scaffold on request — showing a diff before touching any existing file, and ends by printing the exact mattpocock-skills commands the model cannot invoke, in order.

**Blocked by:** 03, 04, 05, 06

**Status:** resolved

- [x] `disable-model-invocation: true`; runs from `/devio:setup`
- [x] Empty directory: every listed file created, nothing else; existing repository: diff shown, nothing overwritten without consent
- [x] Written `AGENTS.md` carries no method — only project facts and pointers
- [x] Closing message lists the commands to type (`/mattpocock-skills:setup-matt-pocock-skills`, then `/grill-with-docs` …)
- [x] Manual gate recorded in the ticket: run on a temp directory and on a copy of viva-maracana

## Manual gate — 2026-09-18

Run following the skill's own table, both without the command (it is
user-invoked), to check the instructions produce the stated result.

- **Empty directory** — created exactly `AGENTS.md`, `CONTEXT.md`, `docs/adr/`,
  `.scratch/README.md`, `measure.config.mjs`, `.gitignore`, and nothing else.
  The written config imports and exposes the five contract keys.
- **Copy of viva-maracana** — `AGENTS.md`, `CONTEXT.md` and `docs/adr/` already
  existed and were left byte-identical; only `.scratch/README.md` and
  `measure.config.mjs` were created, and `.gitignore` was appended to.

`AGENTS.md` as written carries product headings and two pointer lines to the
plugins; no method text.
