---
type: session
title: "2026-07-10 — Web Security module (fs-security) + SECURITY.md accuracy fix"
created: 2026-07-10
updated: 2026-07-10
tags:
  - session
  - content
  - security
  - fullstack
status: developing
related:
  - "[[target-role-profile]]"
  - "[[prep-resources]]"
  - "[[verify-prep-against-public-sources]]"
  - "[[2026-07-10-mongodb-and-run-skill]]"
---

# Session: Web Security module + SECURITY.md fix (2026-07-10)

Sparked by a user question on the box-model lesson page: *"how can I test for malicious inputs directly in
the live editor?"* That led to (1) an **empirical probe** of the Sandpack sandbox, (2) an accuracy fix to
`SECURITY.md`, and (3) a new **`fs-security`** module. Tests **167 → 171**, build clean, browser-verified.

## 1. Empirical sandbox probe → SECURITY.md fix
Drove the running app with Playwright and inspected the live editor's iframe:
- Preview src = `https://<id>-preview.sandpack-static-server.codesandbox.io/` (cross-origin to `localhost:5173`).
- `sandbox` attribute = `allow-scripts allow-same-origin allow-forms allow-modals …` — **includes**
  `allow-same-origin`. Host↔iframe reads blocked both directions.
- **Conclusion:** isolation from host data is the **different host origin** (same-origin policy), NOT an
  opaque-origin sandbox. If the preview were ever served same-origin, editor code could read `localStorage`.
- Rewrote `SECURITY.md` point 1 + the "malicious code" threat-table row to state this precisely, and added a
  **supply-chain caveat** (CodeSandbox builds/hosts the preview; a compromised bundler could run code inside
  the origin-isolated preview, e.g. capture editor keystrokes).

## 2. `fs-security` module (fullstack track, level 5) — 6 lessons
Interview-tight (owner: "don't spiral; enough to answer interviewer concerns"). One live+tested.
1. **`fs-sec-sop`** (concept) — origin = scheme/host/port; SOP blocks cross-origin DOM/storage/response
   reads, ALLOWS embedding+writes (→ CSRF); CORS relaxes & is browser-enforced (not authz); postMessage;
   iframe sandbox. Folds in the **sandbox-probe tool tips** from the discussion.
2. **`fs-sec-xss`** (utility/vanilla, **live+tested**) — `escapeHtml` (5 chars, & first); reflected/stored/
   DOM; dangerous sinks (`innerHTML`/`dangerouslySetInnerHTML`); defense-in-depth (encode + validate + CSP).
3. **`fs-sec-csrf`** (concept) — ambient-cookie attack; SameSite Lax-default/Strict/None+Secure; synchronizer
   token; HttpOnly/Secure; XSS>CSRF; token-auth in headers is largely CSRF-immune.
4. **`fs-sec-injection`** (concept) — SQL injection + NoSQL/operator injection (ties to Mongo module);
   parameterized queries (#1), allowlist, least privilege; ORM/ODM caveat.
5. **`fs-sec-headers`** (concept) — CSP (script-src/nonces/hashes, avoid unsafe-inline, frame-ancestors),
   clickjacking, HSTS, nosniff, cookie flags; helmet for Express.
6. **`fs-sec-owasp`** (concept) — the **OWASP Top 10 2025** list, each mapped to "what a full-stack dev does"
   + a pre-ship self-audit + vetted repos. The "these security types should be noted" capstone.

## 3. Verification (no-hallucination rule)
Every claim fetched from a primary source, not recalled: MDN (Same-origin policy, CORS, CSP), OWASP (XSS,
CSRF, SQL Injection, **Top 10:2025** — got the current list: A03 Software Supply Chain Failures, A10
Mishandling of Exceptional Conditions are new), web.dev (SameSite). Reputable repos vetted and filed to
[[prep-resources]]: OWASP CheatSheetSeries, yangshun/front-end-interview-handbook (44k★) &
tech-interview-handbook (138k★), vasanthk/how-web-works. Browser-verified all lessons via the run-skill;
the XSS editor executes and turns the `onerror` payload into inert escaped text.

## Process notes
- Bug: inside a single-quoted `def:` string a literal apostrophe must be `\'`, not `\\'` (which closes the
  string). Hit it 13× (CSP/SQL examples); `node --check` caught it. Fixed with a scoped replace.
- README now clearly stale (says "Four categories"; no security/TS/perf/MongoDB depth) — strong next-refresh.

## Roadmap
All P1 done. P2: FE system design ✅ · MongoDB ✅ · **Web Security ✅** → **GraphQL next** → advanced FE →
Redis/caching → unit-testing lesson → backend sysdesign building-blocks.
