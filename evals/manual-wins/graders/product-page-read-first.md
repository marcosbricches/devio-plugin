---
type: regex
target: trace
pattern: '(?<![\s\S])(?:(?!"name":"(?:Write|Edit)","input":\{(?:"\w+":(?:"(?:[^"\\]|\\.)*"|true|false|null|-?\d+),)*"file_path":"(?:[^"\\\n]|\\.)*screen\.html")[\s\S])*?"name":"Read","input":\{(?:"\w+":(?:"(?:[^"\\]|\\.)*"|true|false|null|-?\d+),)*"file_path":"(?:[^"\\\n]|\\.)*05-product-page-press-queue\.png"'
---

The manual's product page for the surface, `05-product-page-press-queue.png`, is opened with `Read`
before the first Write or Edit of `screen.html`. Matches a tool call's own input, so the skill's text,
returned by the Skill tool, does not count.
