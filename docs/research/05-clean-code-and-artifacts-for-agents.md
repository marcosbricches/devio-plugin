# Clean code and artifacts for agents — comment density, verbosity, conciseness

Date: 2026-09-18

## Question

What do primary sources prescribe about (1) comment density and verbosity in code written by or
for AI agents, and (2) conciseness in agent-facing artifacts (SKILL.md, CLAUDE.md, ADRs, scripts)?
Framed by a user complaint: the agent writes verbose code full of comments and narrative; the user
wants "clean", minimal, well-structured output and asked what the community considers correct.

---

## 1. Anthropic — Claude Code docs (agent-facing conciseness)

**Documented fact.** `code.claude.com/docs/en/best-practices` (fetched 2026-09-18), section "Write
an effective CLAUDE.md":

> "Keep it concise. For each line, ask: 'Would removing this cause Claude to make mistakes?' If
> not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"

It gives an explicit include/exclude table. Excluded, verbatim: "Anything Claude can figure out by
reading code," "Standard language conventions Claude already knows," "Long explanations or
tutorials," "Self-evident practices like 'write clean code'." Included: gotchas, non-obvious
behaviors, project-specific style that *differs* from defaults.

It also states the failure mode directly: "If Claude keeps doing something you don't want despite
having a rule against it, the file is probably too long and the rule is getting lost," and later,
under common failure patterns: "**The over-specified CLAUDE.md.** If your CLAUDE.md is too long,
Claude ignores half of it because important rules get lost in the noise. **Fix**: Ruthlessly
prune."

**Documented fact.** `code.claude.com/docs/en/skills` (fetched 2026-09-18):

> "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files."
> "State what to do rather than narrating how or why, and apply the same conciseness test you
> would for CLAUDE.md content."
> "Once a skill loads, its content stays in context across turns, so every line is a recurring
> token cost."

This is the exact phrase the user's brief anticipated ("state what to do rather than narrating how
or why") — it is Anthropic's own wording, applied to skill bodies, not to source code comments
specifically. No Anthropic doc found extends this sentence explicitly to code comments; the
extension is an analogy the user (or a future document) would be making, not a documented Anthropic
rule for code.

**Documented fact.** `anthropics/skills`, `skills/skill-creator/SKILL.md` (fetched via
`raw.githubusercontent.com`, main branch, 2026-09-18) — the canonical skill-authoring skill:

- "Keep SKILL.md under 500 lines; if you're approaching this limit, add an additional layer of
  hierarchy along with clear pointers about where the model using the skill should go next."
- Progressive disclosure is explicit and three-tiered: "Metadata (name + description) - Always in
  context (~100 words)"; "SKILL.md body - In context whenever skill triggers (<500 lines ideal)";
  "Bundled resources - As needed (unlimited, scripts can execute without loading)."
- On descriptions: "include both what the skill does AND specific contexts for when to use it. All
  'when to use' info goes here, not in the body" — i.e., push branching/trigger prose out of the
  body into the one pointer that is always loaded.
- On writing style generally (not code-specific): "Try to explain to the model why things are
  important in lieu of heavy-handed musty MUSTs." This licenses *some* prose — but it is prose in
  the skill body aimed at explaining intent, not a license for narrated code comments.
- No explicit rule about comment density inside `scripts/` is given anywhere in this document —
  confirmed by direct reading of the file; the closest applicable principle is the general
  conciseness test above.

**Interpretation.** Anthropic's own conciseness rule is stated for *documents the agent reads every
turn* (CLAUDE.md, skill body, skill description), justified by a cost model: those tokens are paid
repeatedly. It is not phrased as a rule about *code the agent writes*, and the docs never say
"comments are bad." The user's intuition that comments should be sparse is closer to Anthropic's
practice observed in `anthropics/skills` scripts (below) than to anything stated as policy for code.

---

## 2. Matt Pocock `writing-for-agents` skill (local, primary, plugin cache)

File read directly: `C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\skills\productivity\writing-for-agents\SKILL.md` and `SKILL-MECHANICS.md`.

