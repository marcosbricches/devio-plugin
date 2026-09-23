---
plugins: ["../../.eval-deps/devio","../../.eval-deps/impeccable","../../.eval-deps/gsap-skills","../../.eval-deps/mattpocock-skills","../../.eval-deps/context7","../../.eval-deps/playwright","../../.eval-deps/vercel"]
description: A hero composed from references opens the reference images.
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

I need the hero section for Tanoa, a specialty coffee subscription. I saved two references in `references/`: take the typography and the warmth from `forno.png`, and the layout, centred with the product shown below the call to action, from `relay.png`. Reply with the HTML and CSS of the hero only.
