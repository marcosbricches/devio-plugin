# 08 — `measure`: `line-breaks`, `focus-path` and the skill body

**What to build:** line breaks per text block across the configured widths and the keyboard focus path (order, return symmetry, ring presence, target size) run from the config; the `measure` `SKILL.md` tells the agent when to measure what, how to read each JSON, and that LCP and CLS are taken through Chrome DevTools MCP calls rather than plugin scripts.

**Blocked by:** 06

**Status:** resolved

- [x] `user-invocable: false`; `paths` scoped to the measure config and scripts folder
- [x] Both scripts covered by the shape test
- [x] LCP and CLS documented as DevTools MCP calls with what to record
- [x] Header, shadow and colour-pair measurements listed as per-project examples, not shipped
- [x] Passes the writing-for-agents no-op and sediment tests
