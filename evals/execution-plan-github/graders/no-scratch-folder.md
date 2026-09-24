---
type: file_exists
path: '.scratch/**'
exists: false
---

Passes when the session wrote nothing under `.scratch/`: this project keeps its tickets on GitHub,
so the local tracker's folder does not exist and the plan does not go there.
