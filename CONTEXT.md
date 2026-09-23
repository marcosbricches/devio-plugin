# devio

A Claude Code plugin that tells every session and subagent how one designer works: research first,
the community's standard, and the installed specialists called for their jobs.

## Language

**Designer**:
The one person devio is written for, whose preferences and decisions the hook text carries.
_Avoid_: User, client, team

**Specialist**:
An installed skill, plugin or MCP server that owns a kind of task, such as Impeccable for interfaces.
_Avoid_: Tool, helper, expert

**Routing table**:
The part of the hook text that pairs a kind of task with its specialist.
_Avoid_: Map, registry

**Chain**:
An example sequence of specialists for a task that needs several in a row.
_Avoid_: Pipeline, workflow

**Execution plan**:
The document written beside published tickets that groups them into waves that can run in parallel
and marks the critical path.
_Avoid_: Roadmap, schedule, timeline

**Field trial**:
A real project, started from zero, run with devio active to see how the hook text holds up.
_Avoid_: Test, pilot, optimization

**Trial report**:
The factual record a field trial's session writes for the session that maintains devio.
_Avoid_: Handoff, log
