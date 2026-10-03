---
type: regex
target: { source: file, path: screen.html }
pattern: '(?:[}{]|<style[^>]*>)(?![^{}]*(?:logo|wordmark))[^{}]*\{[^{}]*letter-spacing\s*:\s*(?:0?\.[2-9]\d*em|[1-9]\d*(?:\.\d+)?em|(?:[2-9]|\d{2,})(?:\.\d+)?px)'
match: not_contains
---

The site tracks its type at 0.12em to 0.3em. A tool does not carry that into its text: no
letter-spacing of 0.2em or more, or of 2px or more, in any rule of screen.html except the logo's
wordmark, which is the client's identity.
