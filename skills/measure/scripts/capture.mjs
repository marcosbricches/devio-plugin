/*
 * node capture.mjs <measure.config.mjs> — one full-page screenshot per route
 * per width class, written into the config's outDir.
 *
 * The image is the evidence a critique is argued from, so it is taken after
 * fonts resolve and after a full scroll: a capture of a page whose photos never
 * loaded shows a composition nobody will ever see.
 *
 * Files are named <route>@<width>.png, with the route slugified, so a second
 * run overwrites the first instead of piling up rounds. Keep a round by copying
 * the folder, not by expecting the script to version it.
 */
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadConfig, onPage, report, run, urlFor, withBrowser } from './lib/measure.mjs';

const slug = (route) => route.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-') || 'index';

run(async (configPath) => {
  const config = await loadConfig(configPath);
  const outDir = resolve(config.outDir);
  await mkdir(outDir, { recursive: true });

  const results = await withBrowser(async (browser) => {
    const captured = [];
    for (const route of config.routes) {
      for (const widthClass of config.widths) {
        const file = join(outDir, `${slug(route)}@${widthClass.name}.png`);
        const size = await onPage(browser, config, widthClass, route, async (page) => {
          await page.screenshot({ path: file, fullPage: true });
          return page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
          }));
        });
        captured.push({
          route,
          url: urlFor(config, route),
          widthClass: widthClass.name,
          viewport: { width: widthClass.width, height: widthClass.height },
          documentSize: size,
          file,
        });
      }
    }
    return captured;
  });

  report('capture', config, results, { outDir });
});
