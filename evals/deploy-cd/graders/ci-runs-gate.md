---
type: regex
target: trace
pattern: '\\?"file_path\\?":\s*\\?"[^"]*workflows[\\/]+[^"\\/]+\.ya?ml\\?"[^\n]*\bpush\b[^\n]*\bverificar\b'
---

A GitHub Actions workflow was written that runs on push and calls the scaffold's gate script,
`verificar`, rather than a generic `npm test`. Matches the Write call's input in the trace, where
quotes may be JSON-escaped and a Windows path's backslashes doubled.
