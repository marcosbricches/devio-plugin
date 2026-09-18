# 09 — `client-report` skill

**What to build:** a project's `text.md` becomes the two-page `.docx` on Devio's paper — logo, palette, typography — with the output name derived from the project; the generator's Python dependencies are declared so one install command makes it run on another machine; the skill body says what a good report contains (about two pages, origin of every decision, humanized text).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Generator runs from the plugin with `requirements.txt` installed; a missing dependency stops with the install command, never a workaround
- [ ] Brand assets live in the skill folder; no viva-maracana text or file name remains
- [ ] Skill description triggers on "report for the client" intents; body states content rules, not generator internals
- [ ] Comment density per research 05
