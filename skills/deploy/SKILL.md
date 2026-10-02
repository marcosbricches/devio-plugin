---
name: deploy
description: Deploy, publish or put live any project through Devio's CD, even a single static page, and set up its CI. Use for any deploy, when a project has no CI workflow, and to keep a devio.codes review host out of search engines.
---

# One Docker image, published by Devio's CD; CI that reports

The designer's standard (ADR 0002, decided 2026-10-01): every project ships as one Docker image, and
the devio.codes panel publishes it on each push to `main`. One call sets up the whole pipeline:

1. Write `Dockerfile`, `compose.yaml` and `.dockerignore` in the shape `docker init` writes, from
   Docker's docs through context7. `docker init` itself is interactive only.
2. Write one GitHub Actions workflow, `.github/workflows/ci.yml`, that runs the project's existing
   gate script (the `package.json` script that runs its full check, such as `verificar`) on each
   push and pull request, on `ubuntu-latest`. Write it from GitHub's "Building and testing Node.js"
   guide and the framework's docs through context7, not from memory, action versions included. A
   project with no gate script still gets the workflow, with the steps of GitHub's Node.js starter
   workflow (actions/starter-workflows, `ci/node.js.yml`, read 2026-10-02): `npm ci`,
   `npm run build --if-present`, `npm test --if-present`. Say in the reply that this CI checks less
   than a gate would.
3. CI only reports. The workflow neither builds nor publishes the image: publishing stays with the
   panel, unchanged.
4. Every deploy keeps the review host out of search engines. The panel serves a project's review
   under `devio.codes` (as `viva-maracana-design.devio.codes`), and on such a host every
   page answers `noindex`, through the framework's robots metadata or an `X-Robots-Tag: noindex`
   header. The site's hostname decides it (`.endsWith('.devio.codes')`), not `NODE_ENV`, which is
   `production` on both; the client's own domain stays indexable. Asked by Devio's developers on
   2026-10-01 (ADR 0002).

Pushing to `main` puts the project live. GitHub then shows a pass or fail mark beside the commit; a
failed run is read with `gh run view <run-id> --log-failed` and fixed by the session, not handed to
the designer.

## Gotchas

- GitHub Actions on private repositories: 2,000 minutes a month on GitHub Free, 3,000 on Pro and
  Team (docs.github.com, GitHub Actions billing, read 2026-10-01). Run the gate once per push, not
  a matrix of versions.
- The `test` script `npm init` writes (`echo "Error: no test specified" && exit 1`) is present, so
  `--if-present` runs it and CI fails. Drop the test step while that placeholder is the script.
- A review host is never `Disallow`ed in `robots.txt`: a crawler blocked there never reads the
  `noindex`, and the page can stay in results through links (Google Search Central, "Block
  indexing with noindex", read 2026-10-01). A page already indexed leaves faster through Search
  Console's removals.
