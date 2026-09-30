---
name: screen
description: Build or redesign a screen, page, landing page or multi-route app. Use before building any UI from scratch or from references; runs through a render checked against the references.
---

# A screen, from references to a checked render

1. **References.** The designer's own, or found with the Mobbin MCP (`search_screens`, `search_flows`, `search_sections`) and firecrawl (`firecrawl-scrape` with a screenshot, `firecrawl-website-design-clone`). With no product named, search the product's own world: the apps its users already open for this job, and the boards, tables and objects of their trade. With neither at hand, ask the designer for them before building. Save each as an image and open it with Read; a chosen one may also be rebuilt as an HTML mockup, opened next to its image. Done when every reference the composition draws on is open in this thread.
2. **Lead.** Pick one open reference to lead: the one the designer named, or else the real product closest to this one's job. Follow it the way a build told "make it like Apple" follows apple.com: its layout, type scale, colour and density. The other references each supply one named part the lead lacks.
3. **First screen, in code.** Compose it yourself from the open images, in the project's stack, with the product's real content. This screen is the direction. Show it to the designer, naming the lead and what each other reference gave, and wait: the direction is theirs. The other routes then speak its language.
4. **Motion** through the GSAP skills, and **every library** through context7.
5. **Compare.** Screenshot the render with Playwright and read it next to the references, image against image. Fix what differs.
6. **Frame.** With more than one route, measure the header height and the content's left edge on every route, at phone and desktop widths, with Playwright. They match.
7. **Polish** with `impeccable:impeccable`, as a scoped command on the built code (`polish`, `critique`, `audit`), then show the screen.

## Gotchas

- Impeccable composes nothing before step 7. Its new-work flow (`init`, `shape`, `craft`, a direction round with `concept-seed` and a decision page) turns references into text cards and rolls a visual world from its own catalog. In a field trial on 2026-09-27 it set aside six open references for a roll, and the designer stopped the session as AI slop. A scoped command on existing code runs without `PRODUCT.md`: Impeccable's `context` says to proceed using the code and offer init as a suggestion (read 2026-09-27, Impeccable 4.3.1).
- Impeccable's `Stop` hook ("Design deep pass") reviews the written file when the turn ends and sends its findings back, so the turn's last reply becomes a lint report (Impeccable 4.3.1 `hooks/hooks.json`, read 2026-09-30). Handle the findings, then end that reply by showing the direction again: the lead, what each other reference gave, and the wait for the designer.
- A reference stays an image, or an HTML rebuild of one. A summary, a notes file, a direction card or a subagent's report loses the composition and the character, and a subagent's reply comes back as text only, so the thread that composes opens the references itself. A firecrawl `DESIGN.md` goes with its screenshot, never instead of it.
- The app shell (header, navigation) has one height on every route, and content starts at the same x. Titles, search, filters and metrics go in the page body. `html { scrollbar-gutter: stable }` keeps pages with and without a scrollbar aligned.
- Neither Impeccable's detector nor its reviewer compares routes, so step 6 is the only check of the frame.
