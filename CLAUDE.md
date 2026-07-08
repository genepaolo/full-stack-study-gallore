# full-stack-gallore

A personal, progressive **full-stack interview study guide** (inspired by the Frontend Interview
Handbook, extended across the stack). Content is a **curriculum** — ordered **Tracks → Modules →
Lessons** ramping from HTML to system design. Each lesson pairs a plain-English explanation + **key
terms (lingo)** with a **live, editable code block (Sandpack) + reset**. Interactive areas are
isolated (Sandpack iframe + `ErrorBoundary`) so a broken edit only affects its own section.

**Repo:** https://github.com/genepaolo/full-stack-study-gallore · setup: [SETUP.md](./SETUP.md)

## ⚠️ Important notes (read before committing/pushing)

- **Never commit secrets.** No real `.env`, keys, tokens, or DB strings — only `*.env.example`
  placeholders are tracked (`.gitignore` enforces it). Anything `VITE_*` is bundled into the public
  client bundle — never put secrets there.
- **Git identity is privacy-scoped.** This repo's local git config is
  `genepaolo <genepaolo@users.noreply.github.com>` on purpose — do NOT commit the personal gmail. If
  it reappears, scrub with `git filter-branch --env-filter` + force-push (see `wiki/log.md`).
- **Dev-port stuck?** On Windows a leftover Vite server reads as *"unauthorized access"/EACCES* —
  that's a held port, not auth. Run `npm run kill`. A `predev` hook auto-frees it; the killer uses
  `netstat -ano` because Vite binds IPv6 `::1:5173`. Don't use Git Bash `pkill` on Windows.
- Always stop dev servers with **Ctrl+C** so they clean up.

## Stack

- **Client** — React 18 + Vite + Tailwind + GSAP; live code via **Sandpack** (lazy-loaded).
- **Server** — Express + Mongoose (Atlas). Optional — the client runs fully standalone.
- **Monorepo** — npm workspaces (`client`, `server`).

## Progress (offline, local-only)

`localStorage` is the single source of truth (`ProgressContext.jsx`, key `gallore:progress:v2`) — no
server round-trip, so it survives the backend being off. `modules {slug:true}` is the primary unit
(manual "Mark as learned"; drives the bars); `lessons {id:true}` is an optional finer self-check.
Mark from Module/Track/**Progress** pages (Progress = control-center + confirm-gated **Reset**);
syncs across tabs via the `storage` event.

## Content model & layout

Tracks (4: frontend/backend/fullstack/advanced) → Modules (15, ordered by `level` 1→6) → Lessons —
in `data/curriculum.js` + `data/lessons/<track>.js` (aggregated by `index.js`). Glossary auto-builds
from lesson `keyTerms` (`data/glossary.js`).

```
client/src/
  components/{layout,showcase,ui}/  AppShell/Sidebar/TopBar · LiveCode/LessonView/LessonCard/
                                    QuizCard/KeyTerms/ErrorBoundary · primitives, CheckToggle
  data/                             curriculum.js, lessons/, glossary.js
  context/                          ProgressContext, ThemeContext
  pages/                            Home, Track, Module, Lesson, Glossary, Progress
  lib/                              anim.js (GSAP), api.js
server/src/                         models/{Progress,Note}, routes/{progress,notes}, db.js, index.js
scripts/kill-dev.mjs  ·  wiki/ (Obsidian cross-session memory)
```

## How to add a lesson

Append one object to `client/src/data/lessons/<track>.js` — it flows into the sidebar, module page,
prev/next, and glossary automatically.

```js
{ id, module, order, kind, template, title, difficulty, summary,
  prompt, keyTerms: [{ term, def }], starterCode, solutionCode, explanation, tags }
```

- `kind`: `component|utility|project` → live editor · `quiz` → reveal card · `concept` → open
  reading (+ optional snippet). `template`: `react|vanilla|static` (backend uses `vanilla` in-browser).
- `module` must match a slug in `curriculum.js`; `id` is kebab-case & unique.

## Conventions

- ESM only; functional components + hooks. Tailwind utilities; design tokens are CSS vars in
  `index.css` (light/dark via `data-theme`) — prefer tokens over hard-coded colors.
- Keep `LessonView` the one path every lesson flows through — branch on `kind`, don't fork it.
- Reset = bump a React `key` on the Sandpack provider. Wrap interactive areas in `ErrorBoundary`.
- Keep Sandpack `lazy`-loaded (`LiveCode.jsx`). GSAP motion is reduced-motion-safe (`lib/anim.js`).

## Commands

- `npm install` · `npm run dev` (client :5173 + server :5000) · `npm run dev:client` (standalone)
- `npm run kill` (free stuck dev ports) · `npm run build` · `npm run seed` (Atlas, optional)

## Memory & skills

- **Wiki** (`./wiki`, claude-obsidian): start a session by reading `wiki/hot.md` → `index.md`; end by
  updating `hot.md`, prepending `log.md`, adding a `sessions/` note, recording choices in `decisions/`.
- Skills: **claude-obsidian** (installed) · **Karpathy** (think-first, simple, surgical) ·
  **ui-ux-pro-max** + **frontend-design** (not installed; load before visual work).
