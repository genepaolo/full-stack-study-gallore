---
type: meta
title: "Lint Report 2026-07-09"
created: 2026-07-09
updated: 2026-07-09
tags: [meta, lint]
status: done
---

# Lint Report: 2026-07-09

Transport: filesystem floor (no CLI/MCP configured). DragonScale address-validation and
semantic-tiling checks skipped (opt-in scripts absent). 20 markdown pages scanned.

## Summary
- Pages scanned: 20
- Issues found: 7 classes (29 dead-link instances, 1 stale page, 1 stale ADR, 2 frontmatter gaps)
- Auto-fixed: dead links (rename + repoint), stale `client.md`, ADR #5 supersession note, frontmatter
- Needs review: none outstanding (all fixes applied this session)

## Dead Links
- **`[[decisions]]` — 25 references, all dead.** The target file is `decisions/adr-index.md`
  (basename `adr-index`), so Obsidian resolves `[[decisions]]` to nothing. Referenced from nearly
  every page (index, hot, log, overview, all modules, all concepts, all sessions).
  **Fix applied:** renamed `adr-index.md` → `decisions.md`. All 25 links now resolve; `[[adr-index]]`
  (which nothing referenced — an orphan-by-naming) is gone.
- **`[[content-registry]]` — 3 references, target never existed.** In `decisions.md` (ADR #5),
  `modules/client.md`, `sessions/2026-07-07-init.md`. The current content data model is documented in
  `[[curriculum]]` (`data/curriculum.js` + `data/lessons/` + `data/glossary.js`).
  **Fix applied:** repointed all three to `[[curriculum]]`.
- **`[[ChallengeView]]` — 1 reference (`log.md`).** Points to a real past component (renamed to
  `LessonView` during the curriculum refactor). `log.md` is append-only history.
  **Left as-is (informational):** editing the log would violate the append-only invariant.

## Stale Claims
- **`modules/client.md`** predated the curriculum refactor (ADR #6) and offline-local progress
  (ADR #13). It listed `pages/` as `Home, Category, Challenge, Progress`; `data/` as
  `categories.js + challenges/`; the Sidebar as "category nav"; the TopBar as a "sync indicator"; and
  progress as "offline-first / server is source of truth."
  **Fix applied:** refreshed to the current pages (`Home, Track, Module, Lesson, Glossary, Progress`),
  data files (`curriculum.js + lessons/ + glossary.js`), and offline-local progress model.
- **ADR #5 ("Content as plain objects")** describes the `data/challenges/` model, superseded by
  ADR #6 (curriculum). ADRs are immutable history.
  **Fix applied:** added a supersession note pointing to #6 and `[[curriculum]]` (original text kept).

## Frontmatter Gaps
- **`hot.md`**: missing `status`, `created`, `tags`. **Fix applied.**
- **`log.md`**: missing `status`, `created`, `tags`. **Fix applied.**
- (`sessions/2026-07-07-expansion-and-tooling.md` uses block-style `tags:` + `status: developing` —
  not a gap; earlier flat-grep false positive.)

## Orphan Pages
- None. `adr-index` was an orphan-by-naming (all inbound links used `[[decisions]]`); the rename
  resolves it. Every other page has ≥1 valid inbound link.

## Empty Sections
- None found.

## Cross-Reference / Growth
- **New page `[[progress-model]]`** created (`modules/`): consolidates the app's core state logic
  (localStorage `gallore:progress:v2`, modules-primary vs lessons-optional, cross-tab sync, Reset),
  which was previously scattered across ADR #4/#13 and root `CLAUDE.md` with no dedicated home.
  Wired into `index.md`, `overview.md`, `client.md`, and `decisions.md`.

## Naming Conventions
- Vault uses lowercase-kebab basenames for most notes (`content-sources`, `dev-ports`,
  `showcase-framework`) with Title-Case only for proper-noun concepts (`Sandpack`, `MongoDB Atlas`).
  Internally consistent; wikilinks match basenames. No violations after the `decisions.md` rename.
