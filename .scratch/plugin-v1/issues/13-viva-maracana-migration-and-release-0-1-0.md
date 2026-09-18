# 13 — viva-maracana migration and release 0.1.0

**What to build:** viva-maracana becomes the first project on the plugin: `setup` runs on it, the method files and measurement scripts the plugin now covers leave the repository, `AGENTS.md` keeps product limits and points to the plugin, project-specific measurement examples stay, the roadmap gains the thesis counters, the current effort keeps running unchanged; the plugin is tagged 0.1.0 with a changelog entry.

**Blocked by:** 07, 08, 09, 10, 12

**Status:** resolved

- [x] `docs/agents/especialistas-por-etapa.md`, `docs/agents/passe-manual.md` and the covered `scripts/medicao/` scripts removed; references fixed in the same commit
- [x] `measure.config` written with the site's routes and selectors; one plugin measurement runs against the site
- [x] `npm run verificar` and `npm run test:e2e` still green
- [x] A fresh session in viva-maracana loads the knowledge skills when asked to compose a screen
- [x] Plugin `version` bumped to 0.1.0, changelog written, tag pushed

## Gate — 2026-09-18

- `npm run verificar` green (469 unit tests, 0 errors, 2 pre-existing lint warnings).
- `npm run test:e2e` green (47 tests).
- `contrast-on-photo` run against the build on port 3100: 65 lines measured
  across two width classes, none below 4.5.
- A fresh `claude -p` session inside viva-maracana lists `devio:art-direction`,
  `devio:client-report`, `devio:cumulative-prototype`, `devio:gates` and
  `devio:measure`. `setup` and `next` correctly do not appear — they are
  user-invoked only.
- The uncommitted working tree found in viva-maracana (118 files, an earlier
  session's AGENTS.md rewrite) was committed on its own first, on the user's
  instruction, so the migration diff stands alone.
