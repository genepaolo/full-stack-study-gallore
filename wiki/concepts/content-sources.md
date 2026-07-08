---
type: reference
title: "Content sources & source of truth"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [reference, content, quality]
---

# Content sources & source of truth

Per owner (2026-07-07): the **Frontend Interview Handbook**
(https://www.frontendinterviewhandbook.com/) is the **source of truth** for topics, canonical
solutions, and "what interviewers probe." When a topic is behind the handbook's paywall, cross-check
against reputable public sources (MDN, specs, official React/Node/Express/Mongo docs, widely-cited
community solutions) and teach the **canonical** answer, not a clever variant.

- The handbook homepage returns 403 to automated fetches — rely on its public examples + MDN etc.
- Correctness is **test-enforced**: [[testing]] `taught-logic.test.js` runs the real lesson code and
  asserts canonical behavior; `lesson-code.test.js` proves every snippet compiles.
- Authoring a lesson: verify vs handbook/MDN → add the lesson → add/extend a `taught-logic` assertion
  → `npm test` green. Full guide: repo `CONTENT.md`.

→ [[decisions]] #16.
