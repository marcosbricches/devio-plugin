# 01 — Plugin skeleton, hooks and researcher agent

**What to build:** the plugin loads in every session with a valid manifest, a README that states its purpose and its dependency on mattpocock-skills, a changelog, the bash command-line guard running from the plugin instead of user settings, and a `researcher` sub-agent on Sonnet that any skill can delegate reading to. The repository has a private GitHub remote.

**Blocked by:** None — can start immediately

**Status:** resolved

- [x] `claude plugin validate` passes on the plugin root
- [x] `hooks/hooks.json` registers the bash guard via `${CLAUDE_PLUGIN_ROOT}`; the entry is removed from `~/.claude/settings.json`; a Bash call over the limit is still blocked
- [x] `agents/researcher.md` has `model: sonnet`, read/fetch/write tools only, and a description that names when to delegate
- [x] `README.md` states scope (ADR-0001), language (ADR-0002) and the mattpocock-skills dependency; `CHANGELOG.md` starts at Unreleased
- [x] A private remote exists (github.com/marcosbricches/devio-plugin) and `main` is pushed
