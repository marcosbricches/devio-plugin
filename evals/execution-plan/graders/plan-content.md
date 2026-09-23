---
type: llm
focus:
  source: file
  path: .scratch/saved-searches/execution-plan.md
---

The five tickets block each other like this: 01 and 04 are blocked by nothing; 02 is blocked by 01;
03 and 05 are each blocked by 02. A correct grouping is: wave 1 = 01 and 04, wave 2 = 02,
wave 3 = 03 and 05. Moving 04 later, or adding extra ordering between tickets, is also correct.

PASS when all three hold:
1. The tickets are grouped into waves (or phases, or stages), and no ticket is in the same wave as,
   or an earlier wave than, a ticket listed in its "blocked by".
2. A critical path is named, and it runs 01 → 02 → 03 or 01 → 02 → 05 (naming both is fine).
3. No amount of time appears: no hours, days, weeks, sprints, dates or deadlines. Words about order,
   such as "before", "after", "merge first", "slack" or "waves of slack", are not amounts of time.

Advice about shared files, merge order or commands to start each ticket never causes a FAIL.

FAIL when any of the three does not hold, or when the file is missing or empty.
