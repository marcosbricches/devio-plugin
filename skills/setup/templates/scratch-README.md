# Efforts

One folder per **effort** — a body of work with its own map, roadmap, tickets, research and prototype.

```
.scratch/<effort>/
  map.md          what the effort is, and where it stands
  spec.md         the agreed shape of the work
  issues/         one file per ticket, each declaring what blocks it
  roadmap.md      the layered board derived from those blocking edges
  research/       one file per question answered by reading
  prototype/      the cumulative HTML prototype
  measure/        measurement output (git-ignored)
```

An effort's folder is removed when the effort closes. What survives it was promoted at the harvest: decisions into `docs/adr/`, composition into production code, method into the devio plugin.

`.scratch/measure/` is measurement output and belongs in `.gitignore`.
