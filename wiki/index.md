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
- **`../DESIGN.md`** — extensive design document (architecture, stack, security, ADRs, resources, AI build process)
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
- [[algo-source-neetcode]] — NeetCode/Blind-75 notes (Paolo 114.docx) → algo/ds lesson map + pending batches
- [[prep-resources]] — curated resources & GitHub repos per prep gap (DSA, perf, TS, sysdesign, AI-audit, behavioral)
- [[expansion-roadmap]] — GreatFrontend gap analysis + prioritized expansion (P0: UI + JS utils)
- [[system-design-plan]] — system-design sub-curriculum (system-design-primer + GreatFrontend)

## Concepts
- [[Sandpack]] · [[MongoDB Atlas]]
- _Frontend-interview terms now live in the app's Glossary (data/glossary.js), auto-built from lesson keyTerms._

## Sessions
- [[2026-07-07-init]] — initial build
- [[2026-07-07-curriculum]] — curriculum restructure & full-stack expansion
- [[2026-07-07-expansion-and-tooling]] — progress model, GSAP, tests, CI, security, P0 content
- [[2026-07-09-content-buildout]] — DSA taxonomy finished; FE performance, AI-audit & TypeScript modules
- [[2026-07-10-oop-fp]] — OOP & Functional Programming module (`fe-paradigms`, 5 lessons)
- [[2026-07-10-react-depth]] — React Depth & Performance module (`fe-react-depth`, 5 lessons); all P1 closed
- [[2026-07-10-fe-system-design]] — Frontend system design batch (`adv-sysdesign` +4); first P2