**Documented fact — key mechanisms relevant to conciseness:**

- **Context load vs. cognitive load**: "Context load — the cost of always-loaded material on the
  agent's window... spending tokens and attention whether or not it fires." vs. "Cognitive load —
  the cost on the human: which documents exist and when to reach for each... Spend it where human
  judgement matters, remove it where it does not."
- **Progressive disclosure** is defined as "the move down the ladder — out of the main file and
  behind a pointer — so the top stays legible. Not primarily a token optimisation: it is how the
  hierarchy is protected."
- **Sprawl**: "a document simply too long, even when every line is live and unique. Attention thins
  across the excess, and every extra line is one more to keep relevant."
- **No-ops** (the most directly applicable test to the user's complaint): "Hunt no-ops sentence by
  sentence: an instruction the model already obeys by default pays load to say nothing. The test —
  does it change behaviour versus the default? — is model-relative, not reader-relative... When a
  sentence fails, delete the whole sentence rather than trim words from it."
- **Sediment**: "stale layers that settle because adding feels safe and removing feels risky, until
  you must core down through them to find what is still live." This is a pruning-discipline
  concept, distinct from no-ops (no-ops are redundant on arrival; sediment goes stale over time).
- **Cache vs. source of truth**: "The environment is a source of truth too... a document that
  restates it is a cache... Cache what the agent cannot find by looking: the unwritten convention,
  the reason behind a choice, the gotcha no config confesses."
- **Negation**: prohibitions ("don't do X") are a weak lever because they make the forbidden
  behavior *more* available in the model's attention; positive instructions ("write one-line
  comments") are preferred.

**Interpretation.** This skill is written for *documents* (SKILL.md, AGENTS.md, CLAUDE.md), not for
source code — but its two sharpest tests (no-op, cache-vs-source-of-truth) transfer directly to code
comments: a comment that the reader could derive by reading the two lines below it is a no-op; a
comment that states what `git blame`/the commit message already carries is a duplicate source of
truth. A comment survives this test only if it records something the code and the environment
cannot say on their own — which is precisely Ousterhout's and Henney's rule for comments (§4-5
below), arrived at independently from a different frame (agent context economy vs. human
readability).

---

## 3. Google style guides — comments

**Documented fact.** Google JavaScript Style Guide (`google.github.io/styleguide/jsguide.html`,
fetched 2026-09-18), §4.8 "Comments": block-comment formatting rules only (indentation, `/* */` vs
`//`, no ASCII-art boxes, no JSDoc syntax for implementation comments). The guide does **not**
contain an explicit "why not what" sentence in this section — this is worth flagging because it is
often misattributed. The nearest normative content is formatting, not content-selection, guidance.

**Documented fact.** Google Python Style Guide (`google.github.io/styleguide/pyguide.html`), §3.8
"Comments and Docstrings", §3.8.5 "Block and Inline Comments" (fetched 2026-09-18):

> "The final place to have comments is in tricky parts of the code. If you're going to have to
> explain it at the next code review, you should comment it now."
> "[N]ever describe the code. Assume the person reading the code knows Python (though not what
> you're trying to do) better than you do." (marked as illustrating a "BAD COMMENT" pattern in the
> guide when violated)

§3.8.12 on `TODO`: must begin with `TODO`, a colon, and a link to a tracked resource ("ideally a bug
reference"), not a bare name.

**Interpretation.** Google's Python guide is the closest primary source to an explicit "why not
what" rule, phrased as: comment only what a knowledgeable reader could not already infer from the
code, and only where a future reviewer would otherwise ask for the explanation. This matches
Ousterhout and Henney below, and is a genuine documented convergence across three independent
style traditions (Google, Ousterhout, Henney), not a single source repeated.

---

## 4. Robert C. Martin, *Clean Code*, ch. 4 "Comments" — and its critique

**Documented fact — the book's own words** (quoted via searches of secondary excerpts that quote
the book verbatim; the book itself is not open-access, so this is cited as a widely-reproduced
direct quotation, not paraphrase):

