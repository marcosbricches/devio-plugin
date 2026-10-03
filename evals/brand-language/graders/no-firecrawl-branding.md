---
type: regex
target: trace
pattern: '\\?"(?:command|formats?)\\?":\s*(?:\\?"[^"\n]*firecrawl[^"\n]*branding|\[[^\]\n]*branding)'
match: not_contains
---

Firecrawl's `branding` format is not a source for the visual language. Matches a tool call's input
only, so the skill's own text, returned by the Skill tool, does not count.
