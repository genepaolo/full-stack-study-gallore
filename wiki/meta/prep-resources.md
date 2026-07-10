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

## 🎯 TypeScript
- ⭐ type-challenges/type-challenges — learn the type system by solving.
- Official TS Handbook · basarat's *TypeScript Deep Dive* (free).
- dzharii/awesome-typescript — aggregator.

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

## Snap-flavored preferred quals
- Real-time / WebSockets + GraphQL: howtographql.com (subscriptions), MDN WebSockets, Hasura Learn.
- Canvas / WebGL / WASM / Service Workers: webglfundamentals.org (gfxfundamentals/webgl-fundamentals),
  MDN Canvas/WebGL/Service Worker/WebAssembly.
