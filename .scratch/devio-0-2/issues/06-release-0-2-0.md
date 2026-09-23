# 06: Release 0.2.0

**What to build:** devio 0.2.0 ships, measured. The whole suite (the five original cases and the
five new ones) runs on the final hook text, and the release follows the repository's CLAUDE.md.

**Blocked by:** 02, 03, 04, 05

**Status:** ready-for-agent

- [x] All ten cases pass 3 of 3 runs with the README's eval command
- [x] `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json` pass with only the expected root CLAUDE.md warning
- [x] `version` is 0.2.0 and the CHANGELOG has a 0.2.0 entry listing each change, the suite result with its date, and the fixed-frame rule as not measured
- [x] The README matches the hook text and the dependencies
- [x] The Bioage project's `fixed-layouts` memory is deleted and removed from that project's memory index
- [x] A local commit and a local `v0.2.0` tag exist; pushing waits for the designer's go-ahead

## Comments

2026-09-23, implementation: the full suite, 10 cases on 3 runs with the README's command, passed
30 of 30 ($9.18, 559 s). `claude plugin validate` passes on both manifests with only the root
CLAUDE.md warning. Version 0.2.0, CHANGELOG entry with the fixed frame stated as not measured,
README updated. The Bioage `fixed-layouts` memory and its index line are deleted. Commit and
`v0.2.0` tag are local; pushing waits for the designer.
