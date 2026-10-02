---
type: regex
target: trace
pattern: '\\?"file_path\\?":\s*\\?"[^"]*workflows[\\/]+[^"\\/]+\.ya?ml\\?"[^\n]*run: npm (run )?test'
match: not_contains
---

The workflow does not run `npm test`: the project's `test` script is the placeholder `npm init`
writes, which exits 1, so CI would fail on every push. Anchored on a `run:` step, so a comment
in the workflow explaining why the step is left out does not count.
