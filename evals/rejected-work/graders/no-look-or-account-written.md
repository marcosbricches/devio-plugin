---
type: regex
target: trace
pattern: '"name":"(?:Write|Edit)","input":\{(?:(?!"type":"(?:text|tool_use|tool_result)")[^\n])*?"(?:content|new_string)":"(?:[^"\\\n]|\\.)*?(?:skeuomorph|brush(?:ed)?[- ]metal|bevel|gloss|metallic|emboss|2012|2013|round[ -]?(?:2|two)\b|second round|rejected)'
flags: i
match: not_contains
---

No file the session writes or edits carries the rejected look's words (skeuomorphic, brushed metal,
bevelled, glossy, embossed, the 2012 and 2013 references) or an account of the round (round 2,
rejected). It reads only the text a call puts in (`content`, `new_string`): an Edit's `old_string` is
the fixture's own line, and it names `design/round-2/`. It matches a tool call's own input, so the comp
and the brief read with `Read`, and the skill's text, do not count.
