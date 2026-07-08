---
type: module
title: "showcase-framework"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [module, core]
---

# showcase-framework

The single path every challenge flows through. Files in `client/src/components/showcase/`.

## Components
- **`LiveCode.jsx`** — wraps [[Sandpack]] (lazy-loaded/code-split). Props: `files`, `template`
  (`react`|`vanilla`|`static`), `showConsole`, `dependencies`. **Reset** = bump a React `key` to
  remount and reload `files`.
- **`LessonView.jsx`** — the one path every lesson flows through: breadcrumb, header (difficulty +
  kind + mark-complete), prompt, **KeyTerms** callout, an interactive block chosen by `kind`,
  collapsible solution/explanation, and prev/next progression.
- **`KeyTerms.jsx`** — the "lingo" callout (feeds the glossary too).
- **`QuizCard.jsx`** — reveal/hide answer for quiz lessons.
- **`LessonCard.jsx`** — ordered lesson row with completion state.
- **`ErrorBoundary.jsx`** — wraps each interactive block so a failure stays contained + retryable.
- **`Markdown.jsx` / `Collapsible.jsx`** — small helpers.

## Design rule
Keep `LessonView` the one pattern — don't fork it. Branch on `kind`
(`component`/`utility`/`project`/`quiz`/`concept`), not by copying the component. → [[decisions]] #2, #6, #8.
