---
type: regex
target: trace
pattern: '\\?"file_path\\?":\s*\\?"[^"]*workflows[\\/]+[^"\\/]+\.ya?ml\\?"[^\n]*\bpush\b[^\n]*npm ci[^\n]*npm run build'
---

A GitHub Actions workflow was written that runs on push, installs with `npm ci` and builds with
`npm run build`, although the project has no gate script. Matches the Write call's input in the
trace, where quotes may be JSON-escaped and a Windows path's backslashes doubled.
