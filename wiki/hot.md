---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-10T15:40:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-10. **All five P1 gaps for the target role are now closed.** Today: `fe-paradigms` (OOP/FP, 5) then
`fe-react-depth` (React depth, 5). Tests **138 → 155**, build clean, all facts primary-source verified.
Next work is **P2** (no P1 left): FE system design → deepen MongoDB → GraphQL.

## Headlines
- **`fe-react-depth` = 5 lessons** (frontend, level 4, next to `fe-performance`): `fe-react-render`
  (render/commit, reconciliation, keys, the index-as-key state-corruption bug — concept) · `fe-react-equality`
  (**live+tested** vanilla: `shallowEqual` = what React.memo runs on props, `depsChanged` = hook deps
  `Object.is` — why inline `{}`/`() => {}` props defeat memo) · `fe-react-memo` (**live** react: memo +
  useMemo + useCallback together, per-row render counter, "remove useCallback" experiment) ·
  `fe-react-custom-hooks` (**live**: `useToggle`, `useDebouncedValue`; Rules of Hooks; reuse logic not state) ·
  `fe-react-forms` (**live**: controlled one-handler-many-fields via `name` + immutable computed-key update;
  uncontrolled file input via ref). Verified vs react.dev.
- **`fe-paradigms` = 5** (OOP/FP, level 3): multi-paradigm intro · pure fns + immutability (live+tested) ·
  HOF + pipe/compose (live+tested) · classes/`#private`/prototypes (composition > inheritance) · SOLID.
- Earlier: **`fe-typescript` = 5**, **`fe-performance` = 5**, **`adv-ai` = 5**, **`adv-algorithms` = 16**
  (full NeetCode taxonomy). All JS; each has `codeNotes`; live vanilla lessons are taught-logic-tested.
- **Content model**: add a lesson = append one object to `data/lessons/<track>.js`; it flows to sidebar/
  module page/prev-next/glossary. Tests enforce it: `content-integrity` (structure), `lesson-code` (esbuild
  compiles every starter incl. JSX), `taught-logic` (evals a vanilla lesson's `/index.js` and asserts). Only
  `vanilla` lessons are unit-testable — React `component` demos run in Sandpack (browser). `DESIGN.md` = full docs.
- **Curation target** → [[target-role-profile]] (Snap-style FS Eng): P1 = FE perf ✅ · AI-audit ✅ · TS ✅ ·
  OOP/FP ✅ · React depth ✅ → **P2 next**.

## Active Threads
- **NEXT: P2 (no P1 remaining).** Recommended order: FE system design ([[system-design-plan]]) → deepen
  MongoDB (`be-data`, the thin spot) → GraphQL → advanced FE (Canvas/WebGL/SW/WASM) → Redis/caching →
  a dedicated unit-testing lesson.
- **Verify-don't-hallucinate is a standing rule**: every factual claim/stat backed by a primary source or
  highly-starred repo before it ships; `node --check` our own code before trusting a parse.
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale (says "Four categories"/MongoDB progress) — refresh candidate; Notes UI + mobile
  nav backlog; Chrome DevTools MCP + design skills not connected → no in-browser screenshot pass (React
  demos verified by esbuild compile + build only, not a live render).
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
- Commits so far today: `621df0f` fe-paradigms; fe-react-depth pending commit.
