---
name: environment
description: Check what the machine has before a task that needs WSL, Docker, a Linux VM, the sandbox, Node, or Claude Code plugins inside WSL. Use before telling anyone to install, run or enable one of them.
---

# Read the machine, then instruct

Claude Code tells a session its platform, shell and OS version, never WSL, Docker or sandbox state
(code.claude.com/docs/en/context-window, read 2026-10-01). A session that instructs from the
platform line alone guesses. Run the probe first:

```
node ${CLAUDE_SKILL_DIR}/probe.mjs [tool ...]
```

It prints one `item: state` line each: the OS, Node and Claude Code on the host; on Windows, the WSL
distros and, inside the default one, `bwrap socat claude node git` plus any tool passed as an
argument, and the plugins installed there; Docker's CLI and whether its daemon answers. `MISSING` is
a tool that is not there; `unknown` is a probe that could not run, so say it was not checked.

Then reply in this order:

1. **What is already there**, one line, from the probe's output.
2. **What is missing for this task**, and only that. A tool the probe found gets no install step.
3. **Install steps for each missing item**, below, and one next step: the first of them.

Installing, enabling WSL and restarting Windows change the machine: give the steps, never run them.

## Facts behind the steps

Each one is as read on the date shown; a newer read replaces it.

- **Sandbox.** Runs on macOS, Linux and WSL2; native Windows is not supported, and WSL1 is not. On
  Linux and WSL2 it needs `bubblewrap` and `socat`: `sudo apt-get install -y bubblewrap socat`
  (code.claude.com/docs/en/sandboxing, read 2026-10-01).
- **A run that grants Bash or PowerShell** is refused where there is no sandbox backend, so on native
  Windows it goes through WSL2 (code.claude.com/docs/en/plugin-evals, "Grant tools", read 2026-10-01).
- **WSL.** `wsl --install -d Ubuntu` in an administrator PowerShell, then restart if asked. Claude
  Code inside it comes from the Linux installer, run in the WSL terminal
  (code.claude.com/docs/en/setup, "Option 2: WSL", read 2026-10-01).
- **Plugins in WSL.** Its `~/.claude` is the Linux home, so the Windows install does not carry over:
  `claude plugin marketplace add` and `claude plugin install` again inside the distro. This is an
  inference from the settings and plugin docs, not a stated rule (read 2026-10-01).
- **Docker.** `docker --version` only proves the CLI is installed. With Docker Desktop's engine
  stopped, `docker info` fails: start Docker Desktop and probe again (measured 2026-10-01). Install
  steps for a missing Docker come from Docker's own docs through context7, not from memory.
- **Probe traps.** `wsl.exe` writes UTF-16LE. A non-login `sh` inside WSL lacks `~/.local/bin` and
  reports `claude` and `node` missing when they are there, so the probe asks through `bash -lc`.
