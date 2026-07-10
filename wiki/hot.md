---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-09T17:45:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-09. **DSA taxonomy complete AND the Front-End Performance module is built.** `adv-algorithms` =
16 lessons; new **`fe-performance`** = 5 lessons (the #1 target-weighted P1 gap — now ✅). Tests **126**,
build clean. Next P1: **AI-assisted engineering — auditing generated code** (expand `adv-ai`).

## Headlines
- **`adv-algorithms` = 16 lessons**, all JS (not Java), each brute→optimized + `codeNotes` + full
  category question list + taught-logic test: Big-O, arrays/hashing, two-pointers, recursion, trees/DOM,
  sliding window, stack, binary search, linked list, **graphs (island flood fill DFS+BFS)**, heap,
  intervals, greedy (Kadane), **tries (prefix tree)**, **bit manipulation (XOR)**, + cheat sheet (order 99).
- **Source map** → [[algo-source-neetcode]]: core taxonomy ✅. Only optional/thin left (deepen trees,
  Advanced Graphs, Math & Geo). `Paolo 114.docx` stays gitignored in `dropoff/`.
- **`codeNotes`** field + `<CodeNotes>` callout ("🧩 Code to reach for", read-only, never executed);
  remark-gfm enabled so markdown tables render. `DESIGN.md` (repo root) documents the whole system.
- **`fe-performance` = 5 lessons** (frontend, level 4): pixel pipeline · reflow/repaint + layout
  thrashing (read-then-write batching, rAF, transform/opacity) · list virtualization (testable
  `visibleRange` windowing math) · code-splitting (dynamic import, React.lazy, tree-shaking) · Core Web
  Vitals (LCP/CLS/INP; INP replaced FID Mar 2024). Web-verified; concept lessons + one live vanilla editor.
- **Curation target** → [[target-role-profile]] (Snap-style FS Eng): P1 = FE perf ✅ →
  **AI-code-auditing (next)** → TypeScript → FE system design → behavioral.
- **Security**: live-editor host-isolated (Sandpack sandboxed iframe + double ErrorBoundary + Reset).
  `autorun:false` still offered as a stronger infinite-loop guard (owner's call, not applied).

## Active Threads
- **NEXT: AI-assisted engineering — auditing generated code** (expand `adv-ai`): review AI output for
  correctness, performance, security. Then TypeScript module, FE system design, deepen MongoDB.
- **Practice**: verify each solution/complexity vs public LeetCode before it ships; keep explanations simple.
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale (says "Four categories"/MongoDB progress) — refresh candidate; Notes UI + mobile
  nav backlog; Chrome DevTools MCP + design skills not connected → no in-browser screenshot pass.
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill` if a port sticks.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
