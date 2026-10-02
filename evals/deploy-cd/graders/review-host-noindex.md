---
type: regex
target: trace
pattern: '\\?"file_path\\?":[^\n]*(noindex[^\n]*devio\.codes|devio\.codes[^\n]*noindex)'
---

A file was written or edited that answers `noindex` on a `devio.codes` review host. Matches a
Write or Edit call's input in the trace, anchored on `file_path` so the skill's own text, returned
by the Skill tool, does not count.
