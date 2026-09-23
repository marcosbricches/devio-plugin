# Execution plan: devio 0.2.0

Waves of the tickets in `issues/`. A wave's tickets run in parallel; a wave starts when every
ticket it depends on is done. Start each ticket in a fresh session with
`/implement .scratch/devio-0-2/issues/<file>`.

```
Wave 1   01 hook size guard + cuts      02 eval: references      03 vercel + deploy eval
            │                              │                        │
Wave 2   04 stop after grill + plan            │                        │
            │                              │                        │
Wave 3   05 fixed frame + code-review      │                        │
            │                              │                        │
Wave 4   06 release 0.2.0  ◄───────────────┴────────────────────────┘
            │
Wave 5   07 acceptance field trial (the designer)
```

**Critical path:** 01 → 04 → 05 → 06 → 07. Tickets 02 and 03 can finish any time before 06.

| Wave | Tickets | In parallel | Watch for |
| --- | --- | --- | --- |
| 1 | 01, 02, 03 | Yes, one session each | 01 and 03 both edit the README (01 removes the preferences, 03 adds vercel). Run each in its own git worktree, or run 03 after 01 is merged. 03 changes the manifest that the eval preparation reads, so re-run the preparation after merging both |
| 2 | 04 | No | Edits the hook text after 01. If its eval fails with the chain line alone, it adds the `UserPromptExpansion` hook |
| 3 | 05 | No | Edits the hook text after 04 |
| 4 | 06 | No | The full suite: 10 cases × 3 runs, all real model calls on your plan. Commit and tag stay local until you say push |
| 5 | 07 | — | Yours: a new project from zero, ending with `/handoff` |
