---
type: meta
title: "Operation Log"
status: active
created: 2026-07-07
updated: 2026-07-09
tags: [meta, log]
---

# Log (newest on top)

## 2026-07-10 — New `fe-react-depth` module (5 lessons): React Depth & Performance
- Built P1 #5 (last P1 for the target). Frontend, level 4 (next to `fe-performance`). Committed `fe-paradigms`
  first (`621df0f`), then this. Lessons: `fe-react-render` (render/commit, reconciliation, keys, index-key
  state-corruption bug), `fe-react-equality` (live+**tested**: `shallowEqual` = React.memo's prop check +
  `depsChanged` = hook deps `Object.is` — explains why inline {}/() => {} props defeat memo), `fe-react-memo`
  (live: memo/useMemo/useCallback together + per-row render counter + "remove useCallback" experiment),
  `fe-react-custom-hooks` (live: `useToggle` + `useDebouncedValue`, Rules of Hooks, reuse-logic-not-state),
  `fe-react-forms` (live: controlled one-handler-many-fields via `name` + immutable computed-key update;
  uncontrolled file input via ref).
- 3 live React demos + 1 tested vanilla (equality) + 1 concept. Framed to role: 16ms budget / reconciliation,
  don't-over-memoize audit angle, half-controlled-input AI bug. Verified vs react.dev (Render and Commit,
  Rendering Lists, Preserving/Resetting State, memo, useMemo, useCallback, Custom Hooks, Rules of Hooks,
  Reacting to Input with State). Tests **148 → 155** (+3 taught-logic, +4 auto-compile), build clean.
- **All five P1 gaps now closed.** Next: **P2** — FE system design, deepen MongoDB (`be-data`), then GraphQL.

## 2026-07-10 — New `fe-paradigms` module (5 lessons): OOP & Functional Programming
- Built P1 #4 (JD: "OOP + functional programming principles"). Frontend track, level 3, placed after
  `fe-js-core`, before `fe-react`. Lessons: `fe-para-intro` (multi-paradigm; imperative vs declarative),
  `fe-fp-pure` (pure functions + immutability — live+tested cart ops), `fe-fp-compose` (HOF + pipe/compose
  — live+tested), `fe-oop-classes` (classes/#private encapsulation/prototypes; composition over
  inheritance), `fe-solid` (SOLID as front-end instincts). 2 live vanilla editors + taught-logic tests.
- Framed to the target role: React purity/immutability angle, AI-audit angle (mutation of inputs; needless
  class trees), performance note on map/filter passes. Facts verified vs MDN (First-class Function, Classes,
  Private properties), React docs (Keeping Components Pure, Updating Arrays in State), Wikipedia/Martin (SOLID).
- Tests **138 → 148** (+8 taught-logic, +2 auto-compile), build clean, `node --check` passed. No in-browser
  pass (DevTools MCP still not connected). Next P1: **React depth** (useMemo/useCallback/memo, custom hooks).

## 2026-07-09 save | Content buildout: DSA, FE performance, AI-audit, TypeScript
- Type: session
- Location: wiki/sessions/2026-07-09-content-buildout.md
- From: full day arc — finished DSA taxonomy (`adv-algorithms`=16), built `fe-performance` (5),
  `adv-ai` audit lessons (+3), and `fe-typescript` (5). Tests 114 → 138, build clean. Every fact
  primary-source verified. P1 remaining: OOP/FP → React depth → FE system design → deepen MongoDB.

## 2026-07-09 — New `fe-typescript` module (5 lessons), verified vs the official TS Handbook
- Built the P1 TypeScript module (JD: "JavaScript and/or TypeScript"): `fe-ts-basics` (types/inference/
  **erasure**, any vs unknown, structural typing), `fe-ts-interfaces` (interface vs type, unions `|` /
  intersections `&`, literals, `as const`), `fe-ts-narrowing` (**live** — discriminated-union `area`;
  typeof/in/instanceof guards; `never` exhaustiveness), `fe-ts-generics` (**live** — `first`/`identity`/
  constrained `pluck<T,K extends keyof T>`), `fe-ts-utility-types` (Partial/Pick/Omit/Record/… + React props).
