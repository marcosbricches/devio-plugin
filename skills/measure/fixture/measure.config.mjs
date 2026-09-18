/* The sample config, and the one the shape test runs against. A project's own
 * copy is this file with its own baseUrl, routes and selectors — see CONFIG.md. */
export default {
  baseUrl: process.env.FIXTURE_BASE_URL ?? 'http://localhost:4322',
  routes: ['/', '/second.html'],
  widths: [
    { name: 'mobile', width: 375, height: 812, deviceScaleFactor: 2 },
    { name: 'desktop', width: 1440, height: 900 },
  ],
  selectors: {
    textOverPhoto: '.hero__title, .hero__lead',
    junctions: '[data-junction]',
    textBlocks: 'h1, h2, .lead, .card__title',
    hiddenText: '[data-pending] *',
  },
  outDir: process.env.MEASURE_OUT_DIR ?? '.scratch/measure',
};
