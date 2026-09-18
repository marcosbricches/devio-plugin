/*
 * node scroll-junctions.mjs <measure.config.mjs> — three screenshots of each
 * junction as it crosses the viewport: entering (0 %), centred (50 %) and
 * leaving (100 %), per route and per width class.
 *
 * A junction is where one section hands over to the next, and it is the part of
 * a page a static full-page capture never shows: the full capture proves the
 * sections exist, not that the seam between them reads while scrolling past it.
 *
 * 0 / 50 / 100 % is the junction's course through the viewport, not the page's
 * scroll: 0 % puts the junction's top edge at the bottom of the viewport, 100 %
 * at the top. Clamped to the document, so a junction near either end of the
 * page reports the scroll position it actually reached.
 *
 * Files are <route>@<width>--<junction>--<phase>.png in the config's outDir.
 */
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { loadConfig, onPage, report, run, selectorFor, urlFor, withBrowser } from './lib/measure.mjs';

const PHASES = [0, 50, 100];
const slug = (value) => value.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-') || 'index';

run(async (configPath) => {
  const config = await loadConfig(configPath);
  const selector = selectorFor(config, 'junctions');
  const outDir = resolve(config.outDir);
  await mkdir(outDir, { recursive: true });

  const results = await withBrowser(async (browser) => {
    const shots = [];
    for (const route of config.routes) {
      for (const widthClass of config.widths) {
        const taken = await onPage(browser, config, widthClass, route, async (page) => {
          const junctions = await page.evaluate(collectJunctions, selector);
          const perJunction = [];
          for (const junction of junctions) {
            for (const phase of PHASES) {
              const scrollY = await page.evaluate(scrollToPhase, { top: junction.top, phase });
              const file = join(
                outDir,
                `${slug(route)}@${widthClass.name}--${slug(junction.name)}--${phase}.png`,
              );
              await page.screenshot({ path: file });
              perJunction.push({ junction: junction.name, top: junction.top, phase, scrollY, file });
            }
          }
          return perJunction;
        });
        for (const shot of taken) {
          shots.push({ route, url: urlFor(config, route), widthClass: widthClass.name, ...shot });
        }
      }
    }
    return shots;
  });

  report('scroll-junctions', config, results, { selector, outDir, phases: PHASES });
});

function collectJunctions(selector) {
  return [...document.querySelectorAll(selector)].map((element, index) => ({
    name: element.dataset.junction || element.id || `${element.tagName.toLowerCase()}-${index}`,
    top: element.getBoundingClientRect().top + window.scrollY,
  }));
}

async function scrollToPhase({ top, phase }) {
  const travel = window.innerHeight * (phase / 100);
  const target = Math.max(0, Math.min(top - window.innerHeight + travel, document.body.scrollHeight - window.innerHeight));
  window.scrollTo(0, target);
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  return Math.round(window.scrollY);
}
