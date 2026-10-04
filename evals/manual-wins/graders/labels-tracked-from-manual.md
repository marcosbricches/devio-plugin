---
type: regex
target: { source: file, path: screen.html }
pattern: '(?:letter-spacing|--[\w-]*(?:track|spacing)[\w-]*)\s*:\s*(?:0?\.(?:1\d*|[2-9]\d*)|[1-9]\d*(?:\.\d+)?)em'
---

The screen carries a `letter-spacing` of 0.1em or more: the manual's product page tracks its labels at
0.14em in capitals, and the manual wins over the translation rule written for sites (sentence case, no
wide tracking). A screen with no tracking, or none at all, fails.
