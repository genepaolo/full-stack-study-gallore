---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-10T18:30:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-10. All five P1 gaps closed earlier today; now into **P2**. First P2 batch shipped: **FE system
design** — `adv-sysdesign` grew 2 → 6 lessons. Tests **138 → 163** across the day, build clean, all facts
primary-source verified. Next: **deepen MongoDB** (`be-data`, the thinnest area).

## Headlines
- **`adv-sysdesign` = 6 lessons** (advanced, level 6): original `adv-sysdesign-frontend` (RADIO) +
  `adv-sysdesign-scale` (backend scaling), plus 4 FE exercises — `adv-sd-typeahead` (**live+tested**
  `createRaceGuard`: drops out-of-order responses; debounce/AbortController/cache/combobox-a11y in codeNotes),
  `adv-sd-news-feed` (**live+tested** `mergeFeed` dedupe + `nextCursor`; cursor vs offset, IntersectionObserver,
  virtualization, optimistic likes), `adv-sd-component-api` (concept: props vs composition, compound components,
  controlled/uncontrolled, a11y contract), `adv-sd-chat` (concept: WebSocket vs SSE/polling, optimistic send +
  dedupe, ordering, reconnect backoff + gap-fill). Verified vs MDN + react.dev.
- **Today's earlier modules**: `fe-paradigms` (OOP/FP, 5) and `fe-react-depth` (React depth, 5). Committed
  `621df0f` (paradigms), `55f5750` (react-depth); FE-sysdesign pending commit.
- **Coverage** → [[target-role-profile]]: all P1 ✅ (FE perf, AI-audit, TS, OOP/FP, React depth). P2: FE
  system design ✅ → **deepen MongoDB (next)** → GraphQL → advanced FE → Redis → unit-testing lesson.
- **Content model**: add a lesson = append one object to `data/lessons/<track>.js`. Tests enforce it —
  `content-integrity` (structure), `lesson-code` (esbuild compiles every starter incl. JSX), `taught-logic`
  (evals a `vanilla` lesson's `/index.js` and asserts behavior). Only `vanilla` lessons are unit-testable;
  React `component` demos run in Sandpack (browser). `DESIGN.md` = full system docs; [[system-design-plan]]
  tracks the sysdesign sub-curriculum (backend building-blocks + exercises still unbuilt).
- **Gotcha caught today**: pasting starter constants via Edit, backticks got escaped (`\``) → syntax error;
  `node --check` caught it before tests. Always `node --check` edited lesson files.

## Active Threads
- **NEXT: deepen MongoDB** (`be-data`) — the thinnest area (owner is honest about DB depth). Then GraphQL,
  advanced FE (Canvas/WebGL/SW/WASM), Redis/caching, a dedicated unit-testing lesson. Backend sysdesign
  building-blocks + classic exercises also remain in [[system-design-plan]].
- **Verify-don't-hallucinate is a standing rule**: every factual claim backed by a primary source or
  highly-starred repo before it ships; `node --check` our own lesson code before trusting a parse.
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale ("Four categories"/MongoDB progress) — refresh candidate; Notes UI + mobile nav
  backlog; Chrome DevTools MCP + design skills not connected → no in-browser screenshot pass (live React/vanilla
  demos verified by esbuild compile + build + taught-logic only, not a live render).
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
- Commits today: `621df0f` fe-paradigms · `55f5750` fe-react-depth · FE-sysdesign pending.
