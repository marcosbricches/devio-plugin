---
type: regex
target: trace
pattern: '"name":"Write","input":\{(?:"[a-z_]+":(?:true|false),)*"file_path":"[^"]*(?:trial|report|lesson|retro|post-?mortem|learn)[^"]*"'
flags: i
match: not_contains
---

A lesson about how the work was done is the reply's ending, never a file: no Write to a path named for
a trial, a report, a lesson, a retrospective or a post-mortem.
