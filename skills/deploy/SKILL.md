---
name: deploy
description: Deploy, publish or put live any project, to the company VPS or to Vercel, even a single static page. Use before any vercel: skill or deploy command.
---

# One Docker image for every target

The designer's standard ([ADR 0002](../../docs/adr/0002-every-deploy-ships-one-docker-image.md)):
the image tested is the image that runs.

1. Write `Dockerfile`, `compose.yaml` and `.dockerignore` in the shape `docker init` writes, from
   Docker's docs through context7. `docker init` itself is interactive only.
2. **VPS**: it runs the image with Docker Compose.
3. **Vercel**: it runs the image as a container-image Function, through the `vercel:` skills, which
   inspect the Vercel project before anything is pushed.

## Gotchas

- Vercel's container images are a beta enabled per account: stateless, scaled to zero after 5
  minutes without traffic, no static IPs (vercel.com/docs/functions/container-images, read
  2026-09-23). The designer chose this knowing it, Next.js included.
