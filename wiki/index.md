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
- [[testing]] — Vitest suite (`npm test`); correctness guardrails

## Reference
- [[dev-ports]] — dev-port hygiene & the Windows "unauthorized access" fix (`npm run kill`)
- [[content-sources]] — source of truth for lesson content (Frontend Interview Handbook)

## Concepts
- [[Sandpack]] · [[MongoDB Atlas]]
- _Frontend-interview terms now live in the app's Glossary (data/glossary.js), auto-built from lesson keyTerms._

## Sessions
- [[2026-07-07-init]] — initial build
- [[2026-07-07-curriculum]] — curriculum restructure & full-stack expansion
