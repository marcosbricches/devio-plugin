---
type: regex
target: { source: file, path: src/screens/Orders.jsx }
pattern: '^(?![\s\S]*stat-card__delta)[\s\S]*from\s+[''"]\.'
---

Orders no longer holds its own copy of the stat card markup and imports it from a shared local module.
The fixture's screens have no relative import, so one is the shared piece.
