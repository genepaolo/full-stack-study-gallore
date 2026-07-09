---
type: index
title: "Architecture Decisions"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [decisions, adr]
---

# Architecture Decision Records

Decisions made during the initial build (2026-07-07). All four confirmed with the owner.

## 1. Sandpack for live-editable code
Chosen over react-live and Monaco+eval. Rationale: highest fidelity to "how things truly
interact" — multi-file, real npm imports, console, built-in bundler. Cost: large JS chunk (~950 kB
for the Sandpack bundle), acceptable for a study tool. → [[showcase-framework]]

## 2. Reset via key-remount
`LiveCode` bumps a React `key` on `<Sandpack>` to remount and reload the original `files` prop.
Simplest reliable full reset; no manual diffing of editor state.

## 3. MongoDB Atlas (cloud) over local Mongo
Mongo isn't installed locally. Atlas free M0 tier removes the local dependency and works anywhere.
Connection string goes in `server/.env`. → [[MongoDB Atlas]]

## 4. Offline-first progress
`ProgressContext` caches progress in `localStorage` and treats the server as source of truth when
reachable. If `MONGO_URI` is unset or the API is down, the app still works and the TopBar shows a
"Local" indicator. Server routes return `persisted:false` (202) when no DB is connected.

## 5. Content as plain objects
A challenge is one object appended to a per-category file in `client/src/data/challenges/`.
Adding content requires no wiring — the registry aggregates automatically.
_Superseded by #6:_ content is now a lesson object appended to `data/lessons/<track>.js`,
aggregated by `data/lessons/index.js`. The plain-object / zero-wiring principle carries over. → [[curriculum]]

## 6. Curriculum model (Tracks → Modules → Lessons)
Replaced flat categories with an ordered curriculum in `data/curriculum.js`. Modules carry a
`level` (1→6) so the learning path ramps smoothly beginner→pro. Lessons live in
`data/lessons/<track>.js` and flow automatically into nav, module pages, prev/next, and glossary.
Rationale: the app is a *study guide*, not a gallery — progression and structure matter most.

## 7. Pedagogy: keyTerms + Glossary
Every lesson declares `keyTerms` ("the lingo"), surfaced as a callout and aggregated into a
searchable Glossary (`data/glossary.js`). Serves the "help with English / learning lingo" goal.

## 8. Section-level isolation via ErrorBoundary
Beyond Sandpack's sandboxed iframe (which contains editor *runtime* errors), each interactive block
is wrapped in a React `ErrorBoundary` so a host-side render failure only affects that section, with
a per-section retry. Directly satisfies "errors should only affect that section."

## 9. Lazy-load Sandpack (code-split)
`LiveCode.jsx` loads `@codesandbox/sandpack-react` via `React.lazy` so the ~1MB bundle downloads
only when a lesson with an editor opens — keeps the roadmap/module pages fast.

## 10. Backend lessons run in the browser (vanilla template)
Interactive backend lessons (middleware, CRUD, JWT decode, hashing) run illustrative server-flavored
JS in Sandpack's `vanilla` sandbox — reliable and offline. The real Express server in `server/` is
the reference for actually running a backend.

## 11. GSAP animation system (reduced-motion-safe)
Added `gsap` + `@gsap/react` (`useGSAP`) for motion. Shared setup in `lib/anim.js` (registers
ScrollTrigger, exposes `prefersReducedMotion`, shared EASE/DUR). A `<Reveal>` component
(`components/anim/`) does fade+rise entrances (on-mount or scroll-triggered, optional child stagger).
Applied to: animated aurora hero + CTA, scroll-revealed roadmap cards, progress-bar fill-on-view,
route transitions (AppShell), sidebar entrance, KeyTerms stagger.
**Principle:** content is always rendered and animated FROM hidden TO natural (never CSS-hidden), so
it stays visible if JS fails; all effects no-op under `prefers-reduced-motion`.

## 12. Chrome DevTools MCP — NOT connected (2026-07-07)
The user asked to use Chrome DevTools MCP for visual iteration; it isn't installed/connected in this
session, so no in-browser screenshots were possible. Verified instead via production build + Vite
boot. To enable: connect the chrome-devtools MCP server (`claude mcp add …` / `/mcp`), then a
screenshot-driven polish pass can follow. The design skills (ui-ux-pro-max, frontend-design) are
also still uninstalled — visual choices were made by hand.

## 13. Progress is offline, local-only, module-first (supersedes #4) — see [[progress-model]]
Progress moved to **localStorage as the single source of truth** (`ProgressContext`, key
`gallore:progress:v2`) — no server round-trip. Reason: the tool is offline/unpublished and the
server "opens and closes"; the old on-mount server read could clobber local progress with an
empty/fresh server. Two kinds: **modules** (`{slug:true}`) are the primary manual "learned" unit and
drive overall + per-track bars; **lessons** (`{id:true}`) are an optional finer self-check. Marked
from Module/Track/Progress pages; the Progress page is a control-center with per-module checkboxes +
a confirm-gated **Reset**. Cross-tab sync via the `storage` event. Server progress routes remain but
are unused by the client (kept for possible future features). Supersedes ADR #4 (offline-first w/
server sync). TopBar now shows "Saved on device" instead of a sync indicator.

## 14. Dev-port auto-cleanup (`predev` hooks + `npm run kill`)
Added `scripts/kill-dev.mjs` + `predev:client`/`predev:server` hooks and a manual `npm run kill`, so
a stuck previous dev server never blocks a restart (the Windows "unauthorized access"/EACCES socket
error). Cross-platform; kills only the process on the target port. Key detail: uses `netstat -ano`
(not `-p tcp`) because Vite listens on IPv6 `::1:5173`. Full writeup: [[dev-ports]].

## 15. Test suite (Vitest) for study-material correctness
Added Vitest in `client/tests/` (61 tests): content integrity, curriculum/glossary helpers, every
snippet compiles (esbuild, node-env), the taught vanilla utilities execute correctly, and the
offline progress logic. `npm test`. Full map: [[testing]]. Note: esbuild dev-server advisory
(via vite/vitest) is dev-only — not in the prod build; do not `audit fix --force`.

## 16. Frontend Interview Handbook is the content source of truth
Per owner: teach the handbook's canonical answers; when paywalled, cross-check public sources (MDN,
specs, official docs). Correctness enforced by the taught-logic tests. → [[content-sources]], `CONTENT.md`.

## 17. Live-editor safety model + per-lesson restrictions
Security boundary = Sandpack's sandboxed **cross-origin iframe** (user code can't touch host DOM/
state/localStorage) + per-block `ErrorBoundary` (host-side containment, proven by a test) + Reset +
no host-side `eval`/raw-HTML markdown. Added optional lesson fields `readOnly` (view-only) and
`lockedFiles: ['/path']` (lock scaffolding, edit the rest) — a focus/UX guardrail, not the security
boundary. Applied to `fe-box-model` (lock `/index.html`, edit `styles.css`). Documented in
`SECURITY.md`; integrity-tested. Tests now 65.

## Open decisions
- Auth: none (single personal user, `localStorage` userId). Revisit if multi-user is ever wanted.
- Notes UI: models + API exist server-side; client notes editor not yet built.
- Mobile nav: sidebar is desktop-only; small screens rely on the roadmap + breadcrumbs. A drawer is backlog.
