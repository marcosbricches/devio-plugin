---
name: brand
description: "Make or steer an identity or a brand manual: the order of the effort, the Lean prompt the designer pastes into Claude Design or another design tool, the review of each version, the Closing pass when the designer closes the manual, and what to do when a result comes back generic. Use for an identity, a brand manual, Claude Design, or a prompt for a design tool, and for a product that has no visual language yet."
---

# Identity and the brand manual

**The agent never composes an identity as a screen, and never conducts Claude Design.** The identity is made in Claude Design, which the designer operates: the agent prepares the brand references, writes the Lean prompt, reviews each version, and the designer pastes, reacts and closes. There is always an exit: the designer brings the identity or the visual language, or skips the manual. Every figure below is one field trial's guess (2026-10-03 to 2026-10-04, n = 1) unless it carries a source; Anthropic's own advice leans the other way on volume ("The more context you give Claude, the better your output will be", support.claude.com, read 2026-10-04).

## The order

1. **The brief**, the designer's: what the product does for whom in one sentence, how it should feel in one.
2. **Brand references**, the agent's, by `devio:references`: brand systems in use, one image per capability the product lacks, in rounds until the designer says "this is it".
3. **The Lean prompt**, below.
4. **Rounds** of keep / go further / fix, each from the agent's Version review. Product facts enter here, never in the opening request.
5. **The Closing pass** when the designer closes the manual, then the visual language is extracted from it (`devio:screen`).
6. **UI references** per missing capability, the Lead, the first screen in code, the Direction.

The UI moodboard does not come before the identity: UI images in the first request made the tool draw screens. A client that already has an identity gets the same effort: the logo, a capture of its site and its colours go in as one more input, and brand references are chosen only for the capabilities it lacks (graphic devices, data as brand, voice).

## The Lean prompt

The opening request to a design tool holds four things and nothing else: what the product does for whom (one sentence), how it should feel (one), the deliverable, the images.

- **No prohibition, hard rule, domain mechanic or look word** (a font, a colour, a radius). Words name objects to draw: a mechanic in the request came back drawn literally.
- **The deliverable is the whole system as a brand manual, three Candidates, then wait.** Never a logo alone: Anthropic's post calls Claude Design a poor fit for logo design for having no image model (Parrott, claude.com, 2026-07-24, read 2026-10-04), so even a manual is outside what its pages document.
- **Channel.** The prompt is one fenced block the designer pastes in the chat, with the images attached there. No folder import: images in the chat are documented, a named file in an imported folder is not (support.claude.com, read 2026-10-04). Not documented either: the tool's own file limits (claude.ai chat allows 20 files per chat, which a set of about 8 stays under).
- **No sources in the prompt.** It carries no source line, no date, no "must", no limit. This is devio's own rule, written over the designer's global "a constraint carries its source": the reply that hands the prompt over carries the sources and limits, so the designer sees what each claim rests on and the tool does not read them.
- **The reply around the block** gives each reference's source and year (from the manifest), says to attach the images in the chat, and offers "bring your own / skip the manual" in the same sentence.
- The shape holds for the opening request to any design agent; the images clause holds only where the tool takes images.

**When no visual language exists and none is brought,** the turn ends there: the brand reference images and the prompt to paste, nothing built, no token table, no concept in prose, and no screen. The hook's "one next step" governs recommendations; this is a handoff with an exit.

## The Version review

In the reply after every version round, never as a file. Three short parts: what the version took from each reference; what came out literal or generic; the product facts that are wrong against the product's own documents (absent when there are none). It checks only what the version changed, and runs two composition checks by eye on the slides it changed: no dead space, and data in a form the eye knows. It ends on a keep / go further / fix proposal the designer edits, with the product facts as a short "facts to fix" list; a composition finding goes into "fix" as a problem to recompose, not as a rule. The designer's reaction steers the next prompt, not the proposal.

## The Closing pass

Run once, when the designer says "this is it" on the manual and before the visual language is extracted or the manual reaches the client. It has two halves.

- **The copy pass:** read the whole deck's text against the product's own documents and reply with each wrong line and the document it contradicts.
- **The composition checks,** on the rendered slides. Measure with `evaluate_script`: parallel items share one line count; rules sit between items, never at a list's end; alignment follows the block; grids line up across rows; a graphic bleeds or keeps clear, with no edge ending inside its frame closer than 8 % of the frame, 56 px at least, 56 px for a thin cut. Read by eye: text has room; a line meeting a round shape joins its curve. The numbers come from one designer's review of one 1920x1080 deck: a starting point, no false-positive rate measured. One photo treatment and subtle graphics stay with the project.
- **The renderer is the agent's own:** the export stacks one `section` per slide; scroll to each and take one `take_screenshot` per slide, every slide of the version (a probe on one export, 2026-10-04: 61 sections of 1080 px with fonts loaded; a scrollbar narrowed one slide to 1905 px, hiding it untried). The PDF is Claude Design's own export. No script ships.
- **Who fixes.** The agent fixes in the exported file, in code, only what a rule determines (line counts, rules, alignment and grids by the equality, a graphic edge by the smaller move). A finding that needs a choice goes to the designer with the slide as an image and the alternatives: fix in code, reopen a round, or accept. The agent never chooses.
- **No new approval.** The reply lists each fix with the slide as it is now; "this is it" stands. The manual is not offered for delivery with an open finding the designer has not accepted.
- **A re-export loses the fixes,** so the pass runs again on any re-export; say so when the pass ends.

## A generic result

Cut input before adding any, one change per round so the cause shows:

1. Take out every prohibition, hard rule, domain noun and look word, keep the images: that is the Lean prompt again.
2. Check the image set against the bar in `devio:references` and replace images, never add.
3. Send a request that worked before and compare.

The first move of the reply is cut 1, written as the shorter request to send, and nothing else changes with it. After one failed cut, the turn ends with the alternatives side by side and what each trades: look words (Anthropic's own advice, untested here) or a different image set. No concept, rule or constraint is added as a fix. "It needs a concept with a tension" and "the personality words describe the default" were disproved in the trial and are not written into a prompt.

## Alternatives

Where alternatives are shown, they pass the Candidate test: swap the font, colour and radius between two; if they come out the same, they are one.
