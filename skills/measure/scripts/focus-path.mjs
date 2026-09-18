/*
 * node focus-path.mjs <measure.config.mjs> — the keyboard path through each
 * route: stop order, whether the way back mirrors the way there, whether every
 * stop shows a ring, and whether every stop is big enough to hit.
 *
 * Automation can decide these four and nothing else about keyboard use; the
 * judgement — does the order tell the page's story — stays with the person
 * doing the manual pass. This exists so that person reads the order before
 * picking up the keyboard, instead of discovering it one Tab at a time.
 *
 * The ring is detected by comparing outline and box-shadow while focused
 * against the element's resting style, which is what catches the ring removed
 * by a reset and never given back.
 *
 * Target size is the 24x24 CSS-pixel floor of WCAG 2.2 AA (2.5.8), measured on
 * the focusable element's own box.
 */
import { loadConfig, onPage, report, run, urlFor, withBrowser } from './lib/measure.mjs';

const MAX_STOPS = 120;
const MIN_TARGET = 24;

run(async (configPath) => {
  const config = await loadConfig(configPath);
  const hiddenText = config.selectors.hiddenText ?? null;

  const results = await withBrowser(async (browser) => {
    const routes = [];
    for (const route of config.routes) {
      for (const widthClass of config.widths) {
        const path = await onPage(browser, config, widthClass, route, async (page) => {
          const forward = await walk(page, 'Tab', hiddenText);
          const backward = await walk(page, 'Shift+Tab', hiddenText);
          const mirrored = [...backward].reverse();
          return {
            stops: forward,
            returnSymmetric:
              forward.length === mirrored.length &&
              forward.every((stop, index) => stop.signature === mirrored[index]?.signature),
            stopsWithoutRing: forward.filter((stop) => !stop.hasRing).map((stop) => stop.signature),
            stopsUnderTarget: forward
              .filter((stop) => stop.rect.width < MIN_TARGET || stop.rect.height < MIN_TARGET)
              .map((stop) => stop.signature),
            stopsInHiddenText: forward.filter((stop) => stop.inHiddenText).map((stop) => stop.signature),
          };
        });
        routes.push({
          route,
          url: urlFor(config, route),
          widthClass: widthClass.name,
          stopCount: path.stops.length,
          ...path,
        });
      }
    }
    return routes;
  });

  report('focus-path', config, results, { minTargetPx: MIN_TARGET, maxStops: MAX_STOPS });
});

async function walk(page, key, hiddenText) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  const stops = [];
  for (let step = 0; step < MAX_STOPS; step += 1) {
    await page.keyboard.press(key);
    const stop = await page.evaluate(describeFocus, hiddenText);
    if (!stop || stop.alreadyVisited) break;
    stops.push(stop);
  }
  await page.evaluate(() => {
    for (const element of document.querySelectorAll('[data-measure-visited]')) {
      delete element.dataset.measureVisited;
    }
  });
  return stops;
}

function describeFocus(hiddenText) {
  const element = document.activeElement;
  if (!element || element === document.body || element === document.documentElement) return null;

  if (element.dataset.measureVisited) return { alreadyVisited: true };
  element.dataset.measureVisited = '1';

  const rect = element.getBoundingClientRect();
  const focused = getComputedStyle(element);
  const ringWhileFocused = `${focused.outlineStyle}|${focused.outlineWidth}|${focused.boxShadow}`;

  element.blur();
  const resting = getComputedStyle(element);
  const ringWhileResting = `${resting.outlineStyle}|${resting.outlineWidth}|${resting.boxShadow}`;
  element.focus();

  const visibleRing =
    focused.outlineStyle !== 'none' && parseFloat(focused.outlineWidth) > 0
      ? true
      : ringWhileFocused !== ringWhileResting;

  const name =
    element.getAttribute('aria-label') ||
    element.textContent?.trim().slice(0, 60) ||
    element.getAttribute('title') ||
    element.getAttribute('alt') ||
    '';

  return {
    tag: element.tagName.toLowerCase(),
    name,
    signature: `${element.tagName.toLowerCase()}:${name}`,
    href: element.getAttribute('href') ?? null,
    hasRing: visibleRing,
    inHiddenText: Boolean(hiddenText && element.closest(hiddenText)),
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y + window.scrollY),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
  };
}
