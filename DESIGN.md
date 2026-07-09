# full-stack-gallore — Design Document

> **Status:** living document · **Last audited:** 2026-07-09 · **Version:** 0.1.0
> A comprehensive audit of what the program is, how it's built, why each decision was made, the
> preventative/safety measures, the AI-assisted build process, and the external resources used.
> Companion docs: [`CLAUDE.md`](./CLAUDE.md) · [`SECURITY.md`](./SECURITY.md) · [`CONTENT.md`](./CONTENT.md) ·
> [`SETUP.md`](./SETUP.md) · the Obsidian vault in [`wiki/`](./wiki).

---

## 1. Executive summary

**full-stack-gallore** is a personal, offline-first **full-stack interview study guide**. Content is a
**curriculum** — ordered **Tracks → Modules → Lessons** ramping from HTML to system design. Each lesson
pairs a plain-English explanation + **key terms** with a **live, editable code block** (Sandpack) that
runs in a sandboxed iframe. It is a **client-only React app** with an **optional** Express/MongoDB
backend; the client runs fully standalone.

- **Scale (2026-07-09):** 4 tracks · 16 modules · **51 lessons** · 106 automated tests · CI green.
- **Repo:** https://github.com/genepaolo/full-stack-study-gallore
- **Primary users:** the author (interview prep, front-end-leaning full-stack roles — see §17).

---

## 2. Product overview

- **What it is:** a "study guide, not a gallery" — progression and structure matter. Every lesson flows
  through one path (`LessonView`) and branches on a `kind` (component / utility / project / quiz / concept).
- **Why live code:** interviews are practical. Learners edit real code and see it run instantly, isolated
  so a broken edit only affects its own block.
- **Offline-first:** no login, no server round-trip for progress. Works with the backend off.
- **Source of truth for content:** the Frontend Interview Handbook, cross-checked against public sources
  (MDN, specs) and — for algorithms — the author's NeetCode/Blind-75 notes, re-verified against public
  LeetCode/canonical sources.

---

## 3. Architecture

```
                        ┌─────────────────────────────────────────────┐
                        │  Browser (client — runs fully standalone)    │
                        │                                              │
  data/curriculum.js ──▶│  React 18 + Vite + Tailwind + GSAP           │
  data/lessons/*.js  ──▶│   ├─ Router (Home/Track/Module/Lesson/…)     │
  data/glossary.js   ──▶│   ├─ LessonView ──▶ LiveCode ──▶ ┌─────────┐ │
                        │   │                              │ Sandpack│ │  ← sandboxed
                        │   │                              │ iframe  │ │    cross-origin
                        │   ├─ ProgressContext ──▶ localStorage       │ │    (user code)
                        │   └─ ThemeContext ──▶ data-theme            │ │
                        │                              └─────────┘    │
                        └───────────────┬──────────────────────────────┘
                                        │ optional  /api (proxied :5000)
                                        ▼
                        ┌─────────────────────────────────────────────┐
                        │  Server (OPTIONAL — Express + Mongoose)      │
                        │   routes/{progress,notes} · models · db.js   │
                        │   graceful no-DB fallback (202 persisted:false)│
                        └───────────────┬──────────────────────────────┘
                                        ▼  MONGO_URI (optional)
                                   MongoDB Atlas (M0)
```

- **Monorepo:** npm workspaces (`client`, `server`) orchestrated by root scripts + `concurrently`.
- **Data flow:** curriculum + lessons are **static plain-object data** compiled into the bundle; the
  glossary auto-builds from lesson `keyTerms`. No CMS, no runtime content fetch.
