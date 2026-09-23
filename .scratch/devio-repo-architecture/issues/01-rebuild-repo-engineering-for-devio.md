# 01: Rebuild this repository's engineering for devio

**What to build:** This repository's engineering setup is inherited: the mattpocock-skills
configuration in `docs/agents/` came from the setup skill's defaults, and it predates what devio has
become. Its architecture is to be redone with the principles of the skills devio itself runs, and
adapted to a plugin whose product is hook text, dependencies and an eval suite, not application
code. Requested by the designer on 2026-09-23, for after 0.2.0.

**Blocked by:** devio 0.2.0 released (`.scratch/devio-0-2/issues/06-release-0-2-0.md`)

**Status:** needs-triage

- [ ] Which skills' principles apply is settled with the designer. Reading at request time: mattpocock-skills' `improve-codebase-architecture`, `codebase-design` and `setup-matt-pocock-skills`
- [ ] What "adapted to devio" changes is settled in a grill before any spec
