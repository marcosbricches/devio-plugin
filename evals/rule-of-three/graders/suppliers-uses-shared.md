---
type: regex
target: { source: file, path: src/screens/Suppliers.jsx }
pattern: '^(?![\s\S]*stat-card__delta)[\s\S]*from\s+[''"]\.[\s\S]*Late deliveries'
flags: i
---

The new screen exists, shows the requested cards and takes the stat card from the shared module
instead of writing a third copy.
