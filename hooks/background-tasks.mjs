// Stop hook: a shell task still running when the turn ends is read or stopped now, not left behind.
// Why a hook and not text in how-we-work.md: on 2026-10-01 a command passed its timeout, the harness
// moved it to the background, and it ran orphaned for 2 hours because nothing made the session look
// again. Stop input carries `background_tasks` for exactly this (code.claude.com/docs/en/hooks,
// "Stop input", read 2026-10-01). A dev server started on purpose is also a running shell task, so
// each task is raised once, and again only after it has run RECHECK_MS more: a hung command is not
// forgotten, a server is not nagged about every turn. State lives in the OS temp dir, per session.
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const RECHECK_MS = 10 * 60 * 1000;

const { session_id: sessionId, background_tasks: tasks = [] } = JSON.parse(readFileSync(0, 'utf8'));
const stateFile = join(tmpdir(), `devio-background-${String(sessionId).replace(/[^\w-]/g, '_')}.json`);
let raised = {};
try {
  raised = JSON.parse(readFileSync(stateFile, 'utf8'));
} catch {}

const now = Date.now();
const due = tasks.filter((task) => task.type === 'shell' && task.status === 'running' && now - (raised[task.id] ?? 0) >= RECHECK_MS);
if (due.length) {
  for (const task of due) raised[task.id] = now;
  writeFileSync(stateFile, JSON.stringify(raised));
  const list = due.map((task) => `- ${task.id}: ${(task.command ?? task.description).slice(0, 160)}`).join('\n');
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason:
        `A shell task of this session is still running:\n${list}\n` +
        'Read its output now. If it hung, or nobody needs it any more, stop it with TaskStop. ' +
        'If it stays on purpose (a dev server for this session), say so in the reply with the reason. ' +
        'A command that passed its timeout is never left running.',
    }),
  );
}
