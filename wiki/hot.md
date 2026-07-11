---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-10T19:20:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-10. All P1 done earlier; P2 in progress. Today also: **deepened MongoDB** (`be-data` 2 → 6),
added a **project run-skill** (in-browser verification), and **pushed everything to origin/main**.
Tests **167**, build clean, browser-verified. Next P2: **GraphQL**.

## Headlines
- **`be-data` = 6 lessons** (backend): original `be-documents` + `be-mongoose`, plus `be-mongo-crud`
  (operators $gt/$in/$regex, projection, $set/$inc/$push, upsert; whole-doc-replace footgun),
  `be-mongo-modeling` (embed vs reference, one-to-few/many, 16MB limit, populate/$lookup),
  `be-mongo-indexes` (COLLSCAN vs IXSCAN, compound-index prefix rule, **ESR** = Equality→Sort→Range,
  covered queries, explain()), `be-mongo-aggregation` (**live+tested**: $match→$group→$sort→$limit as
  pure JS). Verified vs the MongoDB Manual.
- **Run-skill** `.claude/skills/run/` (SKILL.md + drive.py): start Vite :5173, then drive the real app in
  **Chromium via Python Playwright** (the `playwright` on PATH is Python's; Chromium under ms-playwright).
  `drive.py path:substring …` screenshots + asserts rendered text, ignores Sandpack offline CDN timeouts.
  This closes the long-standing "no in-browser pass" gap — no Chrome DevTools MCP needed.
- **Today's modules** (all pushed): `fe-paradigms` (OOP/FP, 5) `621df0f` · `fe-react-depth` (5) `55f5750` ·
  `adv-sysdesign` FE batch (+4) `8d9055d` · run-skill `22b303d`. All P1 gaps closed; P2: FE sysdesign ✅,
  MongoDB ✅.
- **Coverage** → [[target-role-profile]]: all P1 ✅. P2 order now: **GraphQL (next)** → advanced FE
  (Canvas/WebGL/SW/WASM) → Redis/caching → unit-testing lesson → backend sysdesign building-blocks
  ([[system-design-plan]]).
- **Content model**: append one object to `data/lessons/<track>.js`. Tests enforce it — `content-integrity`
  (structure), `lesson-code` (esbuild compiles every starter incl. JSX), `taught-logic` (evals a `vanilla`
  lesson's `/index.js`). Only `vanilla` lessons are unit-testable; React `component` demos are Sandpack-only
  (browser). `node --check` an edited lesson file before trusting the paste (backticks can arrive escaped).

## Active Threads
- **NEXT: GraphQL** — schema/types/resolvers, queries vs mutations, over/under-fetching vs REST, N+1 +
  DataLoader. Likely a new module (e.g. `be-graphql` or a fullstack one). Then advanced FE, Redis, testing.
- **Verify-don't-hallucinate is a standing rule**: every factual claim backed by a primary source or
  highly-starred repo; browser-verify new content via the run-skill; `node --check` our own lesson code.
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale ("Four categories"/MongoDB progress) — good refresh candidate now that MongoDB is
  deep; Notes UI + mobile nav backlog. (In-browser screenshot pass is now solved via the run-skill.)
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
- **origin/main is current** through `22b303d` (all today's work pushed). Dev server may be running on :5173.
