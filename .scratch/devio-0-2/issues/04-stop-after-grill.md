# 04: The session stops after a grill, and tickets come with an execution plan

**What to build:** When a grill ends (`grill-with-docs`, `grill-me`, or `grilling` called directly),
the session asks the designer to run `/to-spec`, then `/to-tickets`, then `/implement`, and writes
neither a spec nor tickets itself. Those three skills cannot be called by the model
(`disable-model-invocation: true` in mattpocock-skills 1.2.3). When `/to-tickets` has published the
tickets, the session writes an execution plan beside them in the feature's folder: the waves of
tickets that can run in parallel, the critical path, what to watch for between parallel tickets, the
command that starts each ticket, and no durations. Both rules are one line in the hook's Chains.

Two new eval cases. One stands for the end of a grill with every question answered and asks what
comes next; it must not tell the session to build. The other holds a spec and a few published
tickets with blocking edges and stands for the end of `/to-tickets`. If a case fails with the line
alone, a hook on `UserPromptExpansion` matching the grill commands and `to-tickets` appends the line
(code.claude.com/docs/en/hooks, read 2026-09-23), and the case must pass with it.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The Chains carry the line and the hook text stays under the size guard
- [ ] Grill case: an `llm` grader requires that the answer asks the designer to run `/to-spec`, and a negated `file_exists` grader requires that no spec file was written
- [ ] Tickets case: a `file_exists` grader requires the execution plan in the feature's folder, and an `llm` grader requires waves that respect the blocking edges, a critical path, and no durations
- [ ] Both cases pass 3 of 3 runs, with the line alone or, failing that, with the `UserPromptExpansion` hook, and the ticket's comments say which
