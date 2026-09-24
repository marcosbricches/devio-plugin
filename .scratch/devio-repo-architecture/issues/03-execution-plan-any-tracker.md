# 03: The execution plan goes where the tracker keeps the tickets

**What to build:** A session in a project whose tracker is GitHub or GitLab Issues, after
`/to-tickets` publishes, puts the execution plan as a comment on the spec's issue instead of looking
for a folder that does not exist; a project with the local markdown tracker keeps getting a file in
the feature's folder.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The chain after a grill in the hook text says the plan goes where the tracker keeps the tickets: a file in the feature's folder for local markdown, a comment on the spec's issue for GitHub or GitLab
- [ ] The hook text stays under 10,000 characters
- [ ] A new eval case, its fixture copied from the `execution-plan` case with an issue-tracker doc that names GitHub, grades that the plan is addressed to the spec's issue and not written as a file under `.scratch/`
- [ ] The new case and the existing `execution-plan` case each pass on 3 runs with the no-plugin baseline, with Δ above zero
