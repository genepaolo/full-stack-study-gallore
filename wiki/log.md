---
type: meta
title: "Operation Log"
status: active
created: 2026-07-07
updated: 2026-07-09
tags: [meta, log]
---

# Log (newest on top)

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
