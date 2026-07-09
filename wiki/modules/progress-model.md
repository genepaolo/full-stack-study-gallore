---
type: module
title: "progress-model"
status: active
created: 2026-07-09
updated: 2026-07-09
tags: [module, frontend, state]
---

# progress-model

How the study guide tracks what the learner has completed. This is the app's one piece of real,
persistent state — deliberately **offline and local-only**. The decision history lives in
[[decisions]] (#4 → superseded by #13); this page is the current *what*.

## Source of truth

`localStorage` is the **single** source of truth. Owned by `context/ProgressContext.jsx`, key
**`gallore:progress:v2`**. There is no server round-trip: progress survives the backend being off,
unpublished, or "opening and closing." (The Express `progress` routes still exist but the client no
longer reads them — see [[server]].)

## Two units

- **modules** — `{ [slug]: true }`. The **primary** unit. Set by a manual "Mark as learned" toggle;
  drives the overall progress bar and every per-track bar.
- **lessons** — `{ [id]: true }`. An **optional, finer** self-check. Does not drive the bars.

## Where you mark

Module / Track / **Progress** pages. The Progress page is the control-center: per-module checkboxes
plus a **confirm-gated Reset** that clears the key.

## Sync & resilience

- **Cross-tab sync** via the browser `storage` event — mark in one tab, other tabs update live.
- **TopBar** shows "Saved on device" (not a server-sync indicator).
- Reads are guarded so a missing/whitelisted `localStorage` never throws (covered by the offline
  test in [[testing]]).

## Why local-only (short version)

An earlier on-mount server read could clobber local progress with an empty/fresh server whenever the
backend restarted. Making `localStorage` authoritative removed that failure mode. Full rationale:
[[decisions]] #13 (supersedes #4).

Related: [[client]] · [[server]] · [[decisions]] · [[testing]]
