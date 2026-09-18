/*
 * Shared runtime for every measurement script: config loading, browser contexts
 * by width class, font readiness, full-page scroll, and the JSON envelope.
 *
 * Every script takes the measure config path as its first argument and prints
 * one JSON object to stdout. Diagnostics go to stderr, so a caller can pipe
 * stdout straight into `jq` or a test.
 *
 * The browser is launched once per script run and closed at the end. These are
 * standalone scripts, not a Playwright test suite: there are no fixtures, and
 * holding a context open past one run is what makes results disagree between
 * runs.
 *
 * The config contract is documented in ../../CONFIG.md; `loadConfig` is the
 * single place it is enforced, so a script never has to check its own inputs.
 */
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

export const DEFAULT_WIDTHS = [
  { name: 'mobile', width: 375, height: 812, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
];

export async function loadConfig(argvPath) {
  const path = argvPath || process.env.MEASURE_CONFIG;
  if (!path) {
    throw new Error('missing measure config: pass its path as the first argument, or set MEASURE_CONFIG');
  }
  const loaded = await import(pathToFileURL(resolve(path)).href);
  const config = loaded.default ?? loaded;

  if (!config.baseUrl) throw new Error(`${path}: baseUrl is required`);
  const routes = config.routes?.length ? config.routes : ['/'];
  const widths = config.widths?.length ? config.widths : DEFAULT_WIDTHS;
  for (const width of widths) {
    if (!width.name || !width.width) throw new Error(`${path}: every width class needs a name and a width`);
  }

  return {
    ...config,
    baseUrl: config.baseUrl.replace(/\/$/, ''),
    routes,
    widths: widths.map((width) => ({ height: 900, deviceScaleFactor: 1, ...width })),
    selectors: config.selectors ?? {},
    outDir: config.outDir ?? '.scratch/measure',
  };
}

export function urlFor(config, route) {
  return `${config.baseUrl}${route.startsWith('/') ? route : `/${route}`}`;
}

export function selectorFor(config, name) {
  const selector = config.selectors[name];
  if (!selector) {
    throw new Error(`measure config has no selectors.${name}; this script cannot guess it — see CONFIG.md`);
  }
  return selector;
}

export async function withBrowser(run) {
  const browser = await chromium.launch();
  try {
    return await run(browser);
  } finally {
    await browser.close();
  }
}

/* Opens one page at a width class, navigates, and leaves it ready to measure:
 * fonts resolved and every lazy asset triggered by a full scroll. Closes the
 * context even when `run` throws, so one failing route does not leak the rest. */
export async function onPage(browser, config, widthClass, route, run) {
  const context = await browser.newContext({
    viewport: { width: widthClass.width, height: widthClass.height },
    deviceScaleFactor: widthClass.deviceScaleFactor,
    isMobile: widthClass.width < 768,
    hasTouch: widthClass.width < 768,
  });
  const page = await context.newPage();
  try {
    await page.goto(urlFor(config, route), { waitUntil: 'load' });
    await waitForFonts(page);
    await scrollFullPage(page);
    return await run(page);
  } finally {
    await context.close();
  }
}

export async function waitForFonts(page) {
  await page.evaluate(() => document.fonts.ready);
}

/* Lazy images and scroll-triggered motion only exist after the page has been
 * scrolled through. Steps by viewport height rather than jumping to the bottom,
 * because a jump skips the observers that a real visitor trips. */
export async function scrollFullPage(page, settleMs = 120) {
  await page.evaluate(async (settle) => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, settle));
    }
    window.scrollTo(0, 0);
    await new Promise((done) => setTimeout(done, settle));
  }, settleMs);
}

export function report(measurement, config, results, extra = {}) {
  process.stdout.write(
    JSON.stringify(
      {
        measurement,
        generatedAt: new Date().toISOString(),
        baseUrl: config.baseUrl,
        results,
        ...extra,
      },
      null,
      2,
    ) + '\n',
  );
}

/* Scripts are run by hand and by the shape test; a thrown error has to be
 * readable in a terminal and has to fail the test, so: message on stderr,
 * non-zero exit, no stack unless DEBUG is set. */
export function run(main) {
  main(process.argv[2]).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    if (process.env.DEBUG) process.stderr.write(`${error.stack}\n`);
    process.exit(1);
  });
}
