# 06 — `measure`: shared module, `capture`, fixture and shape test

**What to build:** the first measurement runs on any project from a measure config: a shared module gives browser contexts by width class, font readiness, full-page scroll and the base URL plus route list; `capture` screenshots every route at every width class into an output folder and prints JSON; a fixture page served by the plugin's static server and a sample config make the script runnable inside the plugin; a test asserts the JSON shape. This is the seam every later script reuses.

**Blocked by:** 01

**Status:** resolved

- [x] Measure config contract defined once (base URL, routes, width classes, selectors) and documented in the skill folder
- [x] `capture` takes the config path as argument and prints JSON with declared fields
- [x] Shape test runs with one command against the fixture and passes
- [x] Comment density follows research 05: one contract docstring per script, no step narration
- [x] Playwright is a declared dependency of the plugin, not assumed from the host project
