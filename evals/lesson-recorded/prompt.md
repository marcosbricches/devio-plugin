---
description: A mistake leaves a lesson in the repository where the next person will find it.
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill, Agent, Write]
---

Production went down for 20 minutes today: the deploy ran `npm run migrate` on the new server before `DATABASE_URL` was set, so the migration ran against the default local database and the app came up on an empty one. I set the variable by hand, re-ran the migration and it's back up. That's it for today.
