---
type: reference
title: "Dev-port hygiene & the Windows 'unauthorized access' fix"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [reference, devops, windows, troubleshooting]
---

# Dev-port hygiene

## Symptom
Running `npm run dev:client` on Windows fails with **"unauthorized access"** — actually Windows'
socket-permission error: *"An attempt was made to access a socket in a way forbidden by its access
permissions"* / `EACCES`, or Vite prints *"Port 5173 is in use, trying another one…"*.

## Root cause
A **previous dev server was still running** and holding the port. On this project it came from
background `npm run dev` runs whose processes weren't cleaned up. (Port 5173 is **not** in a Windows
reserved range — only 1462 is here — so it isn't a system reservation.)

## Fix (shipped)
- Root `package.json` scripts:
  - `predev:client` → `node scripts/kill-dev.mjs 5173` (auto-runs before `dev:client`)
  - `predev:server` → `node scripts/kill-dev.mjs 5000`
  - `kill` → frees `5173–5177, 5000` on demand: **`npm run kill`**
- `scripts/kill-dev.mjs` is cross-platform and kills **only the process listening on the given
  port** (never a blanket node kill → editor language servers are safe).

## Two gotchas (both handled)
1. **Vite binds IPv6 loopback `::1:5173`.** `netstat -ano -p tcp` lists **IPv4 only** and misses it —
   the script uses plain `netstat -ano`. This was a real bug caught during testing (killer reported
   "already free" while the port was held).
2. **Git Bash `pkill -f vite` does NOT reliably kill native Windows `node.exe`.** Use the npm script
   or PowerShell instead.

## Manual escape hatch (PowerShell)
```powershell
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'full-stack-gallore' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

## Habit
Stop dev servers with **Ctrl+C** in their own terminal so they clean up. See [[decisions]] #14.
