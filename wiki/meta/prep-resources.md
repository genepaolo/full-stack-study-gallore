---
type: reference
title: "Interview prep resources & repos (Snap-style full-stack)"
status: active
created: 2026-07-09
updated: 2026-07-09
tags: [reference, resources, interview, roadmap]
---

# Interview prep resources & GitHub repos

Curated (scraped 2026-07-09) for the [[target-role-profile]] (front-end-leaning full-stack).
🎯 = named in the target JD · ⭐ = start here. **Next step:** go through the repos and mark what's
important *for this role and the candidate's experience* — most learning modules stay **general**;
only behavioral prep is personalized (kept privately, out of this repo).

## Coding / DSA (finish the patterns → [[algo-source-neetcode]])
- ⭐ trekhleb/javascript-algorithms — DS&A in JS, 100% test-covered (fits our JS + test model).
- seanprashad/leetcode-patterns — pattern-based + "when to use" cheatsheet.
- armankhondker/best-leetcode-resources — aggregator.
- NeetCode (neetcode.io/practice) — video walkthroughs; the taxonomy our doc follows.

## Front-end / JS-TS fundamentals + UI
- ⭐ yangshun/front-end-interview-handbook — the canonical FE handbook ([[content-sources]] source of truth).
- greatfrontend/top-javascript-interview-questions — updated 2026.
- lydiahallie/javascript-questions · leonardomso/33-js-concepts — canonical JS depth.

## 🎯 Front-end performance & browser rendering
- ⭐ web.dev — Learn Core Web Vitals + "Top CWV techniques" (LCP/INP/CLS, layout thrashing, forced reflow).
- MDN — Critical Rendering Path (reflow vs repaint).
- thedaviddias/Front-End-Performance-Checklist.