> "The proper use of comments is to compensate for our failure to express ourself in code. Note
> that I used the word failure. I meant it. Comments are always failures. We must have them because
> we cannot always figure out how to express ourselves without them, but their use is not a cause
> for celebration."

Martin's chapter treats comments as a *last resort*: prefer renaming, extracting functions, and
restructuring code over adding a comment; a comment is evidence the code itself did not succeed.

**Documented fact — the community critique.** qntm, "It's probably time to stop recommending Clean
Code" (qntm.org/clean, dated 2020-06-28, fetched 2026-09-18 in full text). The essay's target is
chapter 3 ("Functions") more than chapter 4, but the critique bears directly on the same
"extract-everything, name-everything, comment-nothing" doctrine the user is pushing back against in
reverse: qntm shows that Martin's own worked refactoring of `SetupTeardownIncluder` (from FitNesse)
produces fifteen tiny private methods communicating almost entirely through hidden side effects on
shared member variables, with method names that "give us no useful information at all, while
raising a tonne of frustrating questions" — and that the same chapter's advice ("extract a function
only if its name is not merely a restatement of its implementation") is violated by methods like
`isTestPage()` that do exactly that. Direct quote: "Clean Code mixes together a disarming
combination of strong, timeless advice and advice which is highly questionable or dated or both."
The essay's conclusion is not "comment more" — it is that Martin's own example code, held up as the
ideal, is frequently illegible by his own stated standards, so the book's authority should not be
taken as settled doctrine.

**Interpretation.** Clean Code's "comments are failures" stance is real, primary, and influential,
but it is not uncontested — qntm's widely-discussed essay (Hacker News, Lobsters threads exist) is
evidence the "extreme decomposition, minimal comments" reading of Clean Code has fallen out of
favor since ~2020. Cite Martin for the position; cite qntm for why the position is not gospel.

---

## 5. Ousterhout, *A Philosophy of Software Design* — the opposing/complementary primary source

**Documented fact** (from secondary summaries of the book's chapter structure and quoted theses,
cross-checked across two independent summaries — danlebrero.com and a DEV Community summary, both
fetched 2026-09-18; the book's raw PDF text was not machine-readable via WebFetch, so no verbatim
page quote is claimed here, only chapter titles and paraphrased theses that both summaries agree
on):

- Ch. 12, "Why Write Comments?": rebuts "good code is self-documenting" as a myth; frames comments
  as a design tool, not decoration.
- **Ch. 13, "Comments Should Describe Things That Aren't Obvious from the Code"** — the book's
  central chapter on the topic. Thesis, converging across summaries: comments should add
  *precision* (exact units, boundary conditions, nullability, ownership) or *intuition* (the
  why/what-for that isn't recoverable by reading the statements) that the code cannot express by
  itself. It distinguishes **interface comments** (what a caller needs to know, independent of
  implementation) from **implementation comments** (why the internals do what they do), and states
  the rule as **what and why, not how** — the how is the code.
- Ch. 15, "Write the Comment First": comment-first development, by analogy to test-first,
  as a design discipline (writing the doc-comment before the body surfaces bad interfaces early).
- Ch. 16 (modifying existing code): "Comments belong to the code, not the commit log" — meaning
  comments should be self-sufficient at the point of reading, not require someone to go dig through
  history for context that could have been written down once.

**Interpretation — where Martin and Ousterhout agree vs. disagree.** Both explicitly reject
comments that **restate what the code already says** — this is the one point of full agreement.
They diverge on the *default*: Martin's default is "no comment, refactor instead," treating any
comment as an admission of failure; Ousterhout's default is "write the comment," treating the
comment as carrying information (precision, rationale, cross-module coupling) that no amount of
refactoring can move into the code, because code can only say *what*, never fully *why*. Ousterhout
is the newer, and at present the more commonly recommended, book among engineers who have read
both (this is an interpretation, based on the volume and tone of the secondary discussion found,
not a documented fact) — but the disagreement is real and primary-sourced on both sides, not a case
of one superseding the other by fiat.

## 6. Kevlin Henney, "Comment Only What the Code Cannot Say" (97 Things Every Programmer Should
   Know, ch. 17; republished as a standalone essay, ACCU Overload #157, 2020 — an update of the
   original 2010 piece)

