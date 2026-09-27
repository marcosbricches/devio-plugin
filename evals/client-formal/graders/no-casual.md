---
type: regex
pattern: '!|(?<!\p{L})(vc|blz|pra|tá|tbm|opa|e aí|a gente)(?!\p{L})'
flags: iu
match: not_contains
---

No casual marker: an exclamation mark, an abbreviation, slang, or "a gente". JavaScript's `\b` treats
accented letters as non-word, so "tá" and "e aí" need the Unicode lookarounds.
