# devio

A Claude Code plugin that tells every session and subagent how one designer works: research first,
the community's standard, and the installed specialists called for their jobs.

## Language

**Designer**:
The one person devio is written for, whose preferences and decisions devio carries.
_Avoid_: User, client, team

**Specialist**:
An installed skill, plugin or MCP server that owns a kind of task, such as Impeccable for interfaces.
_Avoid_: Tool, helper, expert

**Hook text**:
The document devio adds to every session and every subagent: only what every task needs, with
pointers to devio's skills for the rest.
_Avoid_: Prompt, system prompt, instructions

**Routing table**:
The part of the hook text that pairs a kind of task with its specialist.
_Avoid_: Map, registry

**Chain**:
A sequence of specialists for a task that needs several in a row, held in a devio skill.
_Avoid_: Pipeline, workflow

**Control**:
The eval arm that loads devio's specialists without devio. A case measures devio only when devio
scores above it.
_Avoid_: Baseline, which `claude plugin eval` uses for a run with no plugin at all

**Execution plan**:
The document written beside published tickets that groups them into waves that can run in parallel
and marks the critical path.
_Avoid_: Roadmap, schedule, timeline

**Field trial**:
A real project, started from zero, run with devio active to see how devio holds up.
_Avoid_: Test, pilot, optimization

**Trial report**:
The factual record a field trial's session writes for the session that maintains devio.
_Avoid_: Handoff, log
