/*
 * node --test tests/skills.test.mjs — the part of devio:screen that must survive compaction. Claude
 * Code re-attaches an invoked skill after compaction but keeps only its first 5,000 tokens
 * (code.claude.com/docs/en/skills, "Claude stops following a skill", read 2026-10-03). A token is
 * about 4 characters, so the standing rule has to end well inside 20,000 characters, and it has to
 * come before the numbered steps that read as a sequence for the first build.
 */
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const SCREEN = readFileSync(new URL('../skills/screen/SKILL.md', import.meta.url), 'utf8');
const KEPT_AFTER_COMPACTION = 5_000 * 4;

test('the screen skill opens with the rule that every round ends in the check', () => {
  const rule = SCREEN.indexOf('This holds for the whole task');
  const firstStep = SCREEN.search(/^1\. \*\*/m);
  assert.ok(rule > 0, 'the standing rule is missing');
  assert.ok(rule < firstStep, 'the rule must come before the first numbered step');
  assert.ok(rule < KEPT_AFTER_COMPACTION, `the rule starts at character ${rule}`);
});

test('the standing rule names a correction, the phone width, the app shell and the real click', () => {
  const rule = SCREEN.slice(SCREEN.indexOf('This holds for the whole task'), SCREEN.search(/^1\. \*\*/m));
  for (const word of ['correction', 'phone', 'app shell', '`click`', 'first line']) assert.ok(rule.includes(word), word);
});

test('the standing rule lists controls from the snapshot, exercises them, and keeps scripts to reading', () => {
  const rule = SCREEN.slice(SCREEN.indexOf('This holds for the whole task'), SCREEN.search(/^1\. \*\*/m));
  for (const word of ['`take_snapshot`', '`uid`', '`hover`', 'tooltip', 'focused field', '`evaluate_script`', 'isTrusted', 'Playwright actionability', 'read 2026-10-03']) assert.ok(rule.includes(word), word);
  assert.match(rule, /first line names every control that does nothing/);
});

test('the screen skill description covers a correction, so the skill loads on one', () => {
  assert.match(SCREEN, /^description: .*\bcorrect\b/m);
});

// A skill's description is capped at 1,536 characters (code.claude.com/docs/en/skills, read 2026-10-04).
const DESCRIPTION_CAP = 1_536;
const REFERENCES = readFileSync(new URL('../skills/references/SKILL.md', import.meta.url), 'utf8');

test('the references skill keeps its standing rule inside what compaction keeps', () => {
  const rule = REFERENCES.indexOf('Only the designer\'s "this is it" closes a round');
  assert.ok(rule > 0, 'the standing rule is missing');
  assert.ok(rule < KEPT_AFTER_COMPACTION, `the rule starts at character ${rule}`);
});

test('the references skill description carries its trigger words within the cap', () => {
  const description = REFERENCES.match(/^description: (.*)$/m)?.[1] ?? '';
  assert.ok(description.length <= DESCRIPTION_CAP, `${description.length} characters`);
  for (const word of ['moodboard', 'references', 'round', 'board']) assert.match(description, new RegExp(`\\b${word}\\b`, 'i'), word);
});
