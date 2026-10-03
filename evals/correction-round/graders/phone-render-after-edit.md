---
type: regex
target: trace
pattern: '\\?"name\\?":\s*\\?"(?:Edit|Write)\\?"(?![\s\S]*\\?"name\\?":\s*\\?"(?:Edit|Write)\\?")[\s\S]*chrome-devtools__emulate\\?",\s*\\?"input\\?":\s*\{[^}]*\\?"viewport\\?":\s*\\?"[3-7]\d\dx\d+[\s\S]*chrome-devtools__take_screenshot'
---

After the session's last Edit or Write, the viewport is emulated at a phone width (under 800px) and a
screenshot is taken. A regex over the whole trace, because an `llm` judge sees only the first and
last 12 messages and missed a render that sat in the middle (2026-10-03).
