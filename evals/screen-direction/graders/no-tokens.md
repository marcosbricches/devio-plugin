---
type: regex
pattern: '#[0-9a-fA-F]{3,8}\b|\b(?:oklch|rgb|hsl)a?\(|\b\d+(?:\.\d+)?\s?(?:px|rem)\b'
match: not_contains
---

The final reply lists no design tokens: no hex colour, no `oklch(`, `rgb(` or `hsl(` value, no size in
px or rem. A product with no visual language gets its tokens from the manual, never ahead of it.
