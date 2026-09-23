# 06: Release 0.2.0

**What to build:** devio 0.2.0 ships, measured. The whole suite (the five original cases and the
four new ones) runs on the final hook text, and the release follows the repository's CLAUDE.md.

**Blocked by:** 02, 03, 04, 05

**Status:** ready-for-agent

- [ ] All nine cases pass 3 of 3 runs with the README's eval command
- [ ] `claude plugin validate .` and `claude plugin validate .claude-plugin/plugin.json` pass with only the expected root CLAUDE.md warning
- [ ] `version` is 0.2.0 and the CHANGELOG has a 0.2.0 entry listing each change, the suite result with its date, and the fixed-frame rule as not measured
- [ ] The README matches the hook text and the dependencies
- [ ] The Bioage project's `fixed-layouts` memory is deleted and removed from that project's memory index
- [ ] A local commit and a local `v0.2.0` tag exist; pushing waits for the designer's go-ahead
