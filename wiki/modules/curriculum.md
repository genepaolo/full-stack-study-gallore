---
type: module
title: "curriculum"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [module, content]
---

# curriculum

The study-guide backbone: ordered **Tracks → Modules → Lessons**.

- `data/curriculum.js` — `TRACKS` (4) and `MODULES` (15, ordered by `level` 1→6) + helpers
  (`modulesForTrack`, `lessonsForModule`, `siblingLessons` for prev/next, `lessonById`).
- `data/lessons/<track>.js` — lesson objects; aggregated by `data/lessons/index.js`.
- `data/glossary.js` — glossary auto-built from every lesson's `keyTerms`.

## Lesson shape
`{ id, module, order, kind, template?, title, difficulty, summary, prompt, keyTerms[],
starterCode?, solutionCode?, explanation, tags[] }`.

**kind**: `component` | `utility` | `project` (live editor) · `quiz` (reveal) · `concept` (open
reading + optional snippet). Backend interactive lessons use the `vanilla` template.

## Adding a lesson
Append one object to the matching track file → it appears in the sidebar, module page, prev/next
progression, and glossary automatically. See root `CLAUDE.md` → "How to add a lesson".

## Current coverage (42 lessons)
Frontend (foundations, CSS layout, **JS core: closures/this/debounce/promiseAll/throttle/curry/
deepClone/flatten/memoize**, React, **UI: accordion/tabs/modal/todo/star-rating/signup-form/
carousel/stopwatch**) · Backend (Node/Express, REST, Mongo, Auth) · Full-Stack (connect, data
fetching, deploy) · Advanced ([[showcase-framework|Snake]], system design, AI workflow). Expansion
plan: [[expansion-roadmap]] · [[system-design-plan]].
