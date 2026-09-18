/* What the measurement scripts cannot guess about this project.
 * Contract and field meanings: CONFIG.md in the devio plugin's measure skill. */
export default {
  // A build on a fixed port, not the dev server, when numbers get compared.
  baseUrl: process.env.MEASURE_BASE_URL ?? 'http://localhost:3000',

  // The screens whose composition is judged. Every route multiplies every run.
  routes: ['/'],

  widths: [
    { name: 'mobile', width: 375, height: 812, deviceScaleFactor: 2 },
    { name: 'desktop', width: 1440, height: 900 },
  ],

  // Replace every placeholder with this project's own selectors. A script whose
  // selector is missing stops and names the key; it never guesses.
  selectors: {
    textOverPhoto: '', // text sitting on a photo or a video
    junctions: '', // the boundaries between sections
    textBlocks: '', // titles, leads and card headings worth reading line by line
    hiddenText: '', // text nothing should ever focus, such as pending skeletons
  },

  outDir: '.scratch/measure',
};
