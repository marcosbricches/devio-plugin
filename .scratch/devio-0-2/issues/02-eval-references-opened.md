# 02: Eval: references are opened as images

**What to build:** A new eval case that measures the 0.1.1 rule "references are seen, not
described". The case holds two small reference images as fixture files and asks for a hero section
composed from them. It passes only when the session opened both images with Read. No hook text
changes. Image fixtures are supported by `claude plugin eval` (code.claude.com/docs/en/plugin-evals,
read 2026-09-23).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The case follows the shape of the existing cases: a prompt with frontmatter and a graders folder, each grader with a line on why it matches what it matches
- [x] A `tool_used` grader requires a Read of each of the two image files
- [x] The images are original or openly licensed, and their source is noted in the case
- [x] The case passes 3 of 3 runs

## Comments

2026-09-23, implementation: case `evals/references-opened`. Its `scaffold.sh` copies `forno.png`
and `relay.png` into the run's workspace, so the suite now runs with `--scaffold` (README updated).
The images are original, rendered by the maintainer from HTML with headless Chrome; the source is
noted in `graders/forno-opened.md`. Result with the README's command: 3 of 3 runs passed, both
graders in each.
