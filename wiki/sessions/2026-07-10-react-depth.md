---
type: session
title: "2026-07-10 — React Depth & Performance module (fe-react-depth)"
created: 2026-07-10
updated: 2026-07-10
tags:
  - session
  - content
  - react
  - performance
  - hooks
status: developing
related:
  - "[[target-role-profile]]"
  - "[[verify-prep-against-public-sources]]"
  - "[[2026-07-10-oop-fp]]"
  - "[[curriculum]]"
---

# Session: React Depth & Performance (2026-07-10)

Closed **P1 #5 — the last P1** on [[target-role-profile]]. New `fe-react-depth` module, 5 lessons. Committed
`fe-paradigms` first (`621df0f`), then built this. Tests **148 → 155**, build clean, `node --check` clean.

## What shipped — `fe-react-depth` (frontend, level 4, next to `fe-performance`)
`fe-react` had only useState + useEffect; the depth topics were uncovered, so a dedicated module (not bloat
"Essentials"). React `component` lessons run live in Sandpack but are NOT unit-testable (the `taught-logic`
harness only evals `vanilla` `/index.js`), so the module is live-heavy with ONE tested vanilla core.

1. **`fe-react-render`** (concept) — render vs commit phases; reconciliation diffs the tree position-by-
   position; keys = stable identity; the **index-as-key** bug (state attaches to the wrong row on reorder);
   changing a key to intentionally reset a subtree. Reuses DOM-as-a-tree framing.
2. **`fe-react-equality`** (utility/vanilla, **live + tested**) — the two comparisons React runs constantly:
   `shallowEqual` (React.memo's default prop check) and `depsChanged` (hook deps, `Object.is` per element).
   Makes concrete why an inline `{}` / `() => {}` prop defeats memo. 3 test cases (12 assertions).
3. **`fe-react-memo`** (component/react, live) — memo + useMemo + useCallback together; per-row render
   counter; typing in an unrelated box doesn't re-render the memoized rows; "remove useCallback" experiment
   in a trailing comment shows the break. Includes the don't-over-memoize nuance.
4. **`fe-react-custom-hooks`** (component/react, live) — `useToggle` + `useDebouncedValue`; Rules of Hooks
   (top level only, from React fns only); the key point: custom hooks reuse LOGIC, not state.
5. **`fe-react-forms`** (component/react, live) — controlled (one `onChange` for many fields via `name` +
   immutable computed-key update) vs uncontrolled (file input via ref); when to pick each.

## Role framing applied
- **Performance** — reconciliation + memoization keep list updates inside the 16ms frame budget.
- **AI-audit** — over-memoization is a smell not a win; half-controlled input (`value` without `onChange`)
  is a common generated-code bug; needless re-renders from unstable props.
- **Continuity** — ties to [[2026-07-10-oop-fp]] (immutability, single-responsibility) and fe-js-core debounce.

## Verification (standing rule — [[verify-prep-against-public-sources]])
Cited to react.dev: Render and Commit, Rendering Lists, Preserving and Resetting State, memo, useMemo,
useCallback, Reusing Logic with Custom Hooks, Rules of Hooks, Reacting to Input with State. `shallowEqual`/
`depsChanged` mirror React's real `Object.is`-based comparisons and are unit-tested. `node --check` on both
edited files; full `npm test` (155) + `npm run build` green. No in-browser render pass (DevTools MCP still
not connected) — React demos verified by esbuild compile + production build only.

## State of the roadmap
**All five P1 gaps are closed** (FE perf, AI-audit, TypeScript, OOP/FP, React depth). Next is **P2**:
recommended FE system design → deepen MongoDB (`be-data`) → GraphQL. Behavioral prep stays secondary
(gitignored in `wiki/private/`).
