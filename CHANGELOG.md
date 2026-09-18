# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Plugin skeleton: manifest, `README.md`, this changelog.
- `bash-cmdline-guard` hook, moved from `~/.claude/settings.json` into `hooks/hooks.json` so the guardrail travels with the plugin.
- `researcher` sub-agent on Sonnet, for reading and fetching delegated out of the main context.
