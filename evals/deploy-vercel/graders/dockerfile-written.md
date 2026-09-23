---
type: file_exists
path: 'Dockerfile*'
---

Passes when the session wrote the project's Dockerfile: a deploy ships one Docker image, and Vercel
runs that same image. `Dockerfile.vercel` counts too.
