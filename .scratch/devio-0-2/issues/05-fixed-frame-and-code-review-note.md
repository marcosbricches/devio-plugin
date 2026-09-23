# 05: The fixed frame of the screen, and the code-review note

**What to build:** Two additions to the hook text.

The designer's preferences gain the fixed frame, in the agreed wording from the spec: the app shell
keeps one height on every route and content starts at the same x; titles, search, filters and
metrics go in the page body; `html { scrollbar-gutter: stable }`; before a build with several routes
is shown, header height and the content's left edge are measured on every route at phone and desktop
widths with Playwright and they match, because neither Impeccable's detector nor its reviewer looks
across routes. Sources are in `.scratch/devio-0-2/research-fixed-layouts.md`.

The `code-review` row gains: in a new project, `git add -N` the new files first, because untracked
files are not in the diff it reviews.

No eval measures the fixed frame in this release; the acceptance field trial does.

**Blocked by:** 04 (same file; the tickets that edit the hook text run in series)

**Status:** ready-for-agent

- [ ] The fixed-frame preference is in the hook text with the spec's wording
- [ ] The `code-review` row carries the untracked-files note
- [ ] The hook text stays under the size guard, and the new count is in the ticket's comments
- [ ] The five original cases each pass one run as a smoke check
