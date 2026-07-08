---
type: meta
title: "Operation Log"
updated: 2026-07-07
---

# Log (newest on top)

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
