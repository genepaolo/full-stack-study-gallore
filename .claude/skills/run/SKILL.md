---
name: run
description: Launch and browser-verify the full-stack-gallore study-guide client. Starts the Vite dev server on :5173 and drives the real app in Chromium (Python Playwright + the locally-installed browser) to confirm lessons/modules actually render — screenshots + text assertions, no cloud MCP needed. Use when asked to run, start, view, or screenshot the app, or to confirm new lesson content renders in the real UI.
---

# Run & verify the study-guide client

This app is a **React 18 + Vite SPA** (client runs fully standalone; the Express server is optional).
The live code editors use **Sandpack**, which reaches a remote CDN — offline that logs
`ERR_CONNECTION_TIMED_OUT`, which is **expected and unrelated to lesson content**.

There is **no Chrome DevTools MCP** in this environment, but browser verification still works:
the `playwright` on PATH is **Python Playwright**, and Chromium is installed under
`~/AppData/Local/ms-playwright/`. That combination drives the real app headlessly.

## 1. Start the dev server (background)

```bash
cd "<repo>" && npm run dev:client   # run_in_background: true
```

- Serves `http://localhost:5173/`. A `predev:client` hook auto-frees the port first.
- Wait for the `Local:   http://localhost:5173/` line, then smoke-test:
  `curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/` → expect `200`.
- **Windows port note:** if it ever reads as EACCES / "unauthorized access", that's a held port,
  not auth — `npm run kill` frees it (uses `netstat -ano`; Vite binds IPv6 `::1:5173`).

## 2. Drive it in a real browser (don't just launch it)

Routes (from `client/src/App.jsx`): `/`, `/track/:slug`, `/module/:slug`, `/lesson/:id`,
`/glossary`, `/progress`. Module/lesson slugs come from `data/curriculum.js` + `data/lessons/`.

Use the committed driver, which navigates to a set of pages, asserts expected text is in the
rendered `body`, screenshots each full page, and reports any console/page errors:

```bash
python "<repo>/.claude/skills/run/drive.py" \
  /module/fe-paradigms:"Functional Programming" \
  /lesson/fe-fp-pure:"Pure functions" \
  /module/adv-sysdesign:"System Design"
```

Each arg is `path:expectedSubstring` (omit `:substring` to just screenshot). Screenshots land in
the OS temp dir it prints; **open them and look** — a blank frame is a failed launch, not a pass.
It exits non-zero if any expected substring is missing. With no args it runs a default sweep of the
newest modules/lessons.

## 3. Stop it

```bash
cd "<repo>" && npm run kill    # frees :5173; the background npm task then exits (non-zero is fine)
```

## What "verified" looks like

- Each target page returns text you expect (breadcrumb, title, key-terms, codeNotes, prev/next).
- Sidebar module counts reflect new lessons.
- Only console errors are the Sandpack CDN timeouts. Any *other* error (a real `PAGEERROR`, a React
  crash, a missing route) is a genuine failure — investigate before claiming success.

## Notes

- `npm test` (Vitest, 160+) and `npm run build` are the fast correctness gates; this skill is the
  **in-browser** gate that catches render/route regressions tests can't.
- The taught-logic tests only exercise `vanilla` lessons; React `component` demos are Sandpack-only,
  so this browser pass is the one place their JSX is actually mounted.