**Documented fact** (ACCU essay, fetched 2026-09-18):

> "Comment what the code cannot say, not simply what it does not say."
> "A comment is of zero (or negative) value if it is wrong."
> "Don't comment bad code — rewrite it."

Henney treats a repetitive comment (one that restates code) as a DRY violation, treats
commented-out code as guaranteed-to-rot noise, and treats a wrong comment as actively worse than no
comment because it "spread[s] misinformation."

**Interpretation.** Henney's title is the same thesis as Ousterhout ch. 13, worded almost
identically ("cannot say" vs. "cannot say"/"isn't obvious") — two primary sources, independently
authored, converging on the same rule. Combined with Google Python's "never describe the code" and
the `writing-for-agents` no-op test, there are now **four independent primary sources** that agree
on one falsifiable rule: *a comment that a competent reader could derive from the adjacent code
is waste; a comment that records something the code cannot show (a constraint, a rejected
alternative, a unit, an external fact, a decision's reason) earns its line.* None of them endorse
"more comments" or "fewer comments" as a goal in itself — the goal is zero restatement and complete
coverage of the non-obvious.

---

## 7. Script conventions for a small Node/Playwright tool library

**Documented fact — Playwright.** Official-adjacent summaries of Playwright's test-runner docs
(fetched via search, 2026-09-18, cross-checked across BrowserStack/Checkly/Playwright-derived
sources, since the canonical playwright.dev page was not fetched verbatim in this pass):

- Default fixture scope is per-test: "Playwright creates a fresh instance for every test and tears
  it down when the test finishes... The context and page are re-created for every test to guarantee
  isolation, while the browser is reused across tests in the same worker."
- Worker-scoped fixtures exist specifically "for expensive setup that is safe to reuse... created
  once per worker process and shared by every test that process runs."
- Explicit anti-pattern: "Do not put a BrowserContext in a module-level variable or a `beforeAll`
  merely to avoid login time."

This is about Playwright's *test runner* fixture system. The Viva Maracanã scripts under review are
not Playwright tests — they are standalone Node scripts that happen to import `playwright` directly
(`chromium.launch()`) for one-off measurement, not a fixture-based suite. The fixture-reuse guidance
therefore does not directly apply to `medir-contraste-sobre-foto.mjs`; what does apply is the
general principle of not holding a browser/context open longer than one script's run, which the
script already follows (`navegador.close()` at the end, one context per viewport width).

**Documented fact — general ESM/small-script conventions** observed directly in the two toolchains
inspected (Anthropic's `anthropics/skills/skills/{pdf,docx,xlsx}/scripts/*.py` and the Viva Maracanã
`.mjs` scripts): both favor a single entry file per single-purpose task, config via `argv`/env vars
read at the top (`process.env.BASE`, `sys.argv[1]`), a `if __name__ == "__main__"` /
top-level-`await` guard, and shared helpers factored into an adjacent module rather than duplicated
(`office/helpers.py`, `office/soffice.py` in the Anthropic scripts). No primary source was found
that states this as an explicit convention document; it is observed convergent practice, not a
documented rule — flagged here as fact-from-observation, not doctrine.

---

## 8. Comment density measured in real scripts

### 8a. Anthropic's own scripts (`anthropics/skills`, `main` branch, fetched 2026-09-18)

| File | Total lines | Comment lines (`#`/docstring) | Notes |
|---|---:|---:|---|
| `skills/pdf/scripts/convert_pdf_to_images.py` | 33 | 0 | Zero comments anywhere — no module docstring, no inline `#`. Function/variable names carry all meaning. |
| `skills/docx/scripts/comment.py` | 368 | 22-line module docstring + 2 inline `#` | The docstring is not narration — it documents the two calling conventions, the ID-assignment rule, the XML-escaping default, and gives the exact XML the caller must still hand-add elsewhere. This is Ousterhout/Henney-shaped: it records what the code's own signature cannot express (a manual follow-up step outside this script's scope). |
| `skills/xlsx/scripts/recalc.py` | 308 | 3-line module docstring + 0 inline `#` | Virtually no comments; the "why" (e.g. refusing to recalc when external links would be destroyed) is carried entirely in the returned error-message strings shown to the caller, not in comments — the rationale is documented once, where the user/agent will actually see it at run time, rather than duplicated in a comment above the check. |