- **The server is optional** and currently unused by the client for progress (see ADR #13).

---

## 4. Technology stack

### Client (`client/package.json`)
| Package | Version | Role |
|---|---|---|
| react / react-dom | ^18.3.1 | UI runtime |
| react-router-dom | ^6.28.0 | Routing (Home/Track/Module/Lesson/Glossary/Progress) |
| @codesandbox/sandpack-react | ^2.19.10 | Live, sandboxed code editor + preview (lazy-loaded) |
| react-markdown | ^9.0.1 | Lesson prose (raw-HTML disabled — see §12) |
| gsap / @gsap/react | ^3.15.0 / ^2.1.2 | Motion layer (reduced-motion-safe) |
| tailwindcss | ^3.4.17 | Utility CSS over CSS-variable design tokens |
| vite | ^6.0.5 | Dev server + build |
| vitest | ^2.1.8 | Test runner |
| @testing-library/react + jest-dom | ^16.1.0 / ^6.6.3 | Component/integration tests |
| esbuild | ^0.24.2 | Snippet-compilation test (node env) |
| jsdom | ^25.0.1 | DOM for component tests |
| postcss / autoprefixer | ^8.4.49 / ^10.4.20 | CSS pipeline |

### Server (`server/package.json`, optional)
| Package | Version | Role |
|---|---|---|
| express | ^4.21.2 | HTTP server + routing |
| mongoose | ^8.9.5 | MongoDB ODM (Progress, Note models) |
| cors | ^2.8.5 | Cross-origin for the client dev server |
| dotenv | ^16.4.7 | `MONGO_URI` etc. from `server/.env` |

### Tooling / infra
- **Node 22** (CI), npm **workspaces**, `concurrently` ^9.1.2 for `npm run dev`.
- **GitHub Actions** CI (§14). **Obsidian** vault for memory (§16). **Git Bash + PowerShell** on Windows.

---

## 5. Directory structure

```
full-stack-gallore/
├── client/                      # React SPA (runs standalone)
│   └── src/
│       ├── main.jsx             # ThemeProvider → ProgressProvider → BrowserRouter
│       ├── App.jsx              # routes
│       ├── components/
│       │   ├── layout/          # AppShell, Sidebar, TopBar, ThemeToggle
│       │   ├── showcase/        # LiveCode, LessonView, LessonCard, QuizCard, KeyTerms,
│       │   │                    #   ErrorBoundary, Markdown, Collapsible
│       │   ├── ui/              # primitives (Card/Button/Badge…), CheckToggle
│       │   └── anim/            # Reveal (GSAP entrance)
│       ├── context/            # ProgressContext (localStorage), ThemeContext
│       ├── data/               # curriculum.js, lessons/<track>.js (+ index.js), glossary.js
│       ├── pages/              # Home, Track, Module, Lesson, Glossary, Progress
│       ├── lib/                # anim.js (GSAP setup), api.js (fetch wrapper)
│       └── index.css           # design tokens (CSS vars), light/dark, aurora hero
│   └── tests/                  # unit/ + integration/ (Vitest)
├── server/                      # OPTIONAL Express + Mongoose
│   └── src/                     # index.js, db.js, models/{Progress,Note}, routes/{progress,notes}
├── scripts/kill-dev.mjs         # frees stuck dev ports (Windows EACCES fix)
├── wiki/                        # claude-obsidian memory vault (§16)
├── .github/workflows/ci.yml     # CI (§14)
├── dropoff/                     # gitignored — personal source docs (analyzed, never committed)
├── CLAUDE.md · SECURITY.md · CONTENT.md · SETUP.md · README.md · DESIGN.md
└── package.json                 # workspaces + scripts
```

---

## 6. Content architecture (curriculum)

**Model:** `Tracks (4) → Modules (16, ordered by `level` 1→6) → Lessons (51)`.

- `data/curriculum.js` — `TRACKS`, `MODULES`, and derived lookups/helpers (`modulesForTrack`,
  `lessonsForModule`, `siblingLessons` for prev/next, `lessonById`, `countLessons`).
- `data/lessons/<track>.js` — lesson objects; aggregated by `data/lessons/index.js`.
- `data/glossary.js` — glossary **auto-built** from every lesson's `keyTerms`.

**Lesson schema:**
```js
{ id, module, order, kind, template?, title, difficulty, summary, prompt,
  keyTerms: [{ term, def }], codeNotes?: [{ label, code, note? }],
  starterCode?, solutionCode?, explanation, tags, readOnly?, lockedFiles? }
```
- `kind`: `component|utility|project` → live editor · `quiz` → reveal card · `concept` → reading (+ optional snippet).
- `template`: `react|vanilla|static` (backend interactive lessons use `vanilla` in-browser).
- **Adding a lesson** = append one object to the track file; it flows automatically into the sidebar,
  module page, prev/next, and glossary. No wiring (ADR #5 → #6).

**Tracks & modules:** Frontend (foundations, css-layout, js-core, react, ui) · Backend (node, rest, data,
auth) · Full-Stack (connect, data, deploy) · Advanced (**algorithms**, projects/Snake, system design, AI).

---

## 7. The live-code showcase framework

- **`LessonView`** — the single path every lesson flows through; branches on `kind`. Wraps interactive
  areas in `ErrorBoundary`.
- **`LiveCode`** — Sandpack wrapper. Lazy-loads `@codesandbox/sandpack-react` (~1 MB) via `React.lazy` so
  roadmap/module pages stay fast. Supports `readOnly` and `lockedFiles` (lock scaffolding, edit the rest).
  **Reset** bumps a React `key` to remount the provider and restore starter code. Carries its **own**
  `ErrorBoundary` (defense-in-depth, keyed to Reset).
- **Supporting:** `KeyTerms` (the "lingo" callout), `CodeNotes` (the "🧩 Code to reach for" callout —
  read-only language idioms per lesson, aggregated conceptually by the Algorithms & DS cheat-sheet lesson),
  `QuizCard` (reveal), `Markdown` (react-markdown + **remark-gfm** for tables, **no raw HTML**),
  `Collapsible`, `LessonCard`.

---

## 8. Progress & state model

- **`localStorage` is the single source of truth** (`ProgressContext.jsx`, key `gallore:progress:v2`) —
  no server round-trip, survives the backend being off (ADR #13 supersedes #4).
- **Two units:** `modules {slug:true}` = primary "Mark as learned" (drives all bars); `lessons {id:true}`
  = optional finer self-check.
- **Cross-tab sync** via the `storage` event. **TopBar** shows "Saved on device". Progress page = control
  center + confirm-gated **Reset**. See vault [[progress-model]].

---

## 9. UI, theming & motion

- **Tailwind** utilities over **CSS-variable design tokens** in `index.css` (RGB triplets → semantic
  colors `surface`, `content`, `brand`…). Light/dark via `data-theme` on `<html>` (`ThemeContext`).
- **Motion (GSAP):** `lib/anim.js` registers ScrollTrigger, exposes `prefersReducedMotion()`, shared
  EASE/DUR. `Reveal` does fade+rise entrances. **Principle:** content is always rendered and animated
  from hidden→natural (never CSS-hidden), so it stays visible if JS fails; all effects no-op under
  `prefers-reduced-motion` (ADR #11).

---

## 10. Backend (optional)

- **Express + Mongoose (Atlas M0).** `models/{Progress,Note}`, `routes/{progress,notes}`, `db.js`.
- **Graceful no-DB fallback:** if `MONGO_URI` is unset or the API is down, routes return
  `persisted:false` (202) and the client keeps working from `localStorage`. The client no longer uses the
  progress routes (kept for possible future features).

---

## 11. Security model & preventative measures

The complete threat model lives in [`SECURITY.md`](./SECURITY.md). Summary of every safeguard:

### Live-editor safety (ADR #17)
| Threat | Status | Mechanism |
|---|---|---|
| Malicious code touching the host / stealing progress | **Prevented** | Sandpack **cross-origin sandboxed iframe** — no access to host DOM, React state, `localStorage`, cookies |
| Runtime errors / crashes | **Contained** | Two `ErrorBoundary` layers (`LessonView` + `LiveCode`'s own); proven by `ErrorBoundary.test.jsx` |
| **Infinite loops** | **Isolated + recoverable** | Runs on the iframe's own thread (host stays responsive); **Reset destroys the iframe**. Not *prevented* — a sync loop can't be interrupted cross-thread; option `autorun:false` exists if prevention is wanted |
| External network requests | **Low risk** | Iframe can `fetch()` out but is isolated from all host data |
| Host-side injection | **Prevented** | No `eval`/`dangerouslySetInnerHTML` of user input; `react-markdown` with **no raw-HTML** |
| Focus/scaffolding integrity | Enforced | `readOnly` / `lockedFiles`; integrity-tested |

### Repo & data hygiene
- **No secrets committed** — `.gitignore` blocks `.env`/keys/`*.pem`/`*.key`; only `*.env.example` tracked.
  Anything `VITE_*` is bundled into the public client — documented as never-for-secrets.
- **PII / privacy:** `dropoff/` (personal source docs) and `wiki/private/` (resume-derived experience,
  behavioral prep) are **gitignored — never pushed**. Verified pre-commit each time.
- **Git identity scoped** to `genepaolo <…@users.noreply.github.com>`; personal gmail was scrubbed from
  history (filter-branch) and is blocked from re-entering.
- **Correctness as a guardrail:** taught utilities are **execution-tested**; algorithm lessons assert
  **brute == optimized** so a regression can't ship silently.
- **CI gate:** `npm ci` from the lockfile → test → build on every push/PR (§14).

### Developer-environment safety (this machine)
- **Dev-port hygiene:** `scripts/kill-dev.mjs` + `predev` hooks + `npm run kill` free a stuck port (the
  Windows "unauthorized access"/EACCES held-socket case; uses `netstat -ano` for Vite's IPv6 `::1:5173`).
- **`rm` routed to the Recycle Bin** (PowerShell `rm/del/ri/erase` + Git Bash `rm`) so accidental deletes
  are recoverable; `Remove-Item` / `\rm` remain as permanent-delete escape hatches.

---

## 12. Testing strategy

**Vitest, 106 tests, all green.** Tests live in `client/tests/`.

| Suite | What it guards |
|---|---|
| `unit/content-integrity.test.js` | Dangling module/track refs, duplicate ids, required fields, valid enums, unique order-within-module, well-formed `keyTerms`/`lockedFiles` |
| `unit/curriculum.test.js` | Curriculum helpers (modulesForTrack, siblings, lookups) |
| `unit/glossary.test.js` | Auto-built glossary correctness |
| `unit/lesson-code.test.js` | **Every** snippet compiles (esbuild, node env) |
| `unit/taught-logic.test.js` | **Executes the real taught code** and asserts behavior; algorithm lessons assert **brute == optimized** |
| `integration/ErrorBoundary.test.jsx` | A throwing block renders a contained fallback, page survives |
| `integration/ProgressContext.test.jsx` | Offline localStorage progress logic |

> Note: an esbuild dev-only advisory (via vite/vitest) is not in the prod build — don't `audit fix --force`.

---

## 13. CI/CD

`.github/workflows/ci.yml` — on push/PR to `main`: **Node 22**, `npm ci` (clean, from lockfile) → `npm test`
→ `npm run build`. `concurrency` cancels superseded runs; `permissions: contents: read`. Status badge in README.

---

## 14. Design decisions (ADR register)

Full records: [`wiki/decisions/decisions.md`](./wiki/decisions/decisions.md). Summary:

| # | Decision |
|---|---|
| 1 | **Sandpack** for live-editable code (over react-live / Monaco+eval) — highest fidelity |
| 2 | **Reset via key-remount** — simplest reliable full reset |
| 3 | **MongoDB Atlas** (cloud) over local Mongo |
| 4 | Offline-first progress *(superseded by #13)* |
| 5 | Content as plain objects *(superseded by #6 — now `data/lessons/<track>.js`)* |
| 6 | **Curriculum model** (Tracks → Modules → Lessons) with `level` ramp |
| 7 | Pedagogy: `keyTerms` + auto-built **Glossary** |
| 8 | Section-level isolation via **ErrorBoundary** |
| 9 | **Lazy-load Sandpack** (code-split) |
| 10 | Backend lessons run in-browser (`vanilla` template) |
| 11 | **GSAP** motion system, reduced-motion-safe |
| 12 | Chrome DevTools MCP — not connected (no in-browser screenshot pass) |
| 13 | **Progress = offline, local-only, module-first** (supersedes #4) |
| 14 | Dev-port auto-cleanup (`predev` + `npm run kill`) |
| 15 | **Vitest** suite for study-material correctness |
| 16 | Frontend Interview Handbook = content source of truth |
| 17 | **Live-editor safety model** + per-lesson restrictions |

**Open questions:** auth (none — single user); a client Notes UI (server API exists, editor not built);
mobile nav (sidebar desktop-only; drawer backlog).

---

## 15. Knowledge base & memory system

The project uses a **claude-obsidian** Obsidian vault (`wiki/`) as cross-session LLM memory (Mode B —
Repository/Architecture + session memory).

- **Structure:** `index.md` (catalog) · `hot.md` (~500-word recent-context cache, read first) ·
  `log.md` (append-only, newest on top) · `overview.md` · `decisions/` (ADRs) · `modules/` · `concepts/` ·
  `sessions/` · `meta/` (dashboards, planning, lint reports, resource hub).
- **Conventions:** YAML frontmatter (`type, status, created, updated, tags`); `[[wikilinks]]` by unique
  filename; `hot.md` overwritten each update; `log.md` append-only.
- **Maintenance:** `wiki-lint` health checks (orphans, dead links, stale claims, frontmatter gaps) →
  `meta/lint-report-*.md`.
- **Local memory** (outside the repo): `~/.claude/…/memory/` holds durable facts (rm→recycle-bin,
  TS/JS-not-Java, verify-prep-against-public-sources, prep personalization & privacy).

---

## 16. AI-assisted development (Claude Code & skills)

Built with **Claude Code** (Opus 4.x) as a pair-engineer. Practices and skills used:

- **claude-obsidian** skill family — the vault's engine: `wiki` (setup), `wiki-lint` (health checks, run
  this session), `wiki-ingest`/`save`/`autoresearch` (available), plus `obsidian-markdown` conventions.
- **Web research** — `WebSearch`/`WebFetch` to scrape and **verify** resources and to re-check algorithm
  approaches/complexity against public LeetCode/canonical sources (never trusting notes blindly).
- **Karpathy-style working principles** (think-first, simple, surgical); **ui-ux-pro-max** /
  **frontend-design** referenced for visual work (not installed — visual choices were made by hand).
- **Guardrails encoded for the AI:** teach in **TS/JS, not Java**; keep learning modules **general** while
  behavioral prep is **personalized** and kept private; verify prep against public sources; keep
  explanations simple; never commit PII/secrets.
- **Process:** each work session ends by updating `hot.md`, prepending `log.md`, and filing a `sessions/`
  note + any new ADRs — so context survives across sessions.

---

## 17. Interview-prep curation layer

The curriculum is curated toward a **front-end-leaning full-stack** target role (exemplar: a Snap-style
Full Stack Engineer JD). Artifacts:

- [`wiki/meta/target-role-profile.md`](./wiki/meta/target-role-profile.md) — JD → coverage map +
  re-prioritized roadmap (FE performance → AI-code-auditing → TypeScript → FE system design → behavioral).
- [`wiki/meta/algo-source-neetcode.md`](./wiki/meta/algo-source-neetcode.md) — the author's NeetCode/Blind-75
  notes (16 pattern categories, ~114 problems) → algorithm lesson map (pattern-first, brute→optimized,
  test-verified). 9 of 16 categories built.
- [`wiki/meta/prep-resources.md`](./wiki/meta/prep-resources.md) — curated **GitHub repos & guides** per
  prep gap (see §18).
- `wiki/private/` (gitignored) — resume-derived candidate profile + behavioral question bank.

---

## 18. External resources & references

**Content sources:** Frontend Interview Handbook (primary), GreatFrontEnd, `system-design-primer`
(donnemartin), MDN, and the author's NeetCode/Blind-75 notes.

**Curated GitHub repos / guides** (full list in `wiki/meta/prep-resources.md`):
- **DSA:** trekhleb/javascript-algorithms · seanprashad/leetcode-patterns · NeetCode.
- **Front-end:** yangshun/front-end-interview-handbook · greatfrontend/top-javascript-interview-questions.
- **Performance:** web.dev Core Web Vitals · MDN Critical Rendering Path.
- **TypeScript:** type-challenges/type-challenges · TS Handbook.
- **System design:** greatfrontend/awesome-front-end-system-design · donnemartin/system-design-primer · Hello Interview.
- **Behavioral:** yangshun/tech-interview-handbook · ashishps1/awesome-behavioral-interviews.
- **AI-assisted eng:** OpenSSF AI-code-assistant security guide; know "slopsquatting"; Semgrep/Snyk/CodeQL.

**Key libraries** (see §4) with their upstream docs are the authoritative references for Sandpack, GSAP,
React Router, Tailwind, Vite, Vitest, Express, Mongoose.

---

## 19. Developer workflow & conventions

- **Commands:** `npm install` · `npm run dev` (client :5173 + server :5000) · `npm run dev:client`
  (standalone) · `npm test` · `npm run build` · `npm run kill` (free stuck ports) · `npm run seed` (Atlas).
- **Conventions:** ESM only; functional components + hooks; Tailwind utilities over hard-coded colors;
  keep `LessonView` the single lesson path (branch on `kind`, don't fork); keep Sandpack lazy; motion
  reduced-motion-safe; run `npm test` before committing.
- **Git:** commit to the noreply identity; never commit secrets/PII; stop dev servers with Ctrl+C.

---

## 20. Known limitations & roadmap

- **Content gaps (target-weighted):** finish the DSA patterns (heap, intervals, greedy, graphs, tries,
  bit-manipulation, math); build **FE performance/rendering**, **AI-code-auditing**, **TypeScript**,
  **FE system design**, and **behavioral** modules; deepen **MongoDB** (data-modeling/indexing) content.
- **App:** no client Notes UI; sidebar is desktop-only (drawer backlogged); no visual/screenshot polish
  pass (design skills + Chrome DevTools MCP not connected); Sandpack chunk is large by nature (lazy-loaded).
- **Infinite-loop prevention** in the live preview is intentionally *not* implemented (isolation + Reset is
  the chosen model); `autorun:false` is the available stronger guard.

---

## 21. Appendix — internal glossary

- **Track / Module / Lesson** — the three-level curriculum hierarchy.
- **kind** — a lesson's type (`component|utility|project|quiz|concept`) that `LessonView` branches on.
- **template** — the Sandpack environment (`react|vanilla|static`).
- **taught-logic** — the test suite that executes the real code a lesson teaches and asserts it's correct.
- **hot cache** — `wiki/hot.md`, the recent-context summary read at the start of each session.
- **ADR** — Architecture Decision Record (`wiki/decisions/decisions.md`).
