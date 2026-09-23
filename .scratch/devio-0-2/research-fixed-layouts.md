# Research: chrome that stays fixed across screens

Question: a generated web prototype changed its header band height from route to route (KPI tiles,
search, progress bars inside it) and shifted content sideways between pages with and without a
scrollbar. Neither Impeccable's detector nor its finish reviewer caught it. What does the industry
call this, how is it prevented, and how is it checked?

All sources read 2026-09-23. Firecrawl credits ran out on the first batch, so pages were read
with WebFetch, `curl` (CSSWG drafts, GitHub raw source) and `gh search code`. Where WebFetch
summarised rather than quoted, the wording below is marked as a paraphrase.

## 1. Vocabulary: persistent chrome vs. page header

The sources split the top of the screen into two things with different rules:

- **Global chrome**: the persistent frame that is the same on every route. It goes by
  *application shell* / *app shell*, *UI shell*, *header*, *top app bar*, *navigation bar*.
- **Page header**: the top of the page's own content: title, breadcrumbs, page-level actions,
  sometimes search and filters. It belongs to the page, not to the chrome.

The prototype's defect was page content (KPIs, search, progress) placed inside the global chrome
band, so the chrome's height depended on the page.

**Application shell (Chrome for Developers / Workbox).** "A minimal set of HTML, CSS, and
JavaScript needed to power the global functionality of an application. In practice, this tends to
be the header, navigation, and other common user interface elements that persist across all
pages." And: "An application shell makes the most sense when you have common user interface
elements that don't change from route to route, but the content does."
https://developer.chrome.com/docs/workbox/app-shell-model (page last updated 2021-11-04; read 2026-09-23)

**Carbon (IBM), UI shell header.** "A shell is a collection of components shared by all products
within a platform" that "provides a common set of interaction patterns that persist between and
across products." The header is "the foundation for navigating and orienting your user to the UI"
and a "globally persistent location for navigational links and utilities" (paraphrase by WebFetch
of the source MDX: the header holds product name, navigation, system-level utilities such as
search, notifications and account; page content is separate).
https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/UI-shell-header/usage.mdx (read 2026-09-23)
Fixed height: "The header should span the full width of the browser window" and is **48 px / 3 rem**
tall; header actions are 48 × 48.
https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/UI-shell-header/style.mdx (read 2026-09-23)

**GOV.UK Design System, header.** "You must use the GOV.UK header component at the top of every
page." "You can no longer use the GOV.UK header to show service name or navigation links" (moved
to the separate Service navigation component); "Do not add the menu of GOV.UK topic links to your
service's GOV.UK header."
https://design-system.service.gov.uk/components/header/ (read 2026-09-23)

