# Roadmap — plugin v1

Source of each row is the ticket's `Blocked by`. Resolving a ticket updates its `Status` and this board in the same pass.

Updated: 2026-09-18

Legend: ✅ resolved · 🟢 unblocked · ⏳ waiting

## Layer 0 — start now

| | Ticket |
| --- | --- |
| ✅ | 01 Plugin skeleton, hooks and researcher agent |
| ✅ | 02 Global CLAUDE.md |

## Layer 1 — after 01

| | Ticket | Blocked by |
| --- | --- | --- |
| ✅ | 03 `art-direction` knowledge skill | 01 |
| ✅ | 04 `cumulative-prototype` knowledge skill and scaffold | 01 |
| ✅ | 05 `gates` knowledge skill | 01 |
| ✅ | 06 `measure`: shared module, `capture`, fixture and shape test | 01 |
| 🟢 | 09 `client-report` skill | 01 |

## Layer 2

| | Ticket | Blocked by |
| --- | --- | --- |
| 🟢 | 07 `measure`: `contrast-on-photo`, `scroll-junctions`, `trace-cost` | 06 |
| 🟢 | 08 `measure`: `line-breaks`, `focus-path` and the skill body | 06 |
| ⏳ | 10 `/devio:setup` command | 03, 04, 05, 06 |
| ⏳ | 12 Memory audit | 02, 03, 04, 05 |

## Layer 3

| | Ticket | Blocked by |
| --- | --- | --- |
| ⏳ | 11 `/devio:next` command | 05, 10 |

## Layer 4 — closes the effort

| | Ticket | Blocked by |
| --- | --- | --- |
| ⏳ | 13 viva-maracana migration and release 0.1.0 | 07, 08, 09, 10, 12 |

## Critical path

`01 → 06 → 07/08 → 13`. Per ticket: `/mattpocock-skills:implement .scratch/plugin-v1/issues/<NN>-*.md`, one per session, `/clear` between.
