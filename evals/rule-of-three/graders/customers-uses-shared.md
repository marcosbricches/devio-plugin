---
type: regex
target: { source: file, path: src/screens/Customers.jsx }
pattern: '^(?![\s\S]*stat-card__delta)[\s\S]*from\s+[''"]\.'
---

Customers no longer holds its own copy of the stat card markup and imports it from a shared local
module.
