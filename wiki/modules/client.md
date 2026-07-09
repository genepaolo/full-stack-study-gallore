---
type: module
title: "client"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [module, frontend]
---

# client

React 18 + Vite + Tailwind frontend. Entry `client/src/main.jsx` wraps the app in
`ThemeProvider` → `ProgressProvider` → `BrowserRouter`.

## Layout
- `components/layout/` — `AppShell`, `Sidebar` (Track → Module nav + progress counts), `TopBar` ("Saved on device", theme), `ThemeToggle`.
- `components/showcase/` — see [[showcase-framework]].
- `components/ui/primitives.jsx` — `Card`, `Button`, `Badge`, `DifficultyBadge`.
- `context/` — `ThemeContext` (light/dark via `data-theme`), `ProgressContext` (offline, local-only — see [[progress-model]]).
- `pages/` — Home, Track, Module, Lesson, Glossary, Progress.
- `data/` — `curriculum.js` + `lessons/` + `glossary.js` (see [[curriculum]]).
- `lib/api.js` — fetch wrapper; per-browser `x-user-id`; relative `/api` proxied to :5000 (optional backend).

## Design tokens
CSS variables (RGB triplets) in `src/index.css`, consumed by Tailwind semantic colors
(`surface`, `content`, `brand`…). Light/dark switch via `data-theme` on `<html>`.

## Motion layer (GSAP)
- `lib/anim.js` — registers ScrollTrigger, `prefersReducedMotion()`, shared EASE/DUR.
- `components/anim/Reveal.jsx` — fade+rise entrance (mount or scroll; optional child stagger).
- Used by: hero (aurora `.hero-mesh` in `index.css` + staggered entrance), roadmap reveals,
  `ProgressBar` fill-on-view, `AppShell` route transitions, `Sidebar` entrance, `KeyTerms` stagger.
- All motion is reduced-motion-safe and content stays visible if JS fails. → [[decisions]] #11.

## Notes
- Progress is **offline, local-only** — `localStorage` (`gallore:progress:v2`) is the single source of
  truth; the client never round-trips to the server for progress. Full model: [[progress-model]].
- Related: [[server]], [[curriculum]], [[progress-model]], [[decisions]].
