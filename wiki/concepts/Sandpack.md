---
type: concept
title: "Sandpack"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [concept, tooling]
---

# Sandpack

CodeSandbox's in-browser bundler (`@codesandbox/sandpack-react`). Powers every editable code block.

- Templates used: `react` (UI components), `vanilla` + console (JS utilities), `static` (CSS).
- High-level `<Sandpack>` renders editor + preview; theme synced to app light/dark.
- Reset in this app = remount via `key` change (see [[showcase-framework]]).
- Trade-off: heavy bundle (~950 kB gzip ~317 kB) — acceptable for a study tool. → [[decisions]] #1.
