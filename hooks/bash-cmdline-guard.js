#!/usr/bin/env node
/*
 * bash-cmdline-guard — PreToolUse hook, matcher Bash.
 *
 * Blocks a Bash call whose command line would exceed what Git Bash accepts, so
 * the failure is an error message instead of a silently truncated command.
 *
 * Ceilings measured on Windows + Git Bash (2026-09-02), highest to lowest:
 *
 *   Windows CreateProcess ....... 32767  -> fails loudly (ENAMETOOLONG)
 *   cmd.exe ...................... 8191  -> "command line too long"
 *   Git Bash `bash.exe -c` ....... ~8186 -> TRUNCATES SILENTLY
 *
 * The binding ceiling is bash's, not Windows'. The same MSYS2 `echo.exe` takes
 * 32000 characters without complaint, and so does `node.exe`; only the
 * `bash -c` path cuts. Bash reading a script from a file took 200 KB, stdin 100 KB.
 *
 * The Bash tool assembles the command as:
 *
 *   source <snapshot> && export TEMP=... && eval '<COMMAND>' < /dev/null && pwd -P >| <cwd>
 *
 * So there is a ~341-byte prelude, and the command travels inside single quotes,
 * where every apostrophe of the payload becomes '"'"' — 7 bytes in place of 1.
 *
 * Past the ceiling the command is cut with no warning. Inside a heredoc that
 * loses the closing delimiter and bash answers "unexpected EOF while looking for
 * matching `'" — or writes half a file and reports success.
 *
 * Exit 2 with the reason on stderr is what Claude Code reads as a block.
 */
const LIMIT = 8186; // measured ceiling of Git Bash `bash -c`
const PRELUDE = 500; // ~341 measured plus margin (snapshot/temp/aliases vary)
const ESCAPE_COST = 6; // ' becomes '"'"' : 6 extra bytes per apostrophe

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  if (payload.tool_name !== 'Bash') process.exit(0);

  const cmd = (payload.tool_input && payload.tool_input.command) || '';
  const bytes = Buffer.byteLength(cmd, 'utf8');
  const apostrophes = (cmd.match(/'/g) || []).length;
  const cost = bytes + apostrophes * ESCAPE_COST + PRELUDE;
  if (cost <= LIMIT) process.exit(0);

  const budget = LIMIT - PRELUDE - apostrophes * ESCAPE_COST;
  const hasHeredoc = /<<-?\s*['"]?\w+/.test(cmd);

  const message = [
    `BLOCKED: this command exceeds the Git Bash \`bash -c\` ceiling (${LIMIT} characters).`,
    '',
    `  command size ............. ${bytes} bytes`,
    `  apostrophes .............. ${apostrophes} (${apostrophes * ESCAPE_COST} extra bytes: each ' becomes '"'"')`,
    `  Bash tool prelude ........ ${PRELUDE} bytes`,
    `  real cost ................ ${cost} / ${LIMIT}`,
    `  left for the payload ..... ${budget > 0 ? budget : 0} bytes`,
    '',
    `If it ran, the command would be cut silently at byte ${LIMIT}.`,
    hasHeredoc
      ? 'There is a heredoc here, so the closing delimiter would be lost and bash would answer "unexpected EOF while looking for matching" — or write half the file and report success.'
      : 'The tail of the command would be discarded without warning.',
    '',
    'Do this instead:',
    '  1. To create or overwrite a file, use the Write tool. It does not travel through the command line and has no such ceiling. It is the right path for any content above ~5 KB.',
    '  2. To change part of an existing file, use the Edit tool.',
    '  3. If you truly need the shell, split into several commands under 7000 bytes each (cat >> file, one piece at a time).',
    '',
    'Do not retry the same command: it will be blocked the same way.',
  ].join('\n');

  process.stderr.write(message + '\n');
  process.exit(2);
});