## 🎯 TypeScript — VERIFIED sources (built into `fe-typescript`)
Content cross-checked against the **official TypeScript Handbook** on 2026-07-09 (no-hallucination rule):
- ⭐ **Official TS Handbook** — [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  (interface vs type: a `type` can't be re-opened, an `interface` is always extendable; `any` disables all
  checking; unions with `|`; prefer inference) · [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
  (typeof/truthiness/equality/`in`/`instanceof` guards; discriminated unions; `never` for exhaustiveness —
  "no type is assignable to `never`") · [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  (Partial/Required/Readonly/Pick/Omit/Record/ReturnType).
- ⭐ type-challenges/type-challenges — learn the type system by solving (highly starred).
- basarat's *TypeScript Deep Dive* (free) · dzharii/awesome-typescript — aggregator.

## Front-end system design
- ⭐ greatfrontend/awesome-front-end-system-design — RADIO framework.
- Hello Interview (hellointerview.com) — worked designs: news feed, typeahead (Snap: feed/stories).
- GreatFrontEnd FE System Design Playbook.

## Backend / distributed system design
- ⭐ donnemartin/system-design-primer — canonical (already in [[system-design-plan]]).
- ByteByteGo (Alex Xu) — news feed / chat designs.

## Behavioral
- ⭐ yangshun/tech-interview-handbook — behavioral + STAR.
- ashishps1/awesome-behavioral-interviews — STAR sample answers.
- Snap values to prep stories against: *move fast with precision · privacy at the forefront · default together*.

## 🎯 AI-assisted engineering + auditing output — VERIFIED sources (built into `adv-ai`)
All figures below were fetched from primary sources on 2026-07-09 (per owner's "no hallucination —
verify against solid/highly-starred sources" rule). Used in `adv-ai-auditing/-security/-audit-drill`.
- ⭐ **OWASP Top 10 for LLM Applications 2025** — https://genai.owasp.org/llm-top-10/ — LLM01 Prompt
  Injection · LLM02 Sensitive Info Disclosure · LLM03 Supply Chain · LLM04 Data/Model Poisoning ·
  LLM05 Improper Output Handling · LLM06 Excessive Agency · LLM07 System Prompt Leakage · LLM08 Vector/
  Embedding · LLM09 Misinformation · LLM10 Unbounded Consumption. (Consumer-of-AI-code angle: LLM02/03/05.)
- **Package-hallucination study** ("We Have a Package for You!", arXiv 2406.10279, USENIX Security '25) —
  576k samples / 16 models → **205,474 unique hallucinated package names**; non-existent imports in
  **5.2%** of commercial-model vs **21.7%** of open-source-model outputs. Basis of **slopsquatting**.
- **Veracode 2025 GenAI Code Security Report** (100+ models) — https://www.veracode.com/blog/genai-code-security-report/
  — **45%** of AI-generated code introduced an OWASP Top 10 vuln; unsafe XSS **86%**, log-injection **88%**;
  models improved at functional but NOT secure code.
- **GitHub Docs — Review AI-generated code** — https://docs.github.com/en/copilot/tutorials/review-ai-generated-code
  — "assume confidently incomplete"; run tests + static analysis (CodeQL, Dependabot) before human review.
- Tools to name: Semgrep / Snyk / CodeQL / Dependabot · OpenSSF Security-Focused Guide for AI Code Assistants.

## 🎯 Web security — VERIFIED sources (built into `fs-security`)
All facts fetched from primary sources on 2026-07-10 (no-hallucination rule). Used in
`fs-sec-sop/-xss/-csrf/-injection/-headers/-owasp`.
- ⭐ **OWASP Top 10:2025** — https://owasp.org/Top10/ — A01 Broken Access Control · A02 Security
  Misconfiguration · A03 **Software Supply Chain Failures** (new, ↑#3) · A04 Cryptographic Failures ·
  A05 Injection · A06 Insecure Design · A07 Authentication Failures · A08 Software or Data Integrity
  Failures · A09 Security Logging & Alerting Failures · A10 **Mishandling of Exceptional Conditions** (new).
- ⭐ **OWASP Cheat Sheet Series** — https://github.com/OWASP/CheatSheetSeries — authoritative "how to defend X".
- **OWASP** attacks: [XSS](https://owasp.org/www-community/attacks/xss/) (reflected/stored/DOM; steals
  cookies/session, rewrites page; defend: output-encode + validate + CSP) · [CSRF](https://owasp.org/www-community/attacks/csrf)
  (forces authed state-change via ambient cookies; defend: SameSite + synchronizer token + Origin check;
  "HTTPS is a prerequisite") · [SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
  (parameterized queries = #1 defense; allowlist; least privilege).
- **MDN** — [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
  (origin = scheme/host/port; blocks cross-origin DOM/storage/response reads; allows embedding+writes → CSRF)
  · [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) (server opts callers in; browser-enforced;
  not authz) · [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) (`script-src 'self'`, nonces/
  hashes, avoid `'unsafe-inline'`, `frame-ancestors` = anti-clickjacking).
- **web.dev** — [SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained) (Strict/Lax/
  None; default Lax when unset; None requires Secure) + `HttpOnly`/`Secure` flags.
- Interview-framed repos: ⭐ yangshun/front-end-interview-handbook (44k★) & tech-interview-handbook (138k★) ·
  vasanthk/how-web-works (request lifecycle, SOP/CORS) · ntthanh2603/fullstack-interviews (security Q set).

## Snap-flavored preferred quals
- **GraphQL** (built into `be-graphql`, high-level; verified 2026-07-10): [graphql.org](https://graphql.org/) +
  [How to GraphQL](https://www.howtographql.com/basics/0-introduction/) (query language, single endpoint,
  over/under-fetching) · [Apollo docs](https://www.apollographql.com/docs/apollo-server/data/fetching-data/)
  (resolvers, N+1, DataLoader = batching + per-request cache). Real-time: MDN WebSockets, Hasura Learn.
- Canvas / WebGL / WASM / Service Workers: webglfundamentals.org (gfxfundamentals/webgl-fundamentals),
  MDN Canvas/WebGL/Service Worker/WebAssembly.