- TS is **content-only** — the app stays JS. The two live lessons run the plain-JS runtime (types erase);
  codeNotes carry the `<T>` signatures. Taught-logic-tested. Every claim checked against the official
  Handbook (Everyday Types / Narrowing / Utility Types) → [[prep-resources]].
- Fixed a self-inflicted parse error first: a stray unescaped backtick in the narrowing explanation closed
  the template literal early (caught by `node --check`; the no-hallucination discipline applies to our code too).
- Tests 130 → **138**; build clean. Updated [[target-role-profile]]: TypeScript ✅; **OOP/FP** is next.

## 2026-07-09 — AI-code-auditing: +3 `adv-ai` lessons, every figure primary-source verified
- Built the P1 "audit AI output" content (JD names it twice): `adv-ai-auditing` (5-pass checklist:
  correctness/security/performance/dependencies/maintainability; "assume confidently incomplete"),
  `adv-ai-security` (classic bugs AI repeats + **slopsquatting**/package hallucination + OWASP LLM Top 10),
  and `adv-ai-audit-drill` (live vanilla: plausible AI code with a hidden **O(n²)** + a correctness bug;
  taught-logic-tested that the bug is real and the fix dedupes).
- **Per owner's "no hallucination" rule, every stat was fetched from the primary source** and filed to
  [[prep-resources]]: OWASP LLM Top 10 2025 (genai.owasp.org) · package-hallucination study (arXiv
  2406.10279: 205,474 unique fake names; 5.2% commercial vs 21.7% OSS) · Veracode 2025 GenAI report
  (45% introduce an OWASP Top 10 vuln; XSS 86%, log-injection 88%) · GitHub Docs review guide.
- `adv-ai` = 5 lessons. Tests 126 → **130**; build clean. Updated [[target-role-profile]]: AI-audit ✅;
  **TypeScript** is next.

## 2026-07-09 — Pivot to front-end performance: new `fe-performance` module (5 lessons)
- With DSA complete, built the #1 target-weighted module ([[target-role-profile]] P1): **`fe-performance`**
  (frontend track, level 4) — (1) the pixel pipeline / critical rendering path, (2) reflow vs repaint +
  **layout thrashing** (read-then-write batching, rAF, transform/opacity), (3) **list virtualization**
  (pure `visibleRange` windowing math — testable), (4) **code-splitting** (dynamic import, React.lazy,
  tree-shaking), (5) **Core Web Vitals** (LCP ≤2.5s / CLS ≤0.1 / INP ≤200ms — INP replaced FID Mar 2024).
- Each concept lesson has keyTerms + a `codeNotes` panel + GFM tables; virtualization is a live vanilla
  editor with a taught-logic test (10k-row list → ~16 nodes; clamps to bounds). Web-verified vs public docs.
- Tests 122 → **126**; build clean. Updated [[target-role-profile]]: FE-perf ✅ done; **AI-code-auditing** next.

## 2026-07-09 — +3 patterns: Graphs, Tries, Bit Manipulation — DSA taxonomy complete
- Built `adv-graphs` (Number of Islands via DFS **and** BFS flood fill — a grid is a graph; test asserts
  the two engines agree and neither mutates the caller), `adv-tries` (Trie class: insert/search/startsWith,
  O(word length); the autocomplete structure), `adv-bit-manipulation` (Single Number via XOR vs a Map count
  + countBits/Hamming weight). All brute→optimized (or two-engine) + codeNotes + full category lists;
  taught-logic-tested. Cheat-sheet table + "pick in 15s" extended with Trie / Bit rows.
- `adv-algorithms` = **16 lessons** (15 patterns + cheat sheet). **The core NeetCode taxonomy is covered** —
  only optional/thin categories remain (deepen trees, Advanced Graphs, Math & Geo). Tests 114 → **122**.
