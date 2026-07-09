---
type: index
title: "Master Catalog"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [index]
---

# Master Catalog

## Meta
- [[overview]] — what the project is and why
- [[hot]] — recent-context cache (read this first)
- [[log]] — operation history

## Decisions
- [[decisions|Architecture Decisions]] — 10 ADRs + open questions

## Modules
- [[client]] — React/Vite/Tailwind frontend
- [[server]] — Express/Mongoose API
- [[showcase-framework]] — LiveCode + LessonView pattern (+ KeyTerms, ErrorBoundary)
- [[curriculum]] — Tracks → Modules → Lessons + glossary; how to add a lesson
- [[progress-model]] — offline, local-only progress (localStorage `gallore:progress:v2`)
- [[testing]] — Vitest suite (`npm test`); correctness guardrails

## Reference
- [[dev-ports]] — dev-port hygiene & the Windows "unauthorized access" fix (`npm run kill`)
- [[content-sources]] — source of truth for lesson content (Frontend Interview Handbook)

## Planning
- [[target-role-profile]] — curation target (Snap-style Full Stack Eng); JD→coverage map + re-prioritized roadmap
- [[expansion-roadmap]] — GreatFrontend gap analysis + prioritized expansion (P0: UI + JS utils)
- [[system-design-plan]] — system-design sub-curriculum (system-design-primer + GreatFrontend)

## Concepts
- [[Sandpack]] · [[MongoDB Atlas]]
- _Frontend-interview terms now live in the app's Glossary (data/glossary.js), auto-built from lesson keyTerms._

## Sessions
- [[2026-07-07-init]] — initial build
- [[2026-07-07-curriculum]] — curriculum restructure & full-stack expansion
- [[2026-07-07-expansion-and-tooling]] — progress model, GSAP, tests, CI, security, P0 content
