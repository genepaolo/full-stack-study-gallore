---
type: reference
title: "Content expansion roadmap (GreatFrontend gap analysis)"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [reference, content, roadmap, planning]
---

# Expansion roadmap — GreatFrontend gap analysis

Sources scoured (2026-07-07): GreatFrontend Front-End Interview Playbook —
introduction, javascript, user-interface, algorithms. Owner framing: we cover **frontend**, **some
full-stack**, **AI** (moving toward AI-in-workflow), and **SDE** interview questions.

## GreatFrontend's four question formats
Coding (algorithmic · JS functions · UI building) · System design · Quiz · Behavioral.
Front-end emphasis: practical JS utilities + UI components > hard algorithms; trees/recursion/DFS/BFS
matter (DOM is a tree); behavioral is a real round.

## Current coverage (15 modules / 32 lessons)
- Frontend: foundations(2), css-layout(2), js-core(2), react(2), ui(3)
- Backend: node(2), rest(2), data(2), auth(2)
- Full-stack: connect(2), data(2), deploy(2)
- Advanced: projects/snake(1), sysdesign(2), ai(2)

## Gaps vs GreatFrontend (by interview pillar)

### SDE / CS  — biggest structural gap (currently ZERO)
- **Algorithms & Data Structures**: Big-O + complexity of JS built-ins; arrays/strings (two
  pointers); recursion; **trees + DOM traversal (BFS/DFS)**; hash maps/sets; binary search.
- **Behavioral**: STAR method; tell-me-about-yourself; conflict/failure; why-company.

### Frontend — highest volume of missing must-knows
- **JS utilities** (GreatFrontend "practice first"): have debounce + promiseAll; MISSING **throttle,
  curry, deepClone, flatten, memoize, Promise.allSettled/race, array polyfills (map/reduce),
  event delegation, event loop, prototypes/classes, EventEmitter/pub-sub, clsx**.
- **UI components**: have accordion/tabs/modal; MISSING **Todo List, Star Rating, Data Table
  (sort/filter/paginate), Signup Form (validation), Image Carousel, Countdown/Stopwatch, Tic-tac-toe**.
- **React depth**: MISSING useContext/useReducer, custom hooks, lists & keys, memo/useMemo/useCallback,
  controlled forms.
- **Quiz depth**: have 1; MISSING event loop, hoisting, `==` vs `===`, CSS specificity, React keys,
  box-model.
- **CSS depth**: MISSING positioning, specificity, responsive/media queries, animations.

### AI — expand per owner interest
- have ai-workflow + prompting. MISSING **LLM fundamentals (tokens/context/temperature), RAG basics,
  evaluating output & hallucinations, AI system design, using AI in interviews (what's allowed)**.

### Full-stack — solid; minor adds
- MISSING websockets/real-time, indexes/transactions, caching layers (Redis), rate limiting, testing.

## Prioritized plan

- **P0 (most-asked, fills zero-coverage):**
  1. New **Algorithms & DS** module (Big-O, arrays, recursion, trees/DFS/BFS, hashmaps) — 5 lessons.
  2. Expand **js-core** utilities (throttle, curry, deepClone, flatten, memoize, allSettled/race,
     array polyfills, event delegation, event loop) — ~7.
  3. Expand **ui** components (Todo List, Star Rating, Data Table, Signup Form, Carousel, Stopwatch) — ~5.
- **P1:** Behavioral module (3–4) · AI-interview expansion (3–4) · React depth (3–4) · Quiz depth (4–5).
- **P2:** Frontend system design (typeahead, news feed) · CSS depth · networking/perf · FS extras.

## Decisions (2026-07-07)
- **Structure:** keep the 4 tracks; add modules (Algorithms & DS, Behavioral) under Advanced; grow
  existing modules. No track restructure.
- **Build first (P0):** **UI components** + **JS utility functions** (owner pick). Then P1
  (Algorithms & DS, AI-interview, Behavioral, React depth, quiz), then P2.

### P0 status — DONE (2026-07-07)
- js-core +5: throttle, curry, deepClone, flatten, memoize (each taught-logic tested).
- ui +5: Todo List, Star Rating, Signup Form, Image Carousel, Stopwatch.
- Lessons 32 → **42**. Next up: P1 (Algorithms & DS module, AI-interview expansion, Behavioral).

### P1 — Algorithms & DS DONE (2026-07-09)
- New module `adv-algorithms` (Advanced, level 4): Big-O, two-pointers, recursion, trees/DOM BFS-DFS,
  hash maps. 5 lessons, Snap-curated framing; 4 utility lessons taught-logic-tested. Lessons **42 → 47**.
- **Curation re-prioritized** toward a front-end-leaning full-stack target — see [[target-role-profile]].
  New P1 order: FE performance/rendering → AI-code-auditing → OOP+FP → TypeScript → React depth.

## System design
Detailed sub-plan (backend from [system-design-primer], frontend from GreatFrontend) lives in
[[system-design-plan]]. Sequenced P2 — plan captured, build after P0/P1.
