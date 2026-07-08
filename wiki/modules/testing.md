---
type: module
title: "testing"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [module, testing, quality]
---

# testing

Vitest suite in **`client/tests/`** (separate from `src`). Run with `npm test`. 61 tests / 6 files.

## Layout
- `setup.js` — jest-dom matchers; clears `localStorage` per test (guarded for node-env files).
- `unit/content-integrity.test.js` — unique ids, valid module/track refs, required fields, enum
  checks, editor lessons ship starter code, unique order per module.
- `unit/curriculum.test.js` — `modulesForTrack` (level-sorted), `lessonsForModule` (order-sorted),
  `siblingLessons` prev/next boundaries, lookups, `countLessons`.
- `unit/glossary.test.js` — `buildGlossary` dedupe/sort + back-links resolve.
- `unit/lesson-code.test.js` — **every** starter/solution snippet compiles (esbuild). Runs in the
  **node** environment (`// @vitest-environment node`) — esbuild's load invariant fails under jsdom.
- `unit/taught-logic.test.js` — executes the REAL vanilla lesson code and asserts canonical behavior
  (debounce, promiseAll, decodeJwt, password verify, middleware chain, CRUD status codes). This is
  the study-material correctness guarantee. → [[content-sources]].
- `integration/ProgressContext.test.jsx` — toggle module/lesson, reset, persistence, hydration,
  corrupt-storage resilience (jsdom + testing-library `renderHook`).

## Config
`test` block in `client/vite.config.js`: `environment: 'jsdom'`, `globals: true`,
`setupFiles: './tests/setup.js'`, `include: ['tests/**/*.{test,spec}.{js,jsx}']`.

## Notes
- `npm audit` flags esbuild's dev-server advisory via vite/vitest — **dev-only**, not in the prod
  build; do not `audit fix --force`. → [[decisions]] #15.
