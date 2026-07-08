---
type: session
title: "2026-07-07 — Curriculum restructure & full-stack expansion"
status: done
created: 2026-07-07
updated: 2026-07-07
tags: [session]
---

# Session: Curriculum restructure (2026-07-07)

## Goal
Audit the app for aesthetics + working live-editing (isolated per section), reorganize it as a
proper progressive **study guide with learning modules**, expand across **all of full-stack**
(with backend depth), add **advanced** topics (Snake game, system design, AI workflow), teach the
**lingo**, and keep the vault current. For breaking into the full-stack job market.

## Done
- **Audit/isolation**: confirmed Sandpack sandboxes each editor in an iframe; added an
  `ErrorBoundary` around every interactive block → a broken edit only affects its own section.
- **Curriculum**: `data/curriculum.js` (4 tracks, 15 modules, `level`-ordered) + `data/lessons/`.
- **Pedagogy**: per-lesson `keyTerms` ("lingo") + auto-built searchable **Glossary**.
- **Learning UX**: roadmap Home, Track/Module/Lesson pages, prev/next progression, progress bars,
  grouped sidebar (tracks→modules), breadcrumbs. → [[client]], [[showcase-framework]].
- **Content (~30 lessons)**: FE (foundations→React→UI), BE (Node/Express, REST, Mongo, Auth),
  Full-Stack (CORS, request lifecycle, data fetching, deploy), Advanced (Snake, system design, AI).
- **Perf**: lazy-loaded Sandpack (code-split).
- **Docs**: root `CLAUDE.md` rewritten ("how to add a lesson"); [[decisions]] ADRs 6–10; [[curriculum]].

## Verified
- `npm run build --workspace client` → 272 modules, no errors; Sandpack split into async chunks.
- `npm run dev:client` → Vite boots (~200ms) and serves the SPA (200 on modules).
- Server unchanged; still boots with graceful no-DB fallback.

## Handoffs (owner)
- Set `server/.env` MONGO_URI (Atlas) for persistence.
- Install skills: Karpathy, ui-ux-pro-max, frontend-design (`/plugin marketplace add …`), then a
  dedicated visual-polish pass.
- Do a visual in-browser review (`npm run dev`, open :5173) — I can't see rendered pixels here.

## Next ideas
- Deepen each module (throttle/curry, useContext/useReducer, indexes/transactions, websockets).
- Per-lesson notes UI (server API exists). Mobile nav drawer. Second project (e.g. chat app).
