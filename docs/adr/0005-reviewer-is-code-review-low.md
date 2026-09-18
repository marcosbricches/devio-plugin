# The default reviewer is Claude's `/code-review low`

The Codex plugin is installed, but its plan quota runs out and it fails silently mid-task. The gate reviewer is Anthropic's built-in `/code-review` at low effort, a fresh-context subagent as the docs prescribe, sized for a design team that values speed of iteration over exhaustive code review. Findings count only when they affect correctness or a stated requirement; the rest is optional. Codex `adversarial-review` remains an offer for direction decisions, with a quota warning.
