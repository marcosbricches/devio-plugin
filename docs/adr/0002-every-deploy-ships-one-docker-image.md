# Every deploy ships one Docker image

The designer deploys most projects to the company's VPS, which runs Docker, and some to Vercel. So a
deploy builds one Docker image, from a `Dockerfile`, `compose.yaml` and `.dockerignore` in the shape
`docker init` writes. The VPS runs it with Docker Compose, and Vercel runs the same image as a
container-image Function, reached through the `vercel:` skills. Decided by the designer on
2026-09-23.

The trade accepted: on Vercel, container images are a beta that each account must have enabled, run
as stateless Functions that scale to zero after 5 minutes without traffic, and have no static IPs
(vercel.com/docs/functions/container-images, updated 2026-07-07, read 2026-09-23). A framework Vercel
builds natively, such as Next.js, gives up the native build that Vercel's own skill prefers ("Prefer
a native Functions runtime for supported frameworks", `vercel:create-a-backend` in vercel 0.50.0,
read 2026-09-23). What is gained is that the image tested is the image that runs, wherever it runs.

`docker init` is interactive only (docs.docker.com/reference/cli/docker/init, read 2026-09-23), so
the session writes the same three files from Docker's docs through context7. No Docker plugin exists
in `claude-plugins-official` or the other installed marketplaces (searched 2026-09-23).