- **Next: pivot to the Front-End Performance module** (top target-weighted P1 gap, [[target-role-profile]]).

## 2026-07-09 — +3 patterns: Heap, Intervals, Greedy
- Built `adv-heap` (Kth largest via a hand-rolled MinHeap — JS has no built-in), `adv-intervals`
  (merge, sort+sweep), `adv-greedy` (max-subarray / Kadane). All brute→optimized + codeNotes +
  full category lists; taught-logic-tested (incl. brute==optimized). Cheat sheet moved to order 99
  (always last) and its pattern table extended with the 3.
- `adv-algorithms` = **13 lessons** (12 patterns + cheat sheet). Coverage: 11 of 16 doc categories.
  Remaining: graphs (grid), tries, bit-manipulation, (advanced graphs, math). Tests 107 → **114**.

## 2026-07-09 — codeNotes ("Code to reach for") + Algorithms cheat sheet
- New first-class lesson field **`codeNotes: [{label, code, note}]`** + `<CodeNotes>` callout (mirrors
  keyTerms→glossary pattern; read-only snippets, never executed). Wired into `LessonView`; integrity-tested.
- Seeded idioms across the 9 pattern lessons: palindrome regex, Map/Set, two-pointer/window/stack/binary
  templates, BFS queue, 2D grids, spread-copy, list node/dummy-head, map/forEach/reduce + array-op costs.
- New **`adv-cheatsheet`** concept lesson: pattern-recognition table + JS idiom panel (sort, shallow/deep
  copy, 2D arrays, classes, regex, Map/Set) + a **TypeScript quick-ref seed**. adv-algorithms now 10 lessons.
- Enabled **remark-gfm** so markdown tables render (also fixes the Big-O cost table). No raw-HTML → security
  posture unchanged. Tests 106 → **107**; build clean; `npm ci` lockfile in sync.

## 2026-07-09 — Security hardening + DESIGN.md
- **Live-editor hardening:** `LiveCode` now carries its OWN `ErrorBoundary` (defense-in-depth, keyed to
  Reset). Rewrote `SECURITY.md` with a per-threat table + honest infinite-loop nuance (isolated +
  Reset-recoverable, not thread-interruptible; `autorun:false` offered as a stronger guard). 106 tests, build clean.
- **`DESIGN.md`** — extensive design document: architecture, full stack w/ versions, content model,
  showcase framework, progress model, security & preventative measures, testing, CI, ADR register,
  knowledge-base/memory system, AI-assisted build process (Claude skills), external resources/repos, roadmap.

## 2026-07-09 — Depth pass: brute→optimized journey on the 4 pattern lessons
- Chose **depth-first** for the NeetCode content. Enhanced sliding-window/stack/binary-search/linked-list:
  each live editor now shows **brute force → optimized** (naive + optimal side by side); explanations
  narrate the "why it's slow → the fix"; each lists its **full** category question set from the doc.
- A test asserts brute == optimized for every lesson (the journey is real). Tests **102 → 106**; build clean.
- Coverage framing: ~16 pattern lessons capture all ~114 doc questions as a map; ~4/16 built so far.

