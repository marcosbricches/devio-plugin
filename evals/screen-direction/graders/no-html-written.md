---
type: regex
target: trace
pattern: '"name":"(?:Write|Edit)","input":\{(?:"\w+":(?:"(?:[^"\\]|\\.)*"|true|false|null|-?\d+),)*"file_path":"[^"\n]*\.html"'
match: not_contains
---

A product with no visual language gets no screen in its first turn: no Write or Edit of an `.html`
file. Matches a tool call's own input, so the skill's text, returned by the Skill tool, does not
count.
