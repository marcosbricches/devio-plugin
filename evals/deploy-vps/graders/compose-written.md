---
type: file_exists
path: '*compose.y*ml'
---

Passes when the session wrote the Compose file the VPS runs the image with. The glob takes both the
current `compose.yaml` and the older `docker-compose.yml` names.