## 2026-07-09 — Ingested NeetCode notes → +4 pattern lessons
- Analyzed `Paolo 114.docx` (owner's NeetCode 150 / Blind 75 notes, ~12.5k words, 16 pattern categories).
  Source map + coverage table + pending batches → [[algo-source-neetcode]]. Doc kept in gitignored `dropoff/`.
- Added 4 pattern lessons to `adv-algorithms` (drawn from owner's own method notes): **sliding window**
  (LC 3), **stack** (LC 20 valid parens), **binary search**, **linked list** (LC 206 reverse).
  All taught-logic-tested. Module now **9 lessons**; tests **94 → 102**; build clean.
- Pending patterns: heap, intervals, greedy, graphs (grid), tries, bit manipulation.

## 2026-07-09 — Algorithms & DS module + curriculum curated to a target role
- Built the **`adv-algorithms`** module (Advanced, level 4), 5 lessons Snap-curated: Big-O & the cost
  of JS (concept), two-pointers, recursion/backtracking, trees & DOM traversal (BFS/DFS), hash maps & sets.
- 4 utility lessons are taught-logic-tested (twoSumSorted/isPalindrome, permutations, dfs/bfs, twoSum/frequency).
  Tests **82 → 94**; build clean. Lessons **42 → 47**.
- Curated the curriculum toward a **front-end-leaning full-stack target** (Snap JD exemplar): new
  [[target-role-profile]] with JD→coverage map + re-prioritized P1 (FE perf/rendering → AI-code-auditing
  → OOP+FP → TypeScript → React depth). Lesson framing threads perf / DOM-as-tree / AI-audit.

## 2026-07-09 — Wiki health check + vault growth (lint)
- Ran wiki-lint (filesystem floor). Report: `meta/lint-report-2026-07-09.md`.
- Fixed the systematic dead-link epidemic: renamed `decisions/adr-index.md` → `decisions.md`, so all
  ~25 `[[decisions]]` links resolve (and the orphan-by-naming is gone).
- Repointed 3 dead `[[content-registry]]` links → [[curriculum]]; annotated ADR #5 as superseded by #6.
- Refreshed stale [[client]] (Track/Module/Lesson pages, `curriculum.js`+`lessons/`, offline-local
  progress). Filled frontmatter gaps on `hot.md` and `log.md`.
- Grew the vault: new [[progress-model]] page (consolidates localStorage `gallore:progress:v2` /
  modules-vs-lessons / cross-tab sync / Reset), wired into index, overview, client, decisions.

## 2026-07-07 save | Expansion, tooling, tests, CI & security
- Type: session
- Location: wiki/sessions/2026-07-07-expansion-and-tooling.md
- From: full session arc — progress model, GSAP, dev-ports, GitHub push + email scrub, Vitest suite,
  CI, live-editor security/restrictions, GreatFrontend + system-design-primer research, P0 content.

## 2026-07-07 — Content expansion P0 + research (GreatFrontend, system-design-primer)
- Scoured GreatFrontend playbook (intro/js/ui/algorithms) + system-design-primer; gap analysis and
  full plan filed to vault ([[expansion-roadmap]], [[system-design-plan]]). Decision: keep 4 tracks.
- Built P0: js-core +5 (throttle, curry, deepClone, flatten, memoize) with taught-logic tests;
  ui +5 (Todo, Star Rating, Signup Form, Carousel, Stopwatch). Lessons 32 → 42. 82 tests, build OK.

## 2026-07-07 — Live-editor safety + per-lesson restrictions
- Documented isolation (Sandpack sandboxed iframe + ErrorBoundary + Reset) in `SECURITY.md`.
- Added `readOnly` / `lockedFiles` lesson fields + LiveCode support; locked `fe-box-model` structure.
- Tests: ErrorBoundary containment + lockedFiles integrity (65 total, all green). → [[decisions]] #17.

## 2026-07-07 — GitHub Actions CI
- Added `.github/workflows/ci.yml`: on push/PR to main → `npm ci` → `npm test` → `npm run build`
  (Node 22, npm cache, concurrency-cancel). CI badge in README. Lockfile verified in sync for `npm ci`.

## 2026-07-07 — Test suite + content source of truth
- Added Vitest (`client/tests/`, 61 tests): content integrity, curriculum/glossary helpers, snippet
  compilation (esbuild, node-env), taught-utility execution, offline ProgressContext. `npm test`.
- Fixed esbuild-under-jsdom by running `lesson-code.test.js` in node env; guarded `localStorage` in setup.
- Set Frontend Interview Handbook as content source of truth (`CONTENT.md`, [[content-sources]]).
- Documented dev-only esbuild advisory (don't force-fix). [[testing]]; [[decisions]] #15–16. All green.

## 2026-07-07 — Scrubbed personal email from git history
- Rewrote all commits (filter-branch) from `paolo.gene@gmail.com` → `genepaolo@users.noreply.github.com`
  (author + committer). Set repo-local git config to the noreply email for future commits.
- Cleaned local backup refs + reflog; force-pushed. Verified: no gmail in history; local == remote.
- Note: old commit SHAs (2821840, ca00418) may linger as unreachable objects on GitHub until GC — acceptable per owner.

## 2026-07-07 — Security audit + first GitHub push
- Audited: no secrets/API keys/PII in source or docs; hardened `.gitignore`; added `.gitattributes`.
- Added `SETUP.md` (requirements + remote setup + troubleshooting); README links it.
- Initialized `main`, added remote `genepaolo/full-stack-study-gallore`, committed 72 files, pushed.
- Verified: pushed tree has no secrets/artifacts; local == remote HEAD (`2821840`).

## 2026-07-07 — Dev-port cleanup automation (Windows "unauthorized access" fix)
- Diagnosed: stale Vite servers held 5173 → Windows EACCES socket error read as "unauthorized access".
- Added `scripts/kill-dev.mjs` (cross-platform, port-scoped) + `predev:client`/`predev:server` hooks
  + `npm run kill`. Fixed IPv6 bug (Vite on `::1:5173`; use `netstat -ano`, not `-p tcp`).
- Verified: occupied 5173 is auto-freed and rebound on `dev:client`. Documented in CLAUDE.md +
  [[dev-ports]]; decision [[decisions]] #14.

## 2026-07-07 — Offline, local-only, module-first progress + reset
- Progress → localStorage single source of truth (`gallore:progress:v2`), no server round-trip.
- Module "Mark as learned" is the primary unit (overall + per-track bars); lessons are optional detail.
- Control-center Progress page with per-module checkboxes + confirm-gated Reset; cross-tab sync.
- New `CheckToggle`; TopBar → "Saved on device"; server progress routes now unused by client.
- Updated CLAUDE.md; [[decisions]] #13 supersedes #4. Build 280 modules OK.

## 2026-07-07 — GSAP motion layer + visual polish
- Added `gsap` + `@gsap/react`; `lib/anim.js` + reusable `<Reveal>` (reduced-motion-safe).
- Animated: aurora hero + CTA, scroll-revealed roadmap, progress-bar fill, route transitions,
  sidebar entrance, KeyTerms stagger, card hover glow.
- Noted Chrome DevTools MCP not connected (no in-browser screenshots this session). → [[decisions]] 11–12.
- Verified: build 280 modules OK; Vite boots.

## 2026-07-07 — Restructured into a progressive curriculum
- Replaced flat categories with **Tracks → Modules → Lessons** (`data/curriculum.js`, `data/lessons/`).
- 4 tracks / 15 modules / ~30 lessons: frontend, backend, full-stack, advanced.
- Added pedagogy: per-lesson **keyTerms** (lingo) + an auto-built **Glossary** page.
- Added learning UX: roadmap Home, Track/Module/Lesson pages, prev/next progression, progress bars.
- Hardened isolation: `ErrorBoundary` around every interactive block (with Sandpack's iframe).
- Perf: lazy-loaded Sandpack (code-split) → smaller initial bundle.
- Advanced content: playable **Snake game**, **system design**, **AI in the dev workflow**.
- Verified: client build passes (272 modules); Vite dev boots and serves; server unchanged.
- See [[2026-07-07-curriculum]] and updated [[decisions]].

## 2026-07-07 — Project initialized
- Scaffolded the MERN monorepo from an empty directory (npm workspaces: client, server).
- Built the live-code showcase framework ([[Sandpack]] + key-remount reset) and [[ChallengeView]].
- Authored 4 exemplar challenges: Accordion, debounce, Center-a-div, `this` quiz.
- Built the Express/[[MongoDB Atlas]] backend with a graceful no-DB fallback.
- Verified: client build passes (267 modules); server boots and endpoints respond.
- Scaffolded this Obsidian memory vault (Mode B + sessions).
- Recorded architecture decisions in [[decisions]].
