# 13 — viva-maracana migration and release 0.1.0

**What to build:** viva-maracana becomes the first project on the plugin: `setup` runs on it, the method files and measurement scripts the plugin now covers leave the repository, `AGENTS.md` keeps product limits and points to the plugin, project-specific measurement examples stay, the roadmap gains the thesis counters, the current effort keeps running unchanged; the plugin is tagged 0.1.0 with a changelog entry.

**Blocked by:** 07, 08, 09, 10, 12

**Status:** ready-for-agent

- [ ] `docs/agents/especialistas-por-etapa.md`, `docs/agents/passe-manual.md` and the covered `scripts/medicao/` scripts removed; references fixed in the same commit
- [ ] `measure.config` written with the site's routes and selectors; one plugin measurement runs against the site
- [ ] `npm run verificar` and `npm run test:e2e` still green
- [ ] A fresh session in viva-maracana loads the knowledge skills when asked to compose a screen
- [ ] Plugin `version` bumped to 0.1.0, changelog written, tag pushed
