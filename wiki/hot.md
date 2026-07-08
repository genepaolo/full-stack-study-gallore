---
type: meta
title: "Hot Cache"
updated: 2026-07-07T20:15:00
---

# Recent Context

## Last Updated
2026-07-07. Fixed the Windows dev-server "unauthorized access" issue and added dev-port automation.

## Key Recent Facts
- The "unauthorized access" on `npm run dev:client` was **stale Vite servers holding port 5173**
  (Windows EACCES socket error), not a real auth problem. 5173 is not in a reserved range.
- Shipped `scripts/kill-dev.mjs` + `predev:client`/`predev:server` hooks + `npm run kill`. Frees the
  port before each dev run; kills only the process on that port (editor LSPs safe). Full note:
  [[dev-ports]]; decision [[decisions]] #14.
- Real bug caught + fixed while testing: Vite binds IPv6 `::1:5173`, so the killer must use
  `netstat -ano` (not `-p tcp`, which is IPv4-only).
- Verified end-to-end: with 5173 occupied, `dev:client` now frees it and rebinds 5173 (no bump).
- Progress remains offline/local-only (module-first) from the prior change ([[decisions]] #13).

## Active Threads
- **Chrome DevTools MCP still not connected** + design skills uninstalled → no in-browser screenshot
  pass yet. → [[decisions]] #12.
- **Owner**: run `npm run dev:client` → http://localhost:5173. If a port ever sticks: `npm run kill`.
  Stop servers with Ctrl+C.
- **Backlog**: more lessons/module; per-lesson notes UI; mobile nav drawer; visual polish pass.
