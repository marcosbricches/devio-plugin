---
type: regex
target: { source: file, path: booking.html }
pattern: 'type\s*[=:]\s*["'']?date(?:time-local)?\b'
flags: i
match: not_contains
---

The reference shows a designed calendar, and the screen follows the reference, not the browser's
native `<input type="date">`.
