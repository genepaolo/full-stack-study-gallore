# Security model

This is a **client-only, offline, single-user** study tool. The main question users ask: *can the
live code editors break or compromise the app?* Short answer: **no** — here's why, and what extra
guardrails exist.

## Threat model

There is no server storing other people's data and no untrusted third party injecting content into
your view. The only "untrusted" code is whatever **you** type or paste into a live editor. So the
concern is narrow: could an editor snippet damage the app, read your saved progress, or run
malicious JS against the host page?

## Why editor code can't harm the app

1. **Sandboxed, cross-origin iframe.** Every live editor is powered by **Sandpack**, which executes
   your code inside a sandboxed `<iframe>` served from a *different origin*. Cross-origin isolation
   means the code **cannot read or modify** the host page's DOM, its React state, `localStorage`
   (your progress), or cookies. It runs in its own world.
2. **Blast radius = that one block.** A broken edit or infinite loop only affects **its own
   preview**. Every editor is also wrapped in a React **`ErrorBoundary`**, so even a host-side
   render error is contained to that section with a per-section "Retry" (see
   `components/showcase/ErrorBoundary.jsx`). A test (`tests/integration/ErrorBoundary.test.jsx`)
   proves a throwing block does not crash the surrounding page.
3. **Reset restores instantly.** The **Reset** button re-mounts the editor with the original starter
   code, discarding any edits. A full page reload also clears everything (edits are never persisted).
4. **No `eval` of user content on the host.** The app never `eval`s or `dangerouslySetInnerHTML`s
   editor input on the host page — only Sandpack (sandboxed) executes it. Lesson prose is rendered
   with `react-markdown` **without** raw-HTML support, so markdown can't inject scripts either.

## Restricting what can be edited (per lesson)

To keep learners focused (and structure intact), lessons can lock parts of the editor:

- `readOnly: true` — the whole editor is **view-only**.
- `lockedFiles: ['/index.html']` — those files are read-only; the rest stay editable.

Example: the **CSS Box Model** lesson locks `/index.html` so you edit only `styles.css`. These are
validated by `tests/unit/content-integrity.test.js` (locked paths must exist).

> Note: locking is a **focus/UX** guardrail, not a security boundary — the security boundary is the
> Sandpack iframe above, which holds regardless of what's typed.

## Repo hygiene

No secrets are committed (`.gitignore` blocks `.env`/keys; only `*.env.example` placeholders are
tracked). Progress is stored only in your browser's `localStorage`. See `CLAUDE.md` → *Important notes*.

## Reporting

Personal project — open an issue on the repo if you spot something.
