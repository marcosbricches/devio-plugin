# 10 — `/devio:setup` command

**What to build:** on an empty directory or an existing repository, the command explores first, then embeds only the project-side files — `AGENTS.md` with product limits and the mattpocock-skills block, `CONTEXT.md`, `docs/adr/`, `.scratch/` tracker, the measure config with placeholders, and the prototype scaffold on request — showing a diff before touching any existing file, and ends by printing the exact mattpocock-skills commands the model cannot invoke, in order.

**Blocked by:** 03, 04, 05, 06

**Status:** ready-for-agent

- [ ] `disable-model-invocation: true`; runs from `/devio:setup`
- [ ] Empty directory: every listed file created, nothing else; existing repository: diff shown, nothing overwritten without consent
- [ ] Written `AGENTS.md` carries no method — only project facts and pointers
- [ ] Closing message lists the commands to type (`/mattpocock-skills:setup-matt-pocock-skills`, then `/grill-with-docs` …)
- [ ] Manual gate recorded in the ticket: run on a temp directory and on a copy of viva-maracana
