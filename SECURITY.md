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

1. **Different-origin iframe (the same-origin policy is what isolates it).** Every live editor is
   powered by **Sandpack**, which runs your code inside an `<iframe>` served from a **different
   origin** than the app — a `*.sandpack-static-server.codesandbox.io` host, versus this app's own
   origin. The browser's **same-origin policy** then forbids that code from reading or modifying the
   host page's DOM, React state, `localStorage` (your progress), or cookies — those belong to a
   *different* origin. Verified empirically: host↔iframe reads are blocked in both directions.

   > **Where the isolation actually comes from (precise):** the preview iframe's `sandbox` attribute
   > grants `allow-same-origin`, so it is **not** forced into an opaque origin — the wall is purely
   > the **different host origin**. If the preview were ever served *same-origin* with the app
   > (e.g. same host, or via `srcdoc` + `allow-same-origin`), editor code *could* reach your
   > `localStorage`. The safety is the origin split, not the sandbox flag.
   >
   > **Supply-chain caveat:** CodeSandbox's bundler/static-server builds and hosts the preview, so it
   > is a third-party dependency. Your browser still keeps it off this app's origin, but a compromised
   > bundler could run code *inside* the (origin-isolated) preview — e.g. capture what you type into
   > that one editor. Low risk for an offline, single-user tool; that's the honest boundary.
2. **Blast radius = that one block.** A broken edit only affects **its own preview**. Every editor is
   wrapped in a React **`ErrorBoundary`** — both by `LessonView` *and* internally by `LiveCode` itself
   (defense-in-depth) — so even a host-side render or chunk-load error is contained to that section
   with a per-section "Retry" (`components/showcase/ErrorBoundary.jsx`). A test
   (`tests/integration/ErrorBoundary.test.jsx`) proves a throwing block does not crash the page.
3. **Reset restores instantly.** The **Reset** button re-mounts the editor (and its ErrorBoundary)
   with the original starter code, discarding edits and **destroying the preview iframe**. A full page
   reload also clears everything (edits are never persisted).
4. **No `eval` of user content on the host.** The app never `eval`s or `dangerouslySetInnerHTML`s
   editor input on the host page — only Sandpack (sandboxed) executes it. Lesson prose is rendered
   with `react-markdown` **without** raw-HTML support, so markdown can't inject scripts either.

## The four specific concerns

| Concern | Status | How |
|---|---|---|
| **Malicious code** (touch host, steal progress) | **Prevented** | Preview runs on a **different origin**; the same-origin policy blocks access to host DOM/state/`localStorage`/cookies. |
| **Runtime errors / crashes** | **Contained** | Sandpack shows the error inside its own iframe; the host is protected by two layers of `ErrorBoundary`. |
| **Infinite loops** (`while(true){}`) | **Isolated + recoverable** (see below) | Runs on the iframe's own thread — the **host app stays responsive**. Not *prevented*: the preview itself freezes until you Reset. |
| **External network requests** | **Low risk** | The iframe *can* `fetch()` external URLs, but it's isolated from all host data, so there's nothing sensitive to exfiltrate. Offline, single-user tool. |

## Infinite loops — the honest nuance

A synchronous infinite loop **cannot be interrupted from another thread in JavaScript**, so no host-side
timer can "kill" it mid-run. What protects you instead:

- **Isolation.** The loop runs on the *iframe's* thread, not the app's. The rest of the page — sidebar,
  navigation, other lessons — stays fully responsive. It can't hang the app.
- **Recovery.** **Reset** unmounts the editor and **removes the iframe**, which terminates the runaway
  code instantly. A page reload does the same.

Fully *preventing* the preview from freezing would require bundler-level loop-protection (injecting
iteration guards into every loop) or disabling auto-run — both trade off the "edit → instant preview"
experience. Given the host is already immune, we favor isolation + one-click recovery. (If desired,
`autorun: false` on the Sandpack options would require an explicit "Run" click before any edit executes —
a stronger infinite-loop guard at the cost of live-updating.)

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
