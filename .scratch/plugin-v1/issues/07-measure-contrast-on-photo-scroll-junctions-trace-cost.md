# 07 — `measure`: `contrast-on-photo`, `scroll-junctions`, `trace-cost`

**What to build:** the three measurements no market tool answers run from the measure config on the shared module: real per-pixel contrast under each line of text on a photo, screenshots of each scroll junction at 0/50/100 % of its course on two screens, and main-thread cost per category between custom trace marks. Each prints JSON and is covered by the shape test.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Selectors come from the config, not from any project's class names
- [ ] Line counting uses `Range.getClientRects`, never height ÷ line-height
- [ ] `trace-cost` accepts a trace file and the two mark names
- [ ] Shape test extended to the three scripts and green
- [ ] Comment density per research 05
