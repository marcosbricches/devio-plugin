/*
 * node contrast-on-photo.mjs <measure.config.mjs> — per-pixel contrast under
 * each line of text sitting on a photo, per route and per width class.
 *
 * axe-core and every other automated checker compares a text colour to a flat
 * background colour. Over a photograph there is no flat background: the same
 * line can clear 7:1 on its left half and fail at 2:1 where the sun is. So this
 * measures the real composed pixels, line by line.
 *
 * Lines come from `Range.getClientRects()`, never from height / line-height —
 * that division is wrong the moment a line wraps oddly, a font falls back, or
 * the block has padding.
 *
 * The background is read by hiding only the glyphs (`color: transparent`, which
 * changes no layout), screenshotting, and handing the PNG back to the browser
 * to decode into a canvas. Any scrim, gradient or overlay between photo and
 * text stays in the measurement, because it is part of the composition.
 *
 * Asserts nothing. WCAG's 4.5 and 3.0 appear as the share of pixels below them,
 * because the decision — move the text, darken the scrim, recrop the photo — is
 * the designer's.
 */
import { loadConfig, onPage, report, run, selectorFor, urlFor, withBrowser } from './lib/measure.mjs';

const SAMPLE_CAP = 4000;

run(async (configPath) => {
  const config = await loadConfig(configPath);
  const selector = selectorFor(config, 'textOverPhoto');

  const results = await withBrowser(async (browser) => {
    const lines = [];
    for (const route of config.routes) {
      for (const widthClass of config.widths) {
        const measured = await onPage(browser, config, widthClass, route, async (page) => {
          const rects = await page.evaluate(collectLineRects, selector);
          if (rects.length === 0) return [];

          await page.evaluate(hideGlyphs, selector);
          const png = (await page.screenshot({ fullPage: true })).toString('base64');
          await page.evaluate(showGlyphs, selector);

          return page.evaluate(contrastPerLine, {
            png,
            rects,
            scale: widthClass.deviceScaleFactor,
            cap: SAMPLE_CAP,
          });
        });
        for (const line of measured) {
          lines.push({ route, url: urlFor(config, route), widthClass: widthClass.name, ...line });
        }
      }
    }
    return lines;
  });

  report('contrast-on-photo', config, results, { selector });
});

/* Runs in the page. One entry per rendered line, in document coordinates. */
function collectLineRects(selector) {
  const lines = [];
  for (const element of document.querySelectorAll(selector)) {
    const colour = getComputedStyle(element).color;
    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = [...range.getClientRects()].filter((rect) => rect.width > 1 && rect.height > 1);
    rects.forEach((rect, index) => {
      lines.push({
        selector,
        tag: element.tagName.toLowerCase(),
        className: element.className || null,
        lineIndex: index,
        text: (element.textContent || '').trim().slice(0, 80),
        colour,
        rect: {
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
      });
    });
  }
  return lines;
}

function hideGlyphs(selector) {
  for (const element of document.querySelectorAll(selector)) {
    element.dataset.measureColour = element.style.color;
    element.style.color = 'transparent';
    element.style.textShadow = 'none';
  }
}

function showGlyphs(selector) {
  for (const element of document.querySelectorAll(selector)) {
    element.style.color = element.dataset.measureColour || '';
    delete element.dataset.measureColour;
  }
}

/* Runs in the page: decodes the screenshot into a canvas and samples the
 * background under each line. Kept in one function because everything it
 * touches — ImageBitmap, OffscreenCanvas — only exists browser-side. */
async function contrastPerLine({ png, rects, scale, cap }) {
  const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(bitmap, 0, 0);

  const channel = (value) => {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

  const parsed = (colour) => {
    const [r, g, b] = colour.match(/[\d.]+/g).map(Number);
    return luminance(r, g, b);
  };

  return rects.map((line) => {
    const x = Math.max(0, Math.round(line.rect.x * scale));
    const y = Math.max(0, Math.round(line.rect.y * scale));
    const width = Math.max(1, Math.min(Math.round(line.rect.width * scale), canvas.width - x));
    const height = Math.max(1, Math.min(Math.round(line.rect.height * scale), canvas.height - y));
    const { data } = context.getImageData(x, y, width, height);

    const textLuminance = parsed(line.colour);
    const stride = Math.max(1, Math.ceil((width * height) / cap));
    const ratios = [];
    for (let pixel = 0; pixel < width * height; pixel += stride) {
      const offset = pixel * 4;
      ratios.push(ratio(textLuminance, luminance(data[offset], data[offset + 1], data[offset + 2])));
    }
    ratios.sort((a, b) => a - b);

    const below = (bar) => ratios.filter((value) => value < bar).length / ratios.length;
    return {
      selector: line.selector,
      tag: line.tag,
      className: line.className,
      lineIndex: line.lineIndex,
      text: line.text,
      colour: line.colour,
      rect: line.rect,
      samples: ratios.length,
      minContrast: Number(ratios[0].toFixed(2)),
      medianContrast: Number(ratios[Math.floor(ratios.length / 2)].toFixed(2)),
      maxContrast: Number(ratios[ratios.length - 1].toFixed(2)),
      shareBelow4_5: Number(below(4.5).toFixed(3)),
      shareBelow3: Number(below(3).toFixed(3)),
    };
  });
}
