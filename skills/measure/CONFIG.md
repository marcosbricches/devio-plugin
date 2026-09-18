# The measure config

One file per project, at the repository root, named `measure.config.mjs`. It holds what the measurement scripts cannot guess: where the site is, which routes matter, which widths to test, and which elements each measurement is about.

Every script takes its path as the first argument:

```bash
node <plugin>/skills/measure/scripts/capture.mjs ./measure.config.mjs
```

`<plugin>` is this plugin's root, resolved as the [measure skill](SKILL.md) describes. `MEASURE_CONFIG` works as a fallback when the argument is omitted.

## Shape

```js
export default {
  baseUrl: 'http://localhost:3000',

  routes: ['/', '/tours', '/tours/official'],

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

  outDir: '.scratch/measure',
};
```

## Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `baseUrl` | yes | Where the site is being served. A build served on a fixed port, not the dev server, when the numbers have to be comparable between runs. A trailing slash is stripped. |
| `routes` | no, defaults to `['/']` | The routes measured, as paths. Keep it to the screens whose composition is being judged; every route multiplies every run. |
| `widths` | no, defaults to mobile 375×812 @2x and desktop 1440×900 | Width classes. `name` is what appears in the JSON and in capture filenames. Under 768 px the context is given touch and `isMobile`. |
| `selectors.textOverPhoto` | for `contrast-on-photo` | The text elements sitting on a photo or a video. |
| `selectors.junctions` | for `scroll-junctions` | The boundaries between sections, where one composition hands over to the next. |
| `selectors.textBlocks` | for `line-breaks` | The text whose line breaks are worth reading — titles, leads, card headings. |
| `selectors.hiddenText` | for `focus-path` | Text that should never be reached, such as skeletons for pending content. |
| `outDir` | no, defaults to `.scratch/measure` | Where scripts write files. Relative paths resolve from where the command runs. |

A script that needs a selector the config does not define stops with the name of the missing key. It never falls back to a guessed class name — a measurement of the wrong element is worse than no measurement.

## Output

Every script prints one JSON object to stdout and nothing else; diagnostics go to stderr.

```json
{
  "measurement": "capture",
  "generatedAt": "2026-09-18T12:00:00.000Z",
  "baseUrl": "http://localhost:3000",
  "results": []
}
```

`results` is an array whose items are documented per script in `SKILL.md`. The four envelope fields are what the shape test asserts on, so they are stable across scripts and across versions.
