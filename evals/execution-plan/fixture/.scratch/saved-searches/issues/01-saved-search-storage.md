# 01: Store saved searches

**What to build:** A `saved_searches` table (user, name, query, filters, sort) with the 20-per-user limit enforced in the database.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Migration creates the table and the per-user limit
- [ ] Saving a 21st search fails with a clear error
