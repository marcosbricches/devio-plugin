---
name: screen
description: Build or redesign a screen, page, landing page or multi-route app. Use before building any UI from scratch or from references; runs through a render checked against the references.
---

# A screen, from references to a checked render

1. **References.** The designer's own, or found with the Mobbin MCP (`search_screens`, `search_flows`, `search_sections`) and firecrawl (`firecrawl-scrape` with a screenshot, `firecrawl-website-design-clone`). With neither at hand, ask the designer for them before building. Save each as an image and open it with Read; a chosen one may also be rebuilt as an HTML mockup, opened next to its image. Done when every reference the composition draws on is open in this thread.
2. **Build** with `impeccable:impeccable`, composing from those references. A new project starts with `/impeccable init`, which writes `PRODUCT.md`.
3. **Motion** through the GSAP skills, and **every library** through context7.
4. **Compare.** Screenshot the render with Playwright and read it next to the references, image against image. Fix what differs.
5. **Frame.** With more than one route, measure the header height and the content's left edge on every route, at phone and desktop widths, with Playwright. They match.
6. **Polish** with `impeccable:impeccable`, then show the screen.

## Gotchas

- A reference stays an image, or an HTML rebuild of one. A summary, a notes file or a subagent's report loses the composition and the character, and a subagent's reply comes back as text only, so the thread that composes opens the references itself. A firecrawl `DESIGN.md` goes with its screenshot, never instead of it.
- The references the designer pointed to set the composition. A direction Impeccable rolls does not replace them; Impeccable's own rule says the roll never outranks the user or the brief.
- The app shell (header, navigation) has one height on every route, and content starts at the same x. Titles, search, filters and metrics go in the page body. `html { scrollbar-gutter: stable }` keeps pages with and without a scrollbar aligned.
- Neither Impeccable's detector nor its reviewer compares routes, so step 5 is the only check of the frame.
