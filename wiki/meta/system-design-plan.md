---
type: reference
title: "System design study plan (primer + GreatFrontend)"
status: planned
created: 2026-07-07
updated: 2026-07-07
tags: [reference, system-design, roadmap, planning]
---

# System design study plan

Sources: [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
(backend/distributed) + GreatFrontend playbook (frontend). Goal: plan lessons under
`adv-sysdesign` (keep 4-track structure). We already have `adv-sysdesign-frontend` +
`adv-sysdesign-scale`; this expands both into a real sub-curriculum.

## A. Backend / distributed systems (system-design-primer)

**Building blocks (concept lessons):**
1. **Scalability basics** — performance vs scalability, latency vs throughput, vertical vs horizontal.
2. **Load balancing & reverse proxy** — L4 vs L7, health checks, sticky sessions, zero-downtime.
3. **Caching** — cache-aside / write-through / write-behind, eviction (LRU), CDN (push vs pull), Redis.
4. **Databases** — SQL vs NoSQL (key-value/document/wide-column/graph), replication, sharding,
   denormalization, indexing, federation.
5. **CAP theorem & consistency** — consistency (weak/eventual/strong), availability, partition tolerance.
6. **Async & messaging** — message queues, workers, back-pressure, idempotency.
7. **Communication** — DNS, HTTP/TCP/UDP, REST vs RPC, rate limiting.

**Classic exercises (project/concept walk-throughs):**
- Design **Bit.ly / Pastebin** (URL shortener) — hashing, KV store, read-heavy caching.
- Design **Twitter timeline + search** — fan-out on write vs read, feeds at scale.
- Design a **web crawler** — queues, dedupe, politeness.
- Design a **key-value cache** / **LRU cache** (also an OOD exercise).
- Design a **rate limiter**, a **chat server**.

## B. Frontend system design (GreatFrontend)

**Framework (RADIO):** Requirements → Architecture (component tree + data flow) → Data model →
Interface/API → Optimizations & edge cases. (Have this in `adv-sysdesign-frontend`.)

**Exercises to add:**
- **Autocomplete / Typeahead** — debounced input, caching, keyboard a11y, race conditions.
- **News feed / infinite scroll** — cursor pagination, list virtualization, optimistic likes.
- **Image carousel / lightbox** — preloading, lazy images, focus management.
- **Design a component API** (e.g. Modal/Tabs) — props vs composition, controlled/uncontrolled.
- **Chat UI** — websockets, message ordering, optimistic send, reconnection.

## Proposed lesson set (under adv-sysdesign)
Backend: scalability-basics · load-balancing · caching · databases-at-scale · cap-consistency ·
messaging · url-shortener (exercise) · news-feed-backend (exercise).
Frontend: (have framework) + typeahead · news-feed · component-api-design.
OOD bonus: LRU cache (ties to caching + could be an algorithms/DS lesson).

## Sequencing
After the chosen P0 (UI components + JS utilities). System design is **P2** in
[[expansion-roadmap]] — plan captured here; build after P0/P1.
