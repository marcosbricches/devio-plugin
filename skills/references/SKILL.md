---
name: references
description: "Gather, judge and steer references for a design: a moodboard, brand references, a board, products or brand systems in use, and the round the designer steers with picks. Use for any reference search, for a ticket or spec that names a design step, and when a subagent is sent to gather references."
---

# References and the round

**Only the designer's "this is it" closes a round.** A pick opens the next one: search for more of what the pick shows and for what is still missing, and show the result as images. The agent never proposes closing and never asks "shall we close here?": a question after a round pulls a courtesy "yes". Each round ends on the board and one line saying what the next round looks for. The three closes (the references, the brand manual, the Direction) are the designer's and separate: closing one closes nothing else.

## The round

A **Round** is images in view, the designer's reaction, and the next input steered by it: a search (the agent's, in the thread, every image opened with `Read`) or, with a design tool in the middle, a keep / go further / fix prompt.

- A proposal is an image with a caption of one line at most. Tokens (font, hex colours, radius, shadow) are extracted from an approved image or an identity that exists, and a token table is not written ahead of one, not even as a draft. With no way to make an image, the turn ends asking the designer to bring one.
- A ticket or spec that names a design step (a moodboard, an identity, a direction, "pick") is read as this loop, and a pick opens it. When devio itself plans a design step, the question is the loop and its inputs, never the answer.

## The bar

Every figure is one field trial's guess (2026-10-03 to 2026-10-04, n = 1) unless it carries a source.

- **Currency.** A reference carries the year it shipped or was last redesigned, where that year was read, and the date read. The year comes from a changelog, a redesign post or a date visible in the capture; Mobbin's metadata has none (probe 2026-10-04). The window is the last two years (2024 to 2026 today), a guess. With no origin the reference reads "year unverified" and stays only if you opened the image and found it current. A product outside the window lends one named pattern, tagged "pattern only", and its look, type and finish stay out.
- **The product's own world** lends domain patterns: which objects and boards exist. Look, type and finish come from current products of any domain, filtered by the brief's tone and anti-references. The search starts from the product's real job, not from the screens the designer picked first. A craft search names products: the 2 or 3 the designer admires, and studio or awards pages. With none named, the reply's first line says so.
- **Tone is not an era.** A tone word (sober, public, clinical, institutional) means restraint at today's level of craft; a period or a sector's look comes only when the designer names it.
- **Depth.** The set shows layers (tinted canvas, lifted cards, colour blocks) and flat only when the brief asks. A set of hairline borders alone is rejected before the designer sees it. Mobbin's web dashboards come from near-empty demo accounts: judge them for layout and layers, not density.
- **Brand references** are brand systems in use, one image per capability the product lacks, never UI, from studio work pages, about 8 as a reference point (in one trial 8 images gave a point of view and 44 averaged into nothing). Behance and Brand New are off the list (a default feed and reviews behind a subscription; from that trial, not re-verified). UI references come after the manual and are searched only for a capability no open image shows.

## What the search hands back

Images saved to disk, with no table of links: Mobbin's `image_url` expires after 30 days (the MCP's own description, read 2026-10-03). Beside each image, one line: source, year, where the year was read, date read, the one capability it lends. The thread opens a sample and rejects dated ones itself, whoever gathered them, a subagent included.

A subagent that gathers references is told `devio:references` by full name. It inherits no skills and can call `Skill`.

**Firecrawl answers 402:** a credits problem, not a missing tool. Name it in the reply's first line and continue with the Chrome DevTools MCP, Playwright or WebFetch on the studio pages. Topping up credits is the designer's call.
