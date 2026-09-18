/* Two custom marks so trace-cost has a named span to sum between, and a scroll
 * handler that does enough work to show up in a trace. */
performance.mark('composition:start');

let ticks = 0;
addEventListener(
  'scroll',
  () => {
    ticks += 1;
    document.documentElement.style.setProperty('--scroll', String(window.scrollY));
  },
  { passive: true },
);

addEventListener('load', () => {
  performance.mark('composition:end');
  performance.measure('composition', 'composition:start', 'composition:end');
  document.documentElement.dataset.ticks = String(ticks);
});