**Interpretation.** Anthropic's own reference scripts are comment-sparse to the point of having
zero inline comments in two of three files. Where explanation exists, it is concentrated in one
block (a module docstring) documenting *contract and gotchas*, or pushed into user-facing error
strings rather than source comments. This is a data point for what Anthropic's own tooling
authors do in practice, distinct from what Anthropic's docs prescribe for prose documents (§1-2).

### 8b. Viva Maracanã scripts (counted directly from the files, 2026-09-18)

| File | Total lines | Comment lines (approx., hand-counted block+line comments) | Blank | Code lines (approx.) |
|---|---:|---:|---:|---:|
| `scripts/medicao/medir-contraste-sobre-foto.mjs` | 190 | ~48 | 16 | ~126 |
| `.scratch/linguagem-visual/prototipo-ponto-de-fuga/ferramentas/cozinhar.mjs` | 406 | ~55 | 42 | ~309 |
| `.scratch/linguagem-visual/prototipo-ponto-de-fuga/ferramentas/versionar.mjs` | 29 | 7 | 3 | 19 |

(Counts are approximate hand tallies of `/* */` block comments plus `//` line comments; `grep`
alone undercounts multi-line `/* */` blocks, so these are manual sums, not a single automated
command's output.)

Comment share of total lines: `medir-contraste-sobre-foto.mjs` ≈ 25%, `cozinhar.mjs` ≈ 14%,
`versionar.mjs` ≈ 24%. All three sit well above the ~0-6% comment share of the two sparsest
Anthropic scripts (`convert_pdf_to_images.py` and `recalc.py`), and are closer to `comment.py`'s
front-loaded-docstring style (~6% but concentrated), except the Viva Maracanã comments are
distributed as many small blocks throughout the file rather than one block at the top.

---

## 9. Where the Viva Maracanã artifacts match, diverge, or over-explain

### `scripts/medicao/medir-contraste-sobre-foto.mjs`

- **Matches Ousterhout/Henney ("what the code cannot say"):** The header (lines 1-27) records why
  the fixed 0.62 opacity floor stopped being sufficient once real client photos replaced generated
  ones (11/09), and states the exact WCAG thresholds (4.5:1 / 3:1) and why the "large text" cutoff
  applies to the display title. None of this is recoverable from the code — it is a historical/
  business fact plus a normative citation. Lines 100-109's warning that `getBoundingClientRect()`
  measures the wrong box and `Range.getClientRects()` is required instead documents a debugged
  pitfall — exactly the kind of thing a future editor would silently reintroduce and exactly what
  Henney's rule protects. These are decisions/pitfalls that would otherwise be lost, not restatement.
- **Restates code (no-op by the `writing-for-agents` test):** none found — every comment in this
  file adds a fact (a threshold, a reason, a warning) rather than paraphrasing the following line.
- **Could be pruned under the no-op/sediment test:** the file is comment-dense (~25% of lines) but
  each comment earns its place individually; the candidate for trimming is not any single comment
  but the two-line inline comment at 133-135 duplicating part of what line 17-18 of the header
  already said (text is hidden from the screenshot) — a small case of the same fact stated twice
  (header + inline), which the no-op/duplication test would flag as a one-place-edit opportunity,
  not as narration to delete outright.

### `.scratch/linguagem-visual/prototipo-ponto-de-fuga/ferramentas/cozinhar.mjs`

- **Matches "what the code cannot say":** the top header's note that grain is deliberately NOT
  baked into the photograph ("decisão do Marcos, 16/09") is a client decision with a date and owner
  — unrecoverable from code, correctly commented. The per-recipe comments explaining *why* a
  specific photo was chosen for a specific role (e.g. "o anel precisa ler: o cliente reclamou em
  15/09 que o estádio some," "Interiores do museu (18/09): parede branca e luz difusa não têm fonte
  para florescer") record client feedback and empirical results (halo blowing out on flat white
  walls) that no amount of renaming would express — these are load-bearing per Ousterhout's test.
- **Restates code / borderline no-op:** the seven numbered step comments in `cozinhar()` (`// 1.
  Base recortada...`, `// 2. Feixes...`, ... `// 7. Grão assado.`) mostly name what the following
  block obviously does (a `feixes()` call after a comment saying "feixes") — these are closer to
  Martin's "restatement" failure mode than to Ousterhout's rule; the sequence is already legible
  from the function names being called. Under the no-op test, most of these seven single-word-ish
  labels change no behavior in a reader who already reads the function names; they are candidates
  to cut or merge into the numbered structure itself (e.g., extract seven appropriately-named small
  functions instead of numbering inline steps) rather than being outright deleted with no
  replacement, since the ordering-with-rationale ("o feixe entra ANTES da gradação, para ser
  esmagado e tingido junto com a cena" in the header) is the one part of this sequence that *is*
  load-bearing and already lives in the header, making the per-step numbering partially redundant
  with it.
- **Sediment risk:** the many one-line recipe comments ("Os três pilares validados," "Adicionais: as
  fotos reais da operação, não cena genérica de turismo") are short annotations on a config object;
  they read as living documentation of *why this photo* rather than sediment, but as the `RECEITAS`
  table grows, nothing enforces that a stale comment (e.g. a photo later swapped) gets updated —
  this is the kind of drift the `writing-for-agents` sediment concept predicts, not something
  already observed as broken in this file today.

### `.scratch/linguagem-visual/prototipo-ponto-de-fuga/ferramentas/versionar.mjs`

- **Matches "what the code cannot say":** the comment explaining why a content hash was chosen over
  a timestamp ("duas publicações no mesmo minuto davam a mesma versão (revisão adversarial do
  Codex, 17/09), e conteúdo igual não muda URL") documents a rejected alternative and who found the
  bug — textbook Ousterhout/Henney material, impossible to recover from the `createHash` call alone.
- **Restates code:** the first comment line ("troca o `?v=` de todo CSS e JS por um hash do
  conteúdo dos assets") is close to restating the file's own name and the following code, but it
  also states the *purpose* ("é o que faz o navegador... buscar os arquivos novos") which the code
  alone doesn't carry, so it sits on the acceptable side of the line, just less essential than the
  hash-vs-timestamp rationale beside it.
- Overall this file is the tightest of the three: 29 lines, 7 comment lines, every comment carrying
  a fact or a decision, none of them narrating the next line's mechanics.

### `docs/agents/especialistas-por-etapa.md`

- This is a prose artifact, not code, so it is graded by the `writing-for-agents` tests directly
  rather than by Ousterhout/Henney.
- **No-op check:** most sentences pass — e.g., "Teste protege lógica e contrato; composição se
  revê olhando (ADR-0017)" states a non-default rule (why this repo doesn't test visual composition)
  that an agent would otherwise guess wrong. The four-step cycle (Observar → Pesquisar → Compor →
  Criticar) each ends on an explicit completion criterion ("Fecha quando..."), which is exactly the
  clarity lever the `writing-for-agents` skill calls out as strengthening a step.
- **Candidate no-ops / restatement of the environment:** the "Portões por mudança" table restates
  npm script names (`npm run verificar`, `npm run contraste`, `npm run test:e2e`) that already exist
  in `package.json` — under the `writing-for-agents` cache rule ("Leave the one-file, one-command
  lookups to the environment, where they cannot go stale"), this table is only justified because it
  encodes *which* gate applies to *which kind* of change, a mapping `package.json` cannot express by
  itself — so it is a legitimate cache of a non-trivial lookup, not a pure restatement, but it is the
  part of this document most exposed to going stale if a script is renamed or a gate added.
- **Nothing in this file reads as pure narrative filler** by the no-op test — it is reference
  material (a flat rule set) appropriately kept in-file rather than disclosed, matching the
  `SKILL-MECHANICS.md` guidance that flat reference peer-sets are "a fine arrangement, not a smell."

### Overall pattern across the three scripts and the doc

The Viva Maracanã comment style already mostly follows the primary sources' shared rule (comment
the undocumentable: dates, owners, rejected alternatives, WCAG citations, debugged pitfalls) rather
than Martin's "comments are failure" extreme or pure narration. The one recurring, genuinely
prunable pattern is the numbered-step inline comment style in `cozinhar.mjs` (`// 1. ... // 7. ...`),
which restates call order that the function names already carry and duplicates a rationale already
stated once in the file's header — this is the closest the sampled files come to the user's
complaint, and it is isolated to one file's implementation function, not systemic across the
sampled scripts or the docs file.

---

## Sources

- Anthropic, "Best practices for Claude Code," `code.claude.com/docs/en/best-practices`, fetched 2026-09-18.
- Anthropic, "Skills," `code.claude.com/docs/en/skills`, fetched 2026-09-18.
- Anthropic, `anthropics/skills` repo, `skills/skill-creator/SKILL.md`, `main` branch, fetched via `raw.githubusercontent.com`, 2026-09-18.
- Anthropic, `anthropics/skills` repo, `skills/pdf/scripts/convert_pdf_to_images.py`, `skills/docx/scripts/comment.py`, `skills/xlsx/scripts/recalc.py`, `main` branch, fetched 2026-09-18.
- Matt Pocock, `writing-for-agents` skill, `SKILL.md` and `SKILL-MECHANICS.md`, local plugin cache `C:\Users\marco\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.3\skills\productivity\writing-for-agents\`, read 2026-09-18.
- Google, JavaScript Style Guide, `google.github.io/styleguide/jsguide.html`, §4.8 "Comments," fetched 2026-09-18.
- Google, Python Style Guide, `google.github.io/styleguide/pyguide.html`, §3.8 "Comments and Docstrings," fetched 2026-09-18.
- Robert C. Martin, *Clean Code: A Handbook of Agile Software Craftsmanship* (2008), ch. 4 "Comments" — quoted via widely-reproduced verbatim excerpt, cross-checked 2026-09-18.
- qntm, "It's probably time to stop recommending Clean Code," qntm.org/clean, published 2020-06-28, fetched in full 2026-09-18.
- John Ousterhout, *A Philosophy of Software Design* (2018/2021), chs. 12, 13, 15, 16 — chapter titles and theses cross-checked against two independent secondary summaries (danlebrero.com/2021/02/24/philosophy-of-software-design-summary/; dev.to summaries), fetched 2026-09-18; the book's own PDF was not machine-text-extractable via the tools available in this session, so no page-level verbatim quote is claimed.
- Kevlin Henney, "Comment Only What the Code Cannot Say," *97 Things Every Programmer Should Know* ch. 17 (2010), republished ACCU *Overload* #157 (2020), accu.org/journals/overload/28/157/henney_2796/, fetched 2026-09-18.
- Playwright documentation on test fixtures and browser-context scope — cited via cross-checked secondary sources (Checkly, BrowserStack) summarizing playwright.dev, fetched 2026-09-18; not fetched verbatim from playwright.dev in this session.
- Local: `C:\Users\marco\Dev\viva-maracana\scripts\medicao\medir-contraste-sobre-foto.mjs`, `C:\Users\marco\Dev\viva-maracana\.scratch\linguagem-visual\prototipo-ponto-de-fuga\ferramentas\cozinhar.mjs`, `...\ferramentas\versionar.mjs`, `C:\Users\marco\Dev\viva-maracana\docs\agents\especialistas-por-etapa.md`, read and hand-counted 2026-09-18.
