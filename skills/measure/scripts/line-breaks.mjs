/*
 * node line-breaks.mjs <measure.config.mjs> — how each text block actually
 * breaks at every configured width, line by line.
 *
 * A title reads differently when its second line is one word, and no amount of
 * looking at desktop tells you what 375 px does to it. This prints the real
 * lines so a break can be argued about — and fixed with a rewrite, a measure
 * change or a non-breaking space — before the screen goes to a client.
 *
 * Lines come from `Range.getClientRects()` over the block's own text, grouped
 * by the top of each rect. Never height / line-height: that is wrong whenever a
 * font falls back, a line wraps around an inline image, or the block has
 * padding.
 *
 * `widow` flags a last line under a fifth of the block's widest line — the
 * break most often worth fixing.
 */
import { loadConfig, onPage, report, run, selectorFor, urlFor, withBrowser } from './lib/measure.mjs';

run(async (configPath) => {
  const config = await loadConfig(configPath);
  const selector = selectorFor(config, 'textBlocks');

  const results = await withBrowser(async (browser) => {
    const blocks = [];
    for (const route of config.routes) {
      for (const widthClass of config.widths) {
        const measured = await onPage(browser, config, widthClass, route, (page) =>
          page.evaluate(linesPerBlock, selector),
        );
        for (const block of measured) {
          blocks.push({ route, url: urlFor(config, route), widthClass: widthClass.name, ...block });
        }
      }
    }
    return blocks;
  });

  report('line-breaks', config, results, { selector });
});

function linesPerBlock(selector) {
  const WIDOW_SHARE = 0.2;

  const textNodes = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.textContent.trim()) nodes.push(node);
    }
    return nodes;
  };

  return [...document.querySelectorAll(selector)]
    .map((element) => {
      const range = document.createRange();
      const lines = [];
      for (const node of textNodes(element)) {
        for (let index = 0; index < node.textContent.length; index += 1) {
          range.setStart(node, index);
          range.setEnd(node, index + 1);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;
          const top = Math.round(rect.top);
          const current = lines[lines.length - 1];
          if (!current || Math.abs(current.top - top) > 2) {
            lines.push({ top, left: rect.left, right: rect.right, text: node.textContent[index] });
          } else {
            current.left = Math.min(current.left, rect.left);
            current.right = Math.max(current.right, rect.right);
            current.text += node.textContent[index];
          }
        }
      }

      const measured = lines.map((line) => ({
        text: line.text.trim(),
        width: Number((line.right - line.left).toFixed(1)),
      }));
      const widest = Math.max(1, ...measured.map((line) => line.width));
      const last = measured[measured.length - 1];

      return {
        selector,
        tag: element.tagName.toLowerCase(),
        className: element.className || null,
        fontSize: getComputedStyle(element).fontSize,
        lineCount: measured.length,
        widestLine: widest,
        widow: Boolean(last && measured.length > 1 && last.width / widest < WIDOW_SHARE),
        lines: measured,
      };
    })
    .filter((block) => block.lineCount > 0);
}
