---
type: meta
title: "Hot Cache"
status: active
created: 2026-07-07
updated: 2026-07-10T21:35:00
tags: [meta, cache]
---

# Recent Context

## Last Updated
2026-07-10. All P1 done. P2 in progress: FE system design ✅ · MongoDB ✅ · **Web Security ✅ (new
`fs-security`, 6 lessons)**. Also tightened `SECURITY.md` after empirically probing the Sandpack iframe.
Tests **171**, build clean, browser-verified. Next P2: **GraphQL**.

## Headlines
- **`fs-security` = 6 lessons** (fullstack, level 5) — the security an interviewer expects a full-stack dev
  to know: `fs-sec-sop` (same-origin policy = scheme/host/port; CORS relaxes it & is browser-enforced;
  iframe sandbox + a hands-on sandbox-isolation probe), `fs-sec-xss` (**live+tested** `escapeHtml`;
  reflected/stored/DOM; dangerous sinks incl. `dangerouslySetInnerHTML`; defense-in-depth), `fs-sec-csrf`
  (ambient-cookie attack; SameSite Lax-default/Strict/None+Secure; synchronizer token; XSS>CSRF),
  `fs-sec-injection` (SQL + NoSQL/operator injection; parameterized queries; least privilege),
  `fs-sec-headers` (CSP script-src/nonces/frame-ancestors; HSTS; helmet), `fs-sec-owasp` (the **OWASP Top
  10 2025** checklist mapped to prior lessons + self-audit + vetted repos). All verified vs MDN/OWASP/web.dev.
- **SECURITY.md fix**: empirically probed the Sandpack preview (Playwright) — it's served from
  `*.sandpack-static-server.codesandbox.io` (cross-origin to :5173) with `sandbox` INCLUDING
  `allow-same-origin`, so isolation is the **different host origin**, not an opaque-origin sandbox. Documented
  precisely + added the supply-chain caveat. (Origin isolation confirmed both directions.)
- **Content model** unchanged: append one object to `data/lessons/<track>.js`; tests enforce it
  (content-integrity / lesson-code esbuild-compile / taught-logic evals a `vanilla` `/index.js`). Only
  `vanilla` lessons are unit-testable; React `component` demos are Sandpack-only. **Gotcha**: inside a
  single-quoted def string a literal apostrophe is `\'` NOT `\\'` (the latter closes the string) — always
  `node --check` an edited lesson file.
- **Coverage** → [[target-role-profile]]: all P1 ✅. P2: FE sysdesign ✅ · MongoDB ✅ · Web Security ✅ →
  **GraphQL (next)** → advanced FE (Canvas/WebGL/SW/WASM) → Redis/caching → unit-testing lesson → backend
  sysdesign building-blocks ([[system-design-plan]]).
- **Verified security sources** now in [[prep-resources]] (OWASP Top10:2025 + CheatSheetSeries, MDN SOP/CORS/
  CSP, web.dev SameSite, yangshun handbooks 44k/138k★, vasanthk/how-web-works).

## Active Threads
- **NEXT: GraphQL** — schema/types/resolvers, queries vs mutations, over/under-fetching vs REST, N+1 +
  DataLoader. Likely a new fullstack or backend module. Then advanced FE, Redis, a unit-testing lesson.
- **Verify-don't-hallucinate is a standing rule**: primary source or highly-starred repo before it ships;
  browser-verify via the run-skill; `node --check` our own lesson code. Empirical > assumed (see the iframe probe).
- **Personalized (gitignored)**: behavioral prep in `wiki/private/` — 70/30 FE/BE, honest on DB depth.
- **Open**: README stale ("Four categories", understates MongoDB, no security/TS/perf) — strong refresh
  candidate now. Notes UI + mobile nav backlog.
- **Owner**: `npm test` before commits; `npm run dev:client` → :5173; `npm run kill`; run-skill
  (`full-stack-gallore:run`) for the in-browser pass.
- Git identity is the noreply address — never commit the personal gmail; never stage `dropoff/` or `wiki/private/`.
- **origin/main current** through `13be6e5`; today's fs-security commit pending push. Dev server may be on :5173.
