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
| **TypeScript** | ❌ gap | none — JD says "and/or TS"; table stakes |
| React (a UI framework) | ✅ covered | fe-react, fe-ui |
| Node/Express, REST, Mongo, auth | ✅ covered | backend track |
| Algorithms & DS (coding round) | ✅ **covered** | `adv-algorithms` — 16 lessons, full NeetCode taxonomy (patterns + cheat sheet) |
| **JS performance + browser rendering** | ✅ **covered (new)** | `fe-performance` — pixel pipeline, reflow/thrashing, virtualization, code-splitting, Core Web Vitals |
| **AI-assisted dev + auditing output** | ⚠️ partial | `adv-ai` (workflow, prompting); missing the *audit* lens |
| OOP + functional programming | ⚠️ partial | scattered; no dedicated lessons |
| Unit testing | ⚠️ partial | app has a Vitest suite ([[testing]]); no lesson |
| UI components | ✅ covered | fe-ui (8 components) |
| Canvas/WebGL/WASM/Service Workers | ⚠️ partial | Snake uses Canvas; rest missing |
| GraphQL | ❌ gap | none |
| Microservices / distributed / scale | ⚠️ partial | `adv-sysdesign`; deeper plan in [[system-design-plan]] |
| NoSQL/Redis/K8s/cloud | ⚠️ partial | Mongo covered; Redis/caching missing |

## Re-prioritized roadmap for this target
Supersedes the generic P1 order in [[expansion-roadmap]] when optimizing for *this* role.

- **P1 (build next, highest JD signal):**
  1. ✅ **DONE — Front-end performance & browser rendering** (`fe-performance`, 5 lessons): pixel pipeline,
     reflow/repaint + layout thrashing, list virtualization (testable windowing math), code-splitting,
     Core Web Vitals (LCP/CLS/INP). *(JD names it.)*
  2. **AI-assisted engineering — auditing generated code** ← **NEXT** — expand `adv-ai`: review AI output for
     correctness, performance, and security. *(JD names it; owner interest.)*
  3. **OOP & functional programming principles** — pure functions, immutability, composition;
     classes, encapsulation, a light-touch SOLID.
  4. **TypeScript basics** — types, interfaces, generics, narrowing.
  5. **React depth** — `useMemo`/`useCallback`/`memo`, controlled forms, custom hooks (ties to perf).
- **P2:** GraphQL · advanced front-end (Canvas/WebGL/Service Workers/WASM) · Redis/caching ·
  distributed systems / [[system-design-plan]] · a unit-testing lesson · domain-driven design.
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