**Material Design 3, top app bar.** Variants: *search app bar* and *small* ("regular top app bars"),
*medium flexible* and *large flexible* ("collapsing top app bars"; medium flexible "can collapse
into a small app bar on scroll"). Medium and Large are deprecated in favour of the flexible ones.
https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/TopAppBar.md (read 2026-09-23; points to https://m3.material.io/components/top-app-bar/overview, which WebFetch could not render)
Container heights, from the generated M3 token source (token VERSION 14_0_0): small **64 dp**;
medium flexible **112 dp** (large 136 dp); large flexible **120 dp** (large 152 dp).
https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens (files `AppBarSmallTokens.kt`, `AppBarMediumFlexibleTokens.kt`, `AppBarLargeFlexibleTokens.kt`; read 2026-09-23)
So M3 does allow taller bars. They are named variants with fixed token heights, and the taller
ones collapse to the small bar on scroll. The height never follows whatever content a page puts in
the bar.

**Apple HIG, toolbars / navigation bar.** "In iOS, a navigation-specific toolbar is sometimes
called a navigation bar." "Use a large title to help people stay oriented as they navigate and
scroll. By default, a large title transitions to a standard title as people begin scrolling the
content." "Choose items deliberately to avoid overcrowding." "Keep consistent groupings and
placement across platforms." "Minimize the number of groups … aim for a maximum of three."
https://developer.apple.com/design/human-interface-guidelines/toolbars (read via the JSON at https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toolbars.json, 2026-09-23)

**Atlassian, page header** (the page-level header, not the global nav). "A page header defines the
top of a page. It contains a title and can be optionally combined with breadcrumbs buttons, search,
and filters." Anatomy: page grid, breadcrumbs, title, actions, search and filters bar. "Use one page
header per page"; not in modals, dialogs, drawers or popups. The anatomy lists no metrics or KPI
tiles.
https://atlassian.design/components/page-header/usage (read 2026-09-23)

**Shopify Polaris, Page** (polaris-react.shopify.com no longer served content; the current docs
are the web-components Page). The page is "the outer wrapper of a page" with breadcrumbs, page
actions and content areas. Header slots are `breadcrumb-actions`, `primary-action`,
`secondary-actions`. "Include page actions in the header only if they are relevant to the entire
page." "Include no more than one primary action and 3 secondary actions per page."
https://shopify.dev/docs/api/app-home/polaris-web-components/structure/page (read 2026-09-23)

**W3C WCAG 2.2, SC 3.2.3 Consistent Navigation (AA).** "Navigational mechanisms that are repeated
on multiple web pages within a set of web pages occur in the same relative order each time they
are repeated, unless a change is initiated by the user." It requires the same *relative order*, not
the same pixel position or size, so it is the accessibility name for consistency but does not
cover height.
https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html (read 2026-09-23)

**Where page-specific content goes (summary of the above).** In every system read, the global
header holds identity, navigation and global utilities. Page title, page actions, search and
filters go in the page header, which belongs to the page body (Atlassian, Polaris). No source puts
KPI tiles or progress bars in either header. Nothing read defines a single term for the rule
itself. The closest terms are *application shell* ("don't change from route to route"), *persistent*
header (Carbon, GOV.UK) and *consistent navigation* (WCAG 3.2.3). "Layout stability" is web.dev's
name for CLS, which is scoped to one page (see §3).

## 2. Scrollbar shift

**Spec home.** `scrollbar-gutter` is defined in **CSS Overflow Module Level 3** §5.2, not Level 4.
Level 4 only has an appendix, "Possible extensions for scrollbar-gutter". Overflow 3 is an Editor's
Draft dated 13 August 2026.
https://drafts.csswg.org/css-overflow-3/#scrollbar-gutter-property (read 2026-09-23)
Verbatim:
- "The scrollbar-gutter property gives control to the author over the presence of scrollbar
  gutters separately from the ability to control the presence of scrollbars provided by the
  overflow property."
- `auto`: "Classic scrollbars consume space by creating a scrollbar gutter when overflow is scroll,
  or when overflow is auto and the box is overflowing. Overlay scrollbars do not consume space."
- `stable`: "The scrollbar gutter is present for classic scrollbars when overflow is hidden,
  scroll, or auto, regardless of whether the box is actually overflowing. Overlay scrollbars do
  not consume space."
- `both-edges`: "If a scrollbar gutter would be present on one of the inline start edge or the
  inline end edge of the box, another scrollbar gutter must be present on the opposite edge as
  well."
- Root: "when scrollbar-gutter is set on the root element, the user agent must apply it to the
  viewport instead … unlike the overflow property, the user agent must not propagate
  scrollbar-gutter from the HTML body element." So it goes on `html`, not `body`.

**MDN.** "allows authors to reserve space for the scrollbar, preventing unwanted layout changes as
the content grows while also avoiding unnecessary visuals when scrolling isn't needed."
Status: **Baseline 2024, newly available**: "Since December 2024, this feature works across the
latest devices and browser versions."
https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter (read 2026-09-23)

**Alternatives and the `100vw` pitfall.** CSS Values 4 (Editor's Draft, 20 August 2026), §6.1.2.1:
"if the value of overflow or scrollbar-gutter on the root element in either axis would cause
scrollbars to appear (or space to be reserved for them) unconditionally (for example, overflow:
scroll, but not overflow: auto), the computed values of the viewport-percentage lengths in that
axis are reduced in accordance with the initial containing block. Otherwise … the
viewport-percentage lengths are sized assuming that scrollbars do not exist."
https://drafts.csswg.org/css-values-4/#viewport-relative-units (read 2026-09-23)
What follows from these sources:
- `html { scrollbar-gutter: stable }` reserves the gutter on every page, whether or not it
  scrolls. Content stays put and no empty scrollbar track is drawn. This is what MDN describes it
  for.
- `html { overflow-y: scroll }` gives the same stability by always drawing a scrollbar, including
  on pages that don't scroll. Per the Overflow 3 table it also reserves the gutter. Its cost is the
  visible empty track that MDN's wording ("avoiding unnecessary visuals") refers to.
- `width: 100vw` under the default `overflow: auto` is sized "assuming that scrollbars do not
  exist". On a page with a classic scrollbar it is wider than the space available, which causes
  horizontal overflow or an offset. The same draft says `overflow: scroll` or `scrollbar-gutter`
  on the root makes `vw` match the initial containing block. The draft's change log calls this a
  change (Issue 6026), so current browser support for it was **not verified**.
- Overlay scrollbars (the macOS default, mobile) never take space, so the shift only shows up
  where classic scrollbars are used. A check run on macOS alone can miss it. That last point is
  inferred from the spec's classic/overlay definitions and was not tested.

## 3. Verification: existing methods for cross-route chrome consistency

No tool read has a built-in "compare the chrome across routes" check. The existing primitives
compose into one:

**Playwright visual comparisons.** `expect(locator).toHaveScreenshot(name)`: "This function will
wait until two consecutive locator screenshots yield the same result, and then compare the last
screenshot with the expectation." The first run writes the baseline ("A snapshot doesn't exist …
writing actual").
https://playwright.dev/docs/api/class-locatorassertions (read 2026-09-23); https://playwright.dev/docs/test-snapshots (read 2026-09-23)
Options (page form): `mask` ("Specify locators that should be masked when the screenshot is taken.
Masked elements will be overlaid with a pink box `#FF00FF`"), `maskColor`, `maxDiffPixels`,
`maxDiffPixelRatio`, `threshold` (YIQ, default 0.2), `animations: "disabled"`, `fullPage`, `clip`,
`stylePath`, `caret: "hide"`.
https://playwright.dev/docs/api/class-pageassertions (read 2026-09-23)
Caveat: "Browser rendering can vary based on the host OS … For consistent screenshots, run tests
in the same environment where the baseline screenshots were generated."
https://playwright.dev/docs/test-snapshots (read 2026-09-23)
Cross-route use: loop over the routes and assert the header locator against **one shared snapshot
name**, masking the active-nav indicator. This is a composition of documented APIs; Playwright
does not document it as a pattern.

**Playwright bounding boxes.** `locator.boundingBox()` returns `{x, y, width, height}`,
"calculated relative to the main frame viewport"; "Scrolling affects the returned bounding box".
https://playwright.dev/docs/api/class-locator (read 2026-09-23)
Deterministic and OS-independent where screenshots are not: record the header's `height` and the
content column's `x` / `width` on every route and assert they are equal. That catches both
reported defects (band height, sideways shift). `toHaveCSS` ("Ensures the Locator resolves to an
element with the given computed CSS style") can also assert a declared `height`.
https://playwright.dev/docs/api/class-locatorassertions (read 2026-09-23)
Both Playwright MCP and Chrome DevTools MCP are installed here and can run the same measurement
ad hoc (`browser_evaluate` / `evaluate_script` with `getBoundingClientRect()`).

**BackstopJS.** Scenarios are "a list of URLs"; `selectors` is an "Array of selectors to capture.
Defaults to document if omitted"; `hideSelectors` / `removeSelectors`; viewports; reference vs.
test; `misMatchThreshold` ("percentage of different pixels allowed to pass the test");
`requireSameDimensions`.
https://github.com/garris/BackstopJS (read 2026-09-23)
It compares each URL with its own earlier reference, so it catches regressions over time rather
than differences between routes, unless the scenarios share a reference.

**Chromatic.** Snapshots Storybook stories, or archives the UI during Playwright/Cypress runs, and
"identifies visual regressions through pixel diffing" against baselines, with reviewer sign-off.
https://www.chromatic.com/docs/ (read 2026-09-23)
This is also baseline-over-time, per story or test, and a paid service.

**Lighthouse / CLS does not cover this.** "CLS is a measure of the largest burst of layout shift
scores for every unexpected layout shift that occurs during the entire lifecycle of a page."
Shifts within "500 milliseconds of user input" get `hadRecentInput` and are excluded.
https://web.dev/articles/cls (last updated 2023-04-12; read 2026-09-23)
A route change comes from a click, so CLS either excludes it (SPA, within 500 ms) or never sees
it (a full navigation starts a new page). CLS cannot compare one route's chrome with another's.
That conclusion is inferred from the definition; web.dev says nothing about soft navigations.

**Impeccable 4.3.1 (installed copy).** Grep of
`C:\Users\marco\.claude\plugins\cache\impeccable\impeccable\4.3.1\` (reference/, agents/, SKILL.md)
for cross-route, across pages/routes/screens, scrollbar-gutter, header height, app shell,
persistent header: **no rule covers cross-route chrome consistency or scrollbar gutter.** The
nearest lines:
- `skills/impeccable/reference/operate.md:48`: "Inconsistent component vocabulary across screens.
  If the "save" button looks different in two places, one is wrong." This is about component
  appearance, not layout frame.
- `skills/impeccable/reference/typeset.md:20,50`: repeated type roles "consistent across screens
  and states".
- `skills/impeccable/reference/layout.md:23-24`: asks what "remains fixed" across widths and
  whether "sticky elements" expose failures. This is about one screen across widths.
- `skills/impeccable/reference/polish.md:92`: checks "layout shift" (CLS sense).
- `skills/impeccable/reference/craft-floor.md:15`: custom scrollbars should be themed. This is
  about appearance, not the gutter.
Why neither gate saw it: `impeccable detect --help` scans "files or URLs" one target at a time
(scopes `type`, `layout`) with no cross-target comparison. `agents/impeccable-finish-reviewer.md`
lines 19 and 23 require exactly `desktop.png` and `mobile.png`, one capture per viewport of one
surface, and the reviewer "has no browser". With only one route captured, there is no second route
to compare.

## 4. Next.js App Router: shared layout

"A layout is UI that is **shared** between multiple pages. On navigation, layouts preserve state,
remain interactive, and do not rerender." "The root layout is **required** and must contain `html`
and `body` tags." Layouts nest: "layouts in the folder hierarchy are also nested, which means they
wrap child layouts via their `children` prop."
https://nextjs.org/docs/app/getting-started/layouts-and-pages (Next.js 16.3.6, doc lastUpdated 2026-08-25; read 2026-09-23)
Structurally, the chrome goes in `app/layout.tsx` (or a route-group layout) and the page renders
only into `{children}`. A page then cannot add to the header band except through what the layout
exposes, such as parallel-route slots (`LayoutProps` named slots, same page). The docs say layouts
are *shared and not re-rendered*; they say nothing about identical height. Height stays fixed only
if the layout's CSS fixes it and pages are kept out of it.

## What this suggests for the hook text

- Option A: name it in industry terms: "the app shell / global header is persistent and identical on every route; page title, actions, search, filters and metrics live in the page header inside the content (Carbon, GOV.UK, Atlassian, Polaris)."
- Option B: add the mechanism: "chrome in a shared layout (Next.js `layout.tsx` or the framework's equivalent), fixed height; `html { scrollbar-gutter: stable }` (Baseline 2024)."
- Option C: add the check: "before showing, measure the header height and content x/width on every route with the Playwright or Chrome DevTools MCP (`boundingBox` / `getBoundingClientRect`) and they must match; optionally one shared `toHaveScreenshot` of the header with the active nav masked."
- Option D: say which scope the check covers: it applies across routes, which CLS, Impeccable's detector and its finish reviewer (one surface, desktop + mobile) do not cover.
- Trade: A alone costs one line but leaves the check to the model's judgement; C is the part that would have caught this case but adds a step to every multi-route build.
