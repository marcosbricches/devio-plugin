# 01: Free room in the hook text and guard its size

**What to build:** The eval preparation stops with a clear error when the hook text is over
Claude Code's 10,000-character cap for hook context (code.claude.com/docs/en/hooks, read 2026-09-23),
so the text can never be cut down to a preview without anyone noticing. The hook text loses the five
designer preferences that the designer's global CLAUDE.md already carries (Portuguese and English,
the screen as the deliverable, grounded taste, reversible versus product decisions, source and date
on constraints) and the chain "A critique of an existing screen", which repeats the routing table.
"References are seen, not described" stays. See ADR 0001 and the spec in `.scratch/devio-0-2/spec.md`.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Running the eval preparation with the hook text over 10,000 characters fails and names the size; under the cap it runs as before
- [x] The five preferences and the critique chain are gone from the hook text; "References are seen, not described" is intact
- [x] The README no longer lists the removed preferences as something the hook adds
- [x] The five existing cases each pass one run as a smoke check (the full 3-run suite is ticket 06)
- [x] The hook text's new character count is reported in the ticket's comments

## Comments

2026-09-23, implementation: `node evals/prepare.mjs` exits 1 with "hooks/how-we-work.md is 11520
characters, over the 10000 Claude Code shows in full" when the text is padded past the cap, and runs
as before under it. The hook text is now 5,520 characters (6,232 before). Smoke check, one run per
case with the README's command and `--runs 1`: critique-landing, scroll-reveal, library-docs,
claude-code-question and no-specialist each scored 1.00.
