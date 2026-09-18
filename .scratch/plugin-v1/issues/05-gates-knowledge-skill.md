# 05 — `gates` knowledge skill

**What to build:** before verifying or committing a change, the agent knows which gate applies to what changed (documentation, content or logic, CSS or composition, JS of motion or tooling, colour pair, direction decision, route or metadata, effort close), that a green gate ends verification until the next change, that the reviewer is Claude's `/code-review` at low effort with findings filtered to correctness and stated requirements, that Codex adversarial review is an offer with a quota warning for direction decisions only, what the manual pass covers, and that closing an effort includes the harvest and the two thesis counters in the roadmap.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `user-invocable: false`; description triggers on verify/commit/close-an-effort intents
- [ ] The gates table is generic: it names kinds of change and kinds of check, not viva-maracana script names
- [ ] Reviewer rule and finding filter match ADR-0005
- [ ] Harvest and thesis counters (prototype rounds until approval; composition fixes after implementation) are steps with a checkable end
- [ ] Passes the writing-for-agents no-op and sediment tests
