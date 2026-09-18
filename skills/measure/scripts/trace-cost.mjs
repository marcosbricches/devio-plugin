/*
 * node trace-cost.mjs <measure.config.mjs> <trace.json> <startMark> <endMark>
 *   — main-thread cost by category between two custom performance marks.
 *
 * The trace is recorded elsewhere: Chrome DevTools MCP
 * (`performance_start_trace` / `performance_stop_trace`) or a DevTools
 * Performance panel export. This script only reads it, so the numbers come from
 * the same engine DevTools shows and can be argued with.
 *
 * Marks, not a time window: "the scroll cost 180 ms of scripting" is only worth
 * saying if the boundaries are the ones the page itself declared with
 * `performance.mark()`. Mark the span you are actually judging.
 *
 * Cost is self time — an event's duration minus its direct children's — so a
 * nested stack is counted once. Durations are microseconds in the trace and
 * milliseconds in the output.
 */
import { readFile } from 'node:fs/promises';
import { loadConfig, report, run } from './lib/measure.mjs';

const CATEGORIES = [
  ['scripting', /^(FunctionCall|EvaluateScript|v8\.|V8\.|TimerFire|RunMicrotasks|XHRReadyStateChange|EventDispatch|RequestAnimationFrame|FireAnimationFrame|MajorGC|MinorGC|GCEvent)/],
  ['rendering', /^(Layout|UpdateLayoutTree|RecalculateStyles|ScheduleStyleRecalculation|InvalidateLayout|HitTest|ParseAuthorStyleSheet)/],
  ['painting', /^(Paint|PaintImage|CompositeLayers|Commit|UpdateLayer|RasterTask|Decode Image|DecodeImage|ImageDecodeTask|Draw)/],
  ['loading', /^(ParseHTML|ResourceSendRequest|ResourceReceiveResponse|ResourceReceivedData|ResourceFinish|XHRLoad)/],
];

const categoryOf = (name) => CATEGORIES.find(([, pattern]) => pattern.test(name))?.[0] ?? 'other';

run(async () => {
  const [, , configPath, tracePath, startMark, endMark] = process.argv;
  if (!tracePath || !startMark || !endMark) {
    throw new Error('usage: trace-cost.mjs <measure.config.mjs> <trace.json> <startMark> <endMark>');
  }
  const config = await loadConfig(configPath);
  const raw = JSON.parse(await readFile(tracePath, 'utf8'));
  const events = Array.isArray(raw) ? raw : raw.traceEvents;
  if (!Array.isArray(events)) throw new Error(`${tracePath}: no traceEvents array`);

  const markTime = (name) => {
    const mark = events.find((event) => event.name === name && event.ph !== 'M');
    if (!mark) throw new Error(`mark "${name}" is not in ${tracePath}`);
    return mark.ts;
  };
  const from = markTime(startMark);
  const to = markTime(endMark);
  if (!(to > from)) throw new Error(`"${endMark}" is not after "${startMark}"`);

  const mainThread = rendererMainThread(events);
  const spans = events
    .filter(
      (event) =>
        event.ph === 'X' &&
        typeof event.dur === 'number' &&
        event.ts >= from &&
        event.ts + event.dur <= to &&
        (!mainThread || (event.pid === mainThread.pid && event.tid === mainThread.tid)),
    )
    .sort((a, b) => a.ts - b.ts || b.dur - a.dur);

  const totals = new Map();
  const stack = [];
  for (const span of spans) {
    while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= span.ts) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent) parent.childDur = (parent.childDur ?? 0) + span.dur;
    stack.push(span);
  }
  for (const span of spans) {
    const self = (span.dur - (span.childDur ?? 0)) / 1000;
    const category = categoryOf(span.name);
    const entry = totals.get(category) ?? { category, selfMs: 0, events: 0 };
    entry.selfMs += self;
    entry.events += 1;
    totals.set(category, entry);
  }

  const results = [...totals.values()]
    .map((entry) => ({ ...entry, selfMs: Number(entry.selfMs.toFixed(2)) }))
    .sort((a, b) => b.selfMs - a.selfMs);

  report('trace-cost', config, results, {
    trace: tracePath,
    startMark,
    endMark,
    spanMs: Number(((to - from) / 1000).toFixed(2)),
    thread: mainThread ? `${mainThread.pid}/${mainThread.tid}` : 'all',
    totalSelfMs: Number(results.reduce((sum, entry) => sum + entry.selfMs, 0).toFixed(2)),
  });
});

/* Metadata events name every thread; CrRendererMain is the one whose work the
 * visitor feels. Falls back to every thread when the trace carries no metadata,
 * which is what a hand-trimmed trace usually looks like. */
function rendererMainThread(events) {
  const named = events.find(
    (event) => event.ph === 'M' && event.name === 'thread_name' && event.args?.name === 'CrRendererMain',
  );
  return named ? { pid: named.pid, tid: named.tid } : null;
}
