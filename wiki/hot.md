---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-10T13:40:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-10. Closed P1 #4: **OOP & Functional Programming** — new `fe-paradigms` module (5 lessons).
Tests **138 → 148**, build clean, all facts primary-source verified (owner's no-hallucination rule).
Next P1: **React depth** (useMemo/useCallback/memo, custom hooks).

## Headlines
- **`fe-paradigms` = 5 lessons** (frontend, level 3, placed after `fe-js-core`, before `fe-react`):
  `fe-para-intro` (multi-paradigm; imperative vs declarative; OOP=state+behavior, FP=pure fns over
  immutable data) · `fe-fp-pure` (**live+tested**: pure cart ops — addItem/setQty/removeItem/total,
  immutable spread/map/filter, why React needs new references) · `fe-fp-compose` (**live+tested**:
  first-class fns, map/filter/reduce, `pipe` L→R / `compose` R→L via reduce/reduceRight) ·
  `fe-oop-classes` (classes, `#private` encapsulation ES2022, prototype chain, composition over
  inheritance) · `fe-solid` (SOLID as front-end instincts, not jargon). Verified vs MDN + React docs +
  Wikipedia/Martin (SOLID). Framed to role: React purity/immutability, AI-audit (input mutation, needless
  class trees), perf note on map/filter passes.
- **`fe-typescript` = 5**, **`fe-performance` = 5**, **`adv-ai` = 5**, **`adv-algorithms` = 16** (full
  NeetCode taxonomy). All JS (not Java), each with `codeNotes` panel; live vanilla editors are
  taught-logic-tested (`extract()` evals the lesson's `/index.js` and asserts behavior).
- **Content model**: add a lesson = append one object to `data/lessons/<track>.js` (id/module/order/kind/
  template/…); it flows to sidebar, module page, prev/next, glossary. Tests enforce integrity
  (`content-integrity`), auto-compile (`lesson-code`), and taught logic (`taught-logic`). `DESIGN.md` at
  repo root documents the whole system.
- **Curation target** → [[target-role-profile]] (Snap-style FS Eng): P1 = FE perf ✅ · AI-audit ✅ ·
  TypeScript ✅ · **OOP/FP ✅** → **React depth (next)** → FE system design → deepen MongoDB → behavioral.
- **Security**: live-editor host-isolated (Sandpack sandboxed iframe + double ErrorBoundary + Reset).

## Active Threads
- **NEXT: React depth** — `useMemo`/`useCallback`/`memo` (ties to `fe-performance`), controlled forms,
  custom hooks. Then FE system design, deepen MongoDB. Then P2: GraphQL, Canvas/WebGL, Redis, unit-testing lesson.
- **Verify-don't-hallucinate is a standing rule**: every factual claim/stat backed by a primary source or
  highly-starred repo before it ships; applies to our own code too (`node --check` before trusting a parse).
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale (says "Four categories"/MongoDB progress) — refresh candidate; Notes UI + mobile
  nav backlog; Chrome DevTools MCP + design skills not connected → no in-browser screenshot pass.
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
