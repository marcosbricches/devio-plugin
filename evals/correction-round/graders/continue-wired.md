---
type: regex
target: { source: file, path: booking.html }
pattern: 'addEventListener|\sonclick\s*='
---

The Continuar button has a handler in the file. The fixture has no script at all, so a run that
fixes nothing fails.
