---
name: deploy
description: Deploy, publish or put live any project through Devio's CD, even a single static page, and set up its CI. Use for any deploy, and when a project has a gate script and no CI workflow.
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
   project with no gate script gets no workflow: say so in the reply instead of inventing a gate.
3. CI only reports. The workflow neither builds nor publishes the image: publishing stays with the
   panel, unchanged.

Pushing to `main` puts the project live. GitHub then shows a pass or fail mark beside the commit; a
failed run is read with `gh run view <run-id> --log-failed` and fixed by the session, not handed to
the designer.

## Gotchas

- GitHub Actions on private repositories: 2,000 minutes a month on GitHub Free, 3,000 on Pro and
  Team (docs.github.com, GitHub Actions billing, read 2026-10-01). Run the gate once per push, not
  a matrix of versions.
