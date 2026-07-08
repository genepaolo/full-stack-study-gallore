---
type: meta
title: "Hot Cache"
updated: 2026-07-07T21:15:00
---

# Recent Context

## Last Updated
2026-07-07. Added a **Vitest test suite** for correctness and set the **content source of truth**.

## Key Recent Facts
- **61 tests / 6 files** in `client/tests/` (run `npm test`): content integrity, curriculum +
  glossary helpers, every snippet compiles (esbuild), taught vanilla utilities execute correctly,
  and offline ProgressContext logic. All green. Map: [[testing]].
- `lesson-code.test.js` runs in **node env** (`// @vitest-environment node`) — esbuild fails under
  jsdom's Uint8Array realm. `setup.js` guards `localStorage` for node-env files.
- **Source of truth = Frontend Interview Handbook** (public sources like MDN when paywalled); teach
  canonical answers; correctness is test-enforced. See `CONTENT.md` / [[content-sources]].
- `npm audit`: 5 findings all from esbuild's **dev-server** advisory via vite/vitest — dev-only, not
  in the static prod build. Not force-fixing (would break vite 6 / vitest 2). → [[decisions]] #15–16.

## Active Threads
- **Chrome DevTools MCP not connected** + design skills uninstalled → no in-browser screenshot pass.
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- **Backlog**: more lessons/module (+ taught-logic assertions); per-lesson notes UI; mobile nav;
  visual polish; optional GitHub Actions to run `npm ci && npm test && npm run build`.
