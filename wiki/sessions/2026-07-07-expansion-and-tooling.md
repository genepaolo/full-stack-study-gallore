---
type: session
title: "2026-07-07 — Expansion, tooling, tests, CI & security"
created: 2026-07-07
updated: 2026-07-07
tags:
  - session
  - testing
  - content
  - security
  - devops
status: developing
related:
  - "[[expansion-roadmap]]"
  - "[[system-design-plan]]"
  - "[[testing]]"
  - "[[content-sources]]"
  - "[[dev-ports]]"
  - "[[curriculum]]"
  - "[[decisions]]"
---

# Session: Expansion, tooling, tests, CI & security (2026-07-07)

Second working day arc on full-stack-gallore. Repo:
https://github.com/genepaolo/full-stack-study-gallore (branch `main`).

## What shipped

### Progress model → offline, local-only, module-first
`localStorage` is the single source of truth (`ProgressContext`, key `gallore:progress:v2`); no server
round-trip (fixes the empty-server-clobber bug). **Modules** are the primary manual "Mark as learned"
unit (drives overall + per-track bars); **lessons** are an optional finer self-check. Control-center
Progress page + confirm-gated Reset; cross-tab sync. → [[decisions]] #13.

### GSAP motion + visual polish
`lib/anim.js` + `<Reveal>`; animated aurora hero, scroll reveals, progress-bar fill, route
transitions, sidebar entrance, KeyTerms stagger, card glow. Reduced-motion-safe; content visible if
JS fails. → [[decisions]] #11.

### Dev-port hygiene (Windows "unauthorized access")
Root cause: stale Vite servers holding port 5173 → Windows EACCES. Added `scripts/kill-dev.mjs`
(port-scoped, cross-platform), `predev:client/server` hooks, `npm run kill`. Key bug fixed: Vite
binds IPv6 `::1:5173`, so use `netstat -ano` (not `-p tcp`). Full note: [[dev-ports]] · [[decisions]] #14.

### First GitHub push + email scrub
Audited (no secrets/PII), hardened `.gitignore`, added `.gitattributes`, `SETUP.md`; pushed. Then
rewrote all commits from the personal gmail to `genepaolo@users.noreply.github.com` (filter-branch)
and set the repo-local identity to the noreply email. Lesson: default to a privacy address BEFORE the
first push.

### Test suite (Vitest) + CI
`client/tests/` — content integrity, curriculum/glossary helpers, every snippet compiles (esbuild,
node-env), the taught vanilla utilities execute correctly, offline ProgressContext, ErrorBoundary
containment. `npm test`. GitHub Actions CI runs `npm ci && npm test && npm run build` on push/PR.
esbuild-under-jsdom fixed by running that file in the node environment. → [[testing]] · [[decisions]] #15.

### Live-editor safety + per-lesson restrictions
Security boundary = Sandpack sandboxed cross-origin iframe (user code can't touch host DOM/state/
localStorage) + per-block `ErrorBoundary` + Reset + no host-side eval/raw-HTML markdown. Added
`readOnly` / `lockedFiles` lesson fields (box-model locks `/index.html`, edits `styles.css`).
Documented in `SECURITY.md`. → [[decisions]] #17.

### Research + content expansion (P0)
Scoured GreatFrontend playbook (intro/js/ui/algorithms) + donnemartin/system-design-primer. Gap
analysis and full plan filed to [[expansion-roadmap]] + [[system-design-plan]]. Decision: **keep the
4-track structure**, add modules. Built P0 (owner pick): js-core +5 (throttle, curry, deepClone,
flatten, memoize, each taught-logic tested) and ui +5 (Todo List, Star Rating, Signup Form, Image
Carousel, Stopwatch). Lessons **32 → 42**. 82 tests pass. → [[decisions]] #16 · [[curriculum]].

## Source of truth
Frontend Interview Handbook (public sources like MDN when paywalled); teach canonical answers;
correctness is test-enforced. → [[content-sources]].

## Open / next
- **P1**: Algorithms & DS module (SDE — currently zero coverage), AI-interview expansion, Behavioral
  module, then React depth / quiz. **P2**: system design ([[system-design-plan]]).
- Chrome DevTools MCP not connected + design skills (ui-ux-pro-max, frontend-design) uninstalled →
  no in-browser screenshot/design pass yet.
- Commands: `npm test` before commits · `npm run dev:client` → :5173 · `npm run kill` if a port sticks.
