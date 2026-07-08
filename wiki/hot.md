---
type: meta
title: "Hot Cache"
updated: 2026-07-07T22:15:00
---

# Recent Context

## Last Updated
2026-07-07. Researched GreatFrontend + system-design-primer, planned the expansion in the vault, and
built the P0 content (JS utilities + UI components). Earlier this session: live-editor restrictions +
security docs, and the Vitest suite.

## Headlines
- **Content P0 DONE**: +5 JS utilities (throttle, curry, deepClone, flatten, memoize) with
  taught-logic tests; +5 UI components (Todo, Star Rating, Signup Form, Carousel, Stopwatch).
  Lessons **32 → 42**. **82 tests pass**; build clean.
- **Planning in vault**: [[expansion-roadmap]] (GreatFrontend gap analysis, prioritized) +
  [[system-design-plan]] (system-design-primer + GreatFrontend). Decision: **keep 4 tracks**, add modules.
- **Editor safety**: per-lesson `readOnly`/`lockedFiles` (box-model locks structure, edits CSS only);
  `SECURITY.md` documents Sandpack sandboxed-iframe + ErrorBoundary isolation. → [[decisions]] #17.
- Tests live in `client/tests/` ([[testing]]); source of truth = handbook ([[content-sources]]).

## Active Threads
- **Next (P1)**: Algorithms & DS module (SDE gap — zero coverage), AI-interview expansion, Behavioral
  module, then React depth / quiz. System design is P2 ([[system-design-plan]]).
- **Chrome DevTools MCP not connected** + design skills uninstalled → no in-browser screenshot pass.
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
