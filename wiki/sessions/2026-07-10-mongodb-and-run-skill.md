---
type: session
title: "2026-07-10 — Deepen MongoDB (be-data +4) + project run-skill + push"
created: 2026-07-10
updated: 2026-07-10
tags:
  - session
  - content
  - mongodb
  - backend
  - tooling
status: developing
related:
  - "[[target-role-profile]]"
  - "[[verify-prep-against-public-sources]]"
  - "[[2026-07-10-fe-system-design]]"
---

# Session: Deepen MongoDB + run-skill + push (2026-07-10)

Second P2 batch. Deepened the ⚠️-partial **MongoDB** area (`be-data` 2 → 6 lessons), captured the repo's
**in-browser verification path as a project run-skill**, and **pushed all of today's work to origin/main**.
Tests **163 → 167**, build clean, browser-verified (the aggregation live editor executes correctly).

## MongoDB — `be-data` (backend track)
Was 2 thin concept lessons; now 6. Three concept + one live+tested (the pattern).

1. **`be-mongo-crud`** (concept) — CRUD + query operators ($eq/$gt/$in/$regex, implicit AND), projection,
   update operators ($set/$inc/$push/$addToSet), upsert. Footgun: a bare update doc **replaces** the whole
   document (missing `$set`). Audit angle: whole-doc clobber, $regex injection, leaking fields without projection.
2. **`be-mongo-modeling`** (concept) — embed vs reference, the central NoSQL decision. One-to-few → embed;
   one-to-many/unbounded/shared → reference. 16MB document limit; unbounded-array + over-referencing (N+1)
   anti-patterns; populate/$lookup. Ties to denormalization/caching + cursor-feed "model for your reads".
3. **`be-mongo-indexes`** (concept) — COLLSCAN (O(n)) vs IXSCAN (O(log n)); compound-index **prefix rule**;
   the **ESR rule** (Equality → Sort → Range) for field order; covered queries; `explain("executionStats")`.
   Framed as Big-O-in-the-hot-path at the data layer. Highest interview signal in the batch.
4. **`be-mongo-aggregation`** (utility/vanilla, live+**tested**) — the pipeline as data transformation:
   `matchPaid` ($match), `revenueByCustomer` ($group + $sum), `topCustomers` (full $match→$group→$sort→$limit).
   3 test cases. Live editor runs and prints correct top-2 revenue.

Verified vs the MongoDB Manual (Query/Update Operators, Data Modeling, Indexes, ESR Rule, Aggregation Pipeline).

## Tooling — project run-skill (`.claude/skills/run/`)
Closes the "no in-browser pass" gap flagged every prior session. There's **no Chrome DevTools MCP**, but the
`playwright` on PATH is **Python Playwright** and Chromium is installed under `~/AppData/Local/ms-playwright/`.
`SKILL.md` documents: start `npm run dev:client` (:5173) → run `drive.py path:expected-substring …` →
`npm run kill`. `drive.py` navigates, asserts rendered `<body>` text, screenshots full pages, and **ignores
Sandpack's expected offline CDN timeouts** (only real page/console errors fail it). Verified: it drives all
of today's new modules/lessons green.

## Push
Fast-forward `6673186..22b303d` to origin/main (no active pre-push hook; identity is the noreply address):
`621df0f` fe-paradigms · `55f5750` fe-react-depth · `8d9055d` fe-system-design · `22b303d` run-skill.
(This session's MongoDB commit follows.)

## State of the roadmap
All P1 done. P2: FE system design ✅ · MongoDB ✅ · **GraphQL next** → advanced FE (Canvas/WebGL/SW/WASM) →
Redis/caching → unit-testing lesson → backend sysdesign building-blocks ([[system-design-plan]]).

## Process notes
- `node --check` remains essential on edited lesson files (backticks arrived escaped again earlier today).
- README is now a strong refresh candidate — it still says "Four categories" and understates MongoDB.
