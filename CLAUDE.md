# full-stack-gallore

A personal, progressive **full-stack interview study guide**, inspired by the Frontend Interview
Handbook (https://www.frontendinterviewhandbook.com/) and extended across the whole stack. Content
is organized as a **curriculum** — ordered **Tracks → Modules → Lessons** — that ramps from HTML to
system design. Every lesson pairs a plain-English explanation and its **key terms (lingo)** with a
**visible, editable code block + live preview + reset**, so you can poke at how things interact.
Interactive areas are isolated (Sandpack iframe + an ErrorBoundary) so a broken edit only affects
its own section.

## Stack

- **Client** — React 18 + Vite + Tailwind CSS. Live code powered by **Sandpack**
  (`@codesandbox/sandpack-react`).
- **Server** — Express + Mongoose (MongoDB Atlas). Optional/legacy for progress (see below); still
  available for future features (notes, snippets). Single-user, no auth.
- **Monorepo** — npm workspaces (`client`, `server`). `npm run dev` runs both concurrently.

## Progress tracking (offline, local-only)

Progress lives entirely in **`localStorage`** — it is the single source of truth (no server
round-trip), so it's instant, works with the backend off, and can't be clobbered by a fresh/empty
server on startup. State (`ProgressContext.jsx`, key `gallore:progress:v2`):

- `modules: { [slug]: true }` — the **primary** unit; you manually "Mark as learned" per module.
  Drives the overall + per-track progress bars. (`modulesLearned` metric.)
- `lessons: { [id]: true }` — optional finer self-check within a module ("Mark lesson done").

Mark modules from the **Module page**, the **Track page**, or the **Progress page** (control-center
with per-module checkboxes + a **Reset** button, confirm-gated). Syncs across tabs via the `storage`
event. The server progress routes still exist but the client no longer calls them.

## Content model: Tracks → Modules → Lessons

- **Tracks** (4): `frontend`, `backend`, `fullstack`, `advanced` — defined in `data/curriculum.js`.
- **Modules** (15): ordered by a `level` (1→6) for a smooth beginner→pro ramp — also in `curriculum.js`.
- **Lessons**: plain objects in `data/lessons/<track>.js`, aggregated by `data/lessons/index.js`.
- **Glossary**: auto-built from every lesson's `keyTerms` in `data/glossary.js`.

## Layout

```
client/src/
  components/layout/     AppShell, Sidebar (tracks→modules), TopBar, ThemeToggle
  components/showcase/   LiveCode (lazy Sandpack + reset), LessonView, LessonCard, QuizCard,
                         KeyTerms (lingo), Collapsible, Markdown, ErrorBoundary
  components/ui/         primitives (Button, Badge, DifficultyBadge, KindBadge, Card, ProgressBar)
  data/curriculum.js     tracks + modules + progression helpers (prev/next, per-module lookups)
  data/lessons/          frontend.js, backend.js, fullstack.js, advanced.js, index.js
  data/glossary.js       derived from lessons' keyTerms
  context/               ProgressContext (offline-first), ThemeContext
  pages/                 HomePage (roadmap), TrackPage, ModulePage, LessonPage, GlossaryPage, ProgressPage
  lib/api.js             fetch wrapper -> server
server/src/
  models/                Progress, Note
  routes/                progress, notes  (mounted under /api)
  db.js  index.js
wiki/                    Obsidian vault — Claude's cross-session memory (claude-obsidian)
```

## How to add a lesson

Append one object to the matching track file in `client/src/data/lessons/` — it flows automatically
into the sidebar, module page, progression (prev/next), and glossary. Nothing else to wire.

```js
{
  id: "fe-accordion",           // unique, kebab-case
  module: "fe-ui",              // must match a module slug in curriculum.js
  order: 1,                     // position within the module
  kind: "component",            // component | utility | quiz | concept | project
  template: "react",            // react | vanilla | static (Sandpack); omit for pure quiz/concept
  title: "Accordion",
  difficulty: "easy",          // easy | medium | hard
  summary: "one-line card blurb",
  prompt: `markdown intro / the task`,
  keyTerms: [{ term: "aria-expanded", def: "…" }],   // the "lingo" callout + glossary source
  starterCode: { "/App.js": "…" },   // shown first + restored on Reset (interactive kinds)
  solutionCode: { "/App.js": "…" },  // optional, revealed on demand
  explanation: `markdown — "what interviewers probe"; for concept kind this is the open body`,
  tags: ["react", "state"],
}
```

**Kinds:** `component`/`utility`/`project` show a live editor; `quiz` shows a reveal card; `concept`
shows the explanation openly (reading) with an optional small live snippet. Backend interactive
lessons use the `vanilla` template to run illustrative server-flavored JS safely in the browser.

## Conventions

- ES modules everywhere (`"type": "module"`). Functional components + hooks only.
- Tailwind utility classes; design tokens are CSS variables in `client/src/index.css`
  (light/dark via `data-theme`). Prefer tokens over hard-coded colors.
- Keep the `LessonView` pattern the single path every lesson flows through — don't fork it; branch
  on `kind` instead.
- Reset works by bumping a React `key` on the Sandpack provider to remount with `starterCode`.
- Wrap any interactive area in `ErrorBoundary` so a failure stays contained to its section.
- Sandpack is `lazy`-loaded in `LiveCode.jsx` to keep initial load fast — keep it that way.

## Skills to use

- **claude-obsidian** (installed) — persist decisions/progress at end of a session with
  `claude-obsidian:save`; recall with `claude-obsidian:wiki-query`. Vault lives in `wiki/`.
- **Karpathy skills** — think-before-coding, simplicity-first, surgical changes, goal-driven.
- **ui-ux-pro-max** + **frontend-design** — load before building any visual layer; keep the UI
  polished and consistent (spacing scale, type scale, tasteful motion, light/dark).

## Wiki knowledge base (cross-session memory)

Path: `./wiki` (claude-obsidian vault). At the **start** of a session, read `wiki/hot.md` for recent
context; if you need more, `wiki/index.md` then the specific page. At the **end** of a session,
update `wiki/hot.md`, prepend a `wiki/log.md` entry, and add a `wiki/sessions/` note (or run
`claude-obsidian:save`). Record architecture choices in `wiki/decisions/`.

## Commands

- `npm install` — install all workspaces.
- `npm run dev` — client on :5173, server on :5000 (concurrently).
- `npm run dev:client` — client only (standalone; no DB needed).
- `npm run kill` — free the dev ports (5173–5177, 5000) if a previous server is stuck.
- `npm run seed` — seed starter content into Atlas (optional).

Always stop dev servers with **Ctrl+C** so they clean up.

## Dev-port hygiene (Windows "unauthorized access" fix)

A `pre*` hook frees the port before each dev command, so a stuck previous run never blocks you:
`predev:client` runs `scripts/kill-dev.mjs 5173`; `predev:server` runs it for `5000`. The script is
**cross-platform** and only kills the process *listening on that specific port* (never a blanket
"kill all node", so your editor's language servers are safe).

- On Windows, a leftover Vite server surfaces as **"An attempt was made to access a socket in a way
  forbidden by its access permissions" / EACCES** — that's a busy/held port, not a real auth error.
  Run `npm run kill`.
- Implementation gotcha (already handled): Vite listens on **IPv6 loopback `::1:5173`**, so the
  killer uses plain `netstat -ano` (NOT `-p tcp`, which is IPv4-only and would miss it).
- Do **not** use Git Bash `pkill -f vite` on Windows — it doesn't reliably kill native `node.exe`.

## Setup notes

- The client runs fully standalone (`npm run dev:client`) — **progress needs no database**.
- The Express server is optional now. To use it for future features, copy `.env.example` to
  `server/.env` and set `MONGO_URI` (Atlas); without it the API logs a clear message and still runs.
