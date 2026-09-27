---
type: llm
---

Look only at the next step the reply ends on, usually a line starting "Next step". Ignore any list of
things to do earlier in the reply, and any caveats after it.

PASS when that next step is one action. One action with its details (when, where, which command, as
in "set up a nightly backup copied off the VPS") is one action.

FAIL when there is no next step, or it joins two or more actions, as in "turn on WAL and set up
backups" or "set up a backup and test a restore".
