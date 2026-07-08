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
- `components/layout/` — `AppShell`, `Sidebar` (category nav + counts), `TopBar` (sync indicator, theme), `ThemeToggle`.
- `components/showcase/` — see [[showcase-framework]].
- `components/ui/primitives.jsx` — `Card`, `Button`, `Badge`, `DifficultyBadge`.
- `context/` — `ThemeContext` (light/dark via `data-theme`), `ProgressContext` (offline-first).
- `pages/` — Home, Category, Challenge, Progress.
- `data/` — `categories.js` + `challenges/` (see [[content-registry]]).
- `lib/api.js` — fetch wrapper; per-browser `x-user-id`; relative `/api` proxied to :5000.

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
- Progress is optimistic + cached in `localStorage`; server is source of truth when reachable.
- Related: [[server]], [[decisions]].
