---
type: regex
pattern: '```[^\n]*\n(?:(?!```)[\s\S])*?\b(?:must|never|do not|don''t|avoid)\b(?:(?!```)[\s\S])*?```'
flags: i
match: not_contains
---

No fenced block of the final reply, the prompt to paste, holds a prohibition or a hard rule ("must",
"never", "do not", "don't", "avoid"). The closing fence is part of the pattern so that text after the
block is not read as inside it; the reply around the block may use those words. It assumes the one
block `prompt-in-one-block` asks for.
