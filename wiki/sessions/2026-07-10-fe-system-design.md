---
type: session
title: "2026-07-10 — Frontend system design batch (adv-sysdesign +4)"
created: 2026-07-10
updated: 2026-07-10
tags:
  - session
  - content
  - system-design
  - frontend
status: developing
related:
  - "[[system-design-plan]]"
  - "[[target-role-profile]]"
  - "[[verify-prep-against-public-sources]]"
  - "[[2026-07-10-react-depth]]"
---

# Session: Frontend system design batch (2026-07-10)

First **P2** work after all five P1 gaps closed. Built the front-end system-design exercises from
[[system-design-plan]] (chosen first — highest signal for the FE-leaning target). `adv-sysdesign` grew
**2 → 6 lessons**. Tests **155 → 163**, build clean.

## What shipped — `adv-sysdesign` (advanced, level 6)
Kept the 4-track structure (system design stays under `advanced`). Two lessons carry a live+tested pure core;
two are concept (system design is discussion — matches the two pre-existing sysdesign lessons).

1. **`adv-sd-typeahead`** (utility/vanilla, **live + tested**) — the canonical FE prompt. Testable core:
   `createRaceGuard()` (sequence-tag each request; drop any response that isn't the latest) — the
   out-of-order-response bug most candidates miss. codeNotes: debounce + `AbortController`, LRU cache,
   accessible `combobox`/`listbox` with `aria-activedescendant`.
2. **`adv-sd-news-feed`** (utility/vanilla, **live + tested**) — infinite scroll. Testable core: `mergeFeed`
   (append + dedupe by id, immutable, order-preserving) and `nextCursor`. codeNotes: cursor vs offset,
   `IntersectionObserver` sentinel, virtualization, optimistic likes.
3. **`adv-sd-component-api`** (concept) — designing a `<Modal>`/`<Select>` API: props vs composition,
   compound components, controlled/uncontrolled (mirrors native inputs), a11y as a contract, ref+rest
   escape hatches. Maps onto SOLID.
4. **`adv-sd-chat`** (concept) — real-time UI: WebSocket vs SSE/polling, optimistic send + client-id dedupe,
   ordering by server sequence, reconnect with exponential backoff + jitter + gap-fill, batching/virtualization.

## Cross-module ties (curriculum reads as one system)
Debounce (fe-js-core) · list virtualization (fe-performance) · immutability + SOLID (fe-paradigms) ·
controlled/uncontrolled forms + keys/dedupe (fe-react-depth). Every exercise pulls a thread from earlier.

## Verification (standing rule — [[verify-prep-against-public-sources]])
Cited to MDN (AbortController, IntersectionObserver, WebSocket API, Server-sent events, ARIA combobox role)
and react.dev (Updating Arrays in State, Passing Props, Sharing State). Both live cores are unit-tested
(`createRaceGuard`, `mergeFeed`/`nextCursor`). `node --check` on both edited files; full `npm test` (163) +
`npm run build` green. No in-browser render pass (DevTools MCP not connected).

## Process note
Pasting the two vanilla starter constants through Edit, the template-literal backticks came through **escaped**
(`\``) → immediate syntax error. `node --check` caught it before running tests; fixed the four delimiters.
Reinforces: always `node --check` an edited lesson file before trusting the paste.

## State of the roadmap
All P1 done. P2: **FE system design ✅** → **deepen MongoDB (`be-data`) next** → GraphQL → advanced FE →
Redis/caching → unit-testing lesson. The **backend** system-design building-blocks + classic exercises from
[[system-design-plan]] remain unbuilt (lower priority for this target).
