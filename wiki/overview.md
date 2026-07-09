---
type: meta
title: "Project Overview"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [overview]
---

# full-stack-gallore — Overview

A personal self-help study app that encapsulates the
[Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/). It showcases the
components, utilities, and concepts you'd be tested to **build, understand, or explain** — each
paired with a **live, editable code block** (Sandpack) and a **reset** button.

## Goal

Learn frontend-interview material by *doing*: read a prompt, edit real code, watch it react, reset,
and mark it complete. Track progress over time.

## Stack

- **Client** — React + Vite + Tailwind, live code via [[Sandpack]].
- **Server** — Express + Mongoose on [[MongoDB Atlas]] (progress, notes, snippets).
- **Monorepo** — npm workspaces (`client`, `server`).

## Modules

- [[client]] — UI, routing, learning-module framework, curriculum + glossary.
- [[server]] — REST API + Mongoose models with a graceful no-DB fallback.
- [[showcase-framework]] — the `LiveCode` + `LessonView` pattern every lesson flows through.
- [[curriculum]] — Tracks → Modules → Lessons, as plain objects; auto-built glossary.
- [[progress-model]] — offline, local-only progress tracking (localStorage single source of truth).

## Curriculum (learning path)

Ordered **Tracks → Modules → Lessons** (`data/curriculum.js`), ramping beginner→pro via a module
`level`:

1. **Frontend** — HTML/CSS foundations, CSS layout, JS core, React, UI components.
2. **Backend** — Node & Express, REST design, MongoDB & Mongoose, auth & security.
3. **Full-Stack** — connecting FE↔BE (CORS, request lifecycle), data fetching, deployment.
4. **Advanced** — Snake game project, system design, AI in the dev workflow.

Each lesson: explanation + **key terms (lingo)** + a live editable code block. Terms aggregate into
a searchable **Glossary**.

## Key decisions

See [[decisions]] — Sandpack (lazy) for live code, Atlas for DB, key-remount reset, offline
local-only [[progress-model|progress]], curriculum model, and section-level `ErrorBoundary` isolation.
