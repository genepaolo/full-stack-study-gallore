---
type: reference
title: "Target role profile (Snap-style Full Stack Engineer)"
status: active
created: 2026-07-09
updated: 2026-07-09
tags: [reference, content, roadmap, planning, target-role]
---

# Target role profile — front-end-leaning Full Stack Engineer

The curriculum is curated toward a concrete target: a **mid-level, front-end-leaning Full Stack
Engineer** role. Exemplar JD: **Snap Inc.** (Full Stack Engineer, ~$157–235k, 2+ yrs, "default
together" LA/SF). Use this page to decide what to build next and how to frame it.

## What this employer actually weights
From the JD, in rough priority for *our* content:
1. **JS/TS + HTML + CSS**, highly proficient. (JD: "JavaScript and/or TypeScript".)
2. **A JS UI framework** — React/Angular/Vue. We teach **React**.
3. **Node.js** on the backend (also Java/Go/Python — out of scope; Node is our stack).
4. **Optimizing JavaScript performance and browser layout rendering.** Named explicitly → high signal.
5. **AI tools + the critical judgement to audit generated output** for architectural integrity,
   performance bottlenecks, and security risks. Named explicitly *and* an owner interest.
6. **OOP + functional programming principles**; **unit testing**; UI component code.
7. Coding rounds → **algorithms & data structures** (JS-centric, DOM-as-a-tree).
8. Preferred: **Canvas / WebGL / WebAssembly / Service Workers**, **GraphQL**, large-scale
   **microservices / distributed systems**, **NoSQL / Redis / K8s / cloud**, scalability.

## JD → curriculum coverage

| JD requirement | Status | Where |
|---|---|---|
| JS/HTML/CSS proficiency | ✅ covered | [[curriculum]] frontend track |
| **TypeScript** | ✅ **covered (new)** | `fe-typescript` — types/inference/erasure, interfaces vs type + unions, narrowing/discriminated unions, generics, utility types (verified vs official TS Handbook) |
| React (a UI framework) | ✅ covered | fe-react, fe-ui, **fe-react-depth** (reconciliation/keys, memo/useMemo/useCallback, custom hooks, controlled forms) |
| Node/Express, REST, Mongo, auth | ✅ covered | backend track; **MongoDB deepened** — `be-data` now 6 lessons (CRUD/operators, embed-vs-reference modeling, indexes+ESR, aggregation pipeline live+tested) |
| Algorithms & DS (coding round) | ✅ **covered** | `adv-algorithms` — 16 lessons, full NeetCode taxonomy (patterns + cheat sheet) |
| **JS performance + browser rendering** | ✅ **covered (new)** | `fe-performance` — pixel pipeline, reflow/thrashing, virtualization, code-splitting, Core Web Vitals |
| **AI-assisted dev + auditing output** | ✅ **covered (new)** | `adv-ai` — workflow, prompting, + auditing / security (OWASP LLM Top 10, slopsquatting) / hands-on audit drill |
| OOP + functional programming | ✅ **covered (new)** | `fe-paradigms` — multi-paradigm intro, pure functions + immutability, HOF + composition, classes/encapsulation/prototypes, SOLID (verified vs MDN + React docs) |
| Unit testing | ⚠️ partial | app has a Vitest suite ([[testing]]); no lesson |
| UI components | ✅ covered | fe-ui (8 components) |
| Canvas/WebGL/WASM/Service Workers | ⚠️ partial | Snake uses Canvas; rest missing |
| GraphQL | ✅ **covered (high-level)** | `be-graphql` — what it is vs REST, schema/queries/mutations, trade-offs + N+1/DataLoader (light tour by request) |
| Microservices / distributed / scale | ⚠️ partial | `adv-sysdesign` (backend scaling); **FE system design ✅ new** — typeahead, news feed, component-API, chat; deeper plan in [[system-design-plan]] |
| NoSQL/Redis/K8s/cloud | ⚠️ partial | Mongo covered; Redis/caching missing |

## Re-prioritized roadmap for this target
Supersedes the generic P1 order in [[expansion-roadmap]] when optimizing for *this* role.

- **P1 (build next, highest JD signal):**
  1. ✅ **DONE — Front-end performance & browser rendering** (`fe-performance`, 5 lessons): pixel pipeline,
     reflow/repaint + layout thrashing, list virtualization (testable windowing math), code-splitting,
     Core Web Vitals (LCP/CLS/INP). *(JD names it.)*
  2. ✅ **DONE — AI-assisted engineering + auditing generated code** (`adv-ai`, +3 lessons): 5-pass audit
     checklist, security risks (OWASP LLM Top 10 2025, slopsquatting/package hallucination, Veracode stats),
     and a hands-on audit drill (spot the hidden O(n²) + correctness bug). All figures primary-source
     verified → [[prep-resources]]. *(JD names it; owner interest.)*
  3. ✅ **DONE — TypeScript Essentials** (`fe-typescript`, 5 lessons): types/inference/erasure, interfaces
     vs type + unions, narrowing & discriminated unions (exhaustiveness via `never`), generics (`keyof`
     constraints), utility types. Two lessons are live + taught-logic-tested; verified vs the official Handbook.
  4. ✅ **DONE — OOP & functional programming** (`fe-paradigms`, 5 lessons): multi-paradigm intro, pure
     functions + immutability (live+tested), HOF + pipe/compose (live+tested), classes/`#private`
     encapsulation/prototypes (composition over inheritance), SOLID as front-end instincts. Verified vs
     MDN + React docs.
  5. ✅ **DONE — React depth** (`fe-react-depth`, 5 lessons): reconciliation & keys (index-key bug), the
     equality checks behind memo/deps (`shallowEqual`/`depsChanged`, live+tested), memo/useMemo/useCallback
     in action (live), custom hooks (live), controlled vs uncontrolled forms (live). Verified vs react.dev.
- **P2:**
  1. ✅ **DONE — FE system design** (`adv-sysdesign` +4): Autocomplete/Typeahead (race guard live+tested),
     News Feed/Infinite Scroll (cursor merge/dedupe live+tested), reusable component API, real-time chat UI.
     Verified vs MDN (AbortController, IntersectionObserver, WebSocket, ARIA combobox) + react.dev.
  2. ✅ **DONE — Deepen MongoDB** (`be-data` 2 → 6): CRUD & query operators, embed-vs-reference modeling,
     indexes & the ESR rule, aggregation pipeline (live+tested pure-JS stages). Verified vs the MongoDB Manual.
  3. ✅ **DONE — Web Security** (new `fs-security`, 6 lessons): same-origin policy/CORS/sandboxing, XSS
     (live+tested `escapeHtml`), CSRF & SameSite, injection (SQL/NoSQL), CSP & security headers, and the
     OWASP Top 10 (2025) checklist. All facts verified vs MDN/OWASP/web.dev; repos in [[prep-resources]].
  4. ✅ **DONE — GraphQL (high-level)** (`be-graphql`, 3 concept lessons, light by request): what it is vs
     REST (over/under-fetching, single endpoint), schema/queries/mutations/resolvers, trade-offs (harder
     caching, N+1 + DataLoader, query-abuse). Verified vs graphql.org / howtographql / Apollo docs.
  5. **NEXT (open):** advanced front-end (Canvas/WebGL/Service Workers/WASM) · Redis/caching · unit-testing
     lesson · DDD · backend system-design building-blocks ([[system-design-plan]]) · **README refresh** (stale).
- **Behavioral** stays valuable (a real round) but is secondary to the technical gaps above.

## Framing guidance (apply to every new lesson)
Thread these so the content reads as *aimed* at the role, not generic:
- **Performance angle** — connect to the 16ms frame budget, browser rendering, and Big-O in hot paths.
- **AI-audit angle** — "here's what to check if AI generated this" (hidden O(n²), security, correctness).
- **DOM-as-a-tree** — reuse the tree/traversal framing for React reconciliation, event bubbling, Canvas.
- **Functional + OOP** — call out pure functions / immutability and encapsulation where they appear.

## Note
"Snap" is the *exemplar*, not a hard constraint — the profile generalizes to any front-end-leaning
full-stack role (Meta/Stripe/Vercel/etc.). Swap the exemplar; the weighting holds.
