# 04 — `cumulative-prototype` knowledge skill and scaffold

**What to build:** working inside an effort's prototype folder loads the rules: composed from scratch in layers (primitives → tokens → components → pages), real content and photos, a `DIRECTION.md` that records each decision and each revocation with its reason, text proposals kept apart from the prototype, assets versioned by content hash before publishing. The scaffold — static server, versioning script, `DIRECTION.md` and `README.md` skeletons — runs with Node alone and is what `setup` will copy.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] `user-invocable: false` with `paths` scoped to the prototype folder pattern
- [ ] ADR-0004 is honoured: no command, no throwaway branch, `/prototype` reserved for logic questions
- [ ] Scaffold serves a folder on a chosen port and versions `?v=` by content hash, idempotently
- [ ] Skeletons carry headings only, no viva-maracana content
- [ ] Passes the writing-for-agents no-op and sediment tests
