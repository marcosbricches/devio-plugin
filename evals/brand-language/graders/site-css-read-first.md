---
type: regex
target: trace
pattern: '(?<![\s\S])(?:(?!"name":"(?:Write|Edit)","input":\{[^}]*screen\.html)[\s\S])*(?:"name":"Read","input":\{"file_path":"[^"]*site(?:\\\\|/)styles\.css|"name":"mcp__plugin_chrome-devtools-mcp_chrome-devtools__evaluate_script","input":\{[^\n]*?getComputedStyle)'
---

The client's site styles are read, with Read on `site/styles.css` or with `evaluate_script` calling
`getComputedStyle` on the open site, before the first Write or Edit of screen.html. A regex over the
whole trace, because the order of the work is not something an `llm` judge sees past its first and
last 12 messages. It matches a tool call's own input, so the skill's text, returned by the Skill
tool, does not count.
