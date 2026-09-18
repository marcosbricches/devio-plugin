---
name: client-report
description: Writes and builds the two-page report a client receives on Devio's paper. Use when asked for a report for the client, a document presenting a round's visual direction, or a .docx of what was decided and why.
---

The client gets a document, not a link to a prototype and a list of commits. Two pages, on Devio's paper, saying what was decided and what it cost.

## What a good report contains

- **About two pages.** Long enough to carry the reasoning, short enough to be read in one sitting before a meeting. If it runs to four, the round had two subjects and wants two reports.
- **Every decision with its origin.** What we saw, what we looked at, what we chose. A decision presented without where it came from reads as taste, and taste is what the client is paying us to have grounded.
- **The trade, stated.** Every choice gave something up. Saying so is what makes the rest credible.
- **The client's own words**, where they exist — a quote from the brief or the meeting, so they recognise their problem in our answer.
- **A table** when there is a before and an after, or a set of screens. It is the part that gets read first.
- **Humanised prose.** Written the way a person talks about their work: no "leverage", no "robust", no three-item lists of adjectives, no sentence that could sit in any other report about any other project.

Write it in the client's language, which is Portuguese unless told otherwise. Everything in the plugin is English; this document is not a plugin artifact, it is the client's.

## Build it

Write the markdown first — that is the artifact anyone reviews. Then:

```bash
pip install -r <plugin>/skills/client-report/requirements.txt
python <plugin>/skills/client-report/build.py path/to/text.md
```

The output lands next to the input as `<project> - <title> - Devio.docx`, with the project taken from the repository name and the title from the `# ` heading. `--project` and `--out` override either.

The markdown the builder understands, and what each becomes, is documented at the top of `build.py`. If a dependency is missing the script stops and prints the install command — run it, and never work around a missing dependency by producing a lesser document.

## Before sending

Open the `.docx`. Check that it is two pages, that no table split badly, and that the first line says something specific about this project.
