---
type: reference
title: "Algo/DS source map — NeetCode 150 / Blind 75 notes"
status: active
created: 2026-07-09
updated: 2026-07-09
tags: [reference, content, algorithms, roadmap, source]
---

# Algo/DS source map — personal NeetCode notes → lessons

Source: **`Paolo 114.docx`** (owner's personal coding-interview notes — Google prep tips + NeetCode 150 /
Blind 75 walkthroughs, ~12.5k words, organized by pattern with I/O examples, LeetCode links,
multiple methods + complexity, and Java/JS snippets). The file lives in `dropoff/` (gitignored — analyzed,
never committed). This page maps that taxonomy onto app lessons in [[curriculum]] (`adv-algorithms`).

**Approach — focus of learning (depth-first, chosen 2026-07-09):** teach the **pattern** via one
canonical, editable, test-enforced problem per lesson, showing the **brute-force → optimized journey**
(both implementations in the live editor, a test asserts they agree); and each lesson lists **every** one
of its category's questions from the doc, so all ~114 are *captured as a map* even though ~16 are worked.
Not a 114-problem dump.

**Verify, don't trust:** the doc is a strong *draft*, not ground truth. Every solution/complexity claim
is cross-checked against public LeetCode/canonical sources before it becomes a lesson, and explanations
are kept **simple** (lead with the core idea, plain language). The 2026-07-09 batch was web-verified:
LC 3 O(n)/O(min(charset,n)), LC 20 O(n)/O(n), binary search O(log n)/O(1), LC 206 O(n)/O(1) — all confirmed.

## Pattern taxonomy in the doc (16 categories)
Arrays & Hashing (16) · Two Pointers (8) · Sliding Windows (6) · Stack (12) · Binary Search (4) ·
Linked List (8) · Trees (20) · Tries (3) · Heap/Priority Queue (2) · Backtracking (4) · Graphs (7) ·
Advanced Graphs (1) · Greedy (5) · Intervals (5) · Math & Geo (3) · Bit Manipulation (5).

## Coverage: pattern → lesson

| Pattern | Lesson | Canonical problem | Status |
|---|---|---|---|
| Big-O foundation | `adv-big-o` | (complexity of JS built-ins) | ✅ |
| Arrays & Hashing | `adv-hashmaps` | Two Sum / frequency | ✅ |
| Two Pointers | `adv-two-pointers` | twoSumSorted / isPalindrome | ✅ |
| Recursion & Backtracking | `adv-recursion` | permutations | ✅ |
| Trees + Graph traversal | `adv-trees-dom` | DFS/BFS over a tree | ✅ |
| **Sliding Window** | `adv-sliding-window` | Longest substring no-repeat (LC 3) | ✅ **new** |
| **Stack** | `adv-stack` | Valid parentheses (LC 20) | ✅ **new** |
| **Binary Search** | `adv-binary-search` | classic binary search | ✅ **new** |
| **Linked List** | `adv-linked-list` | Reverse list (LC 206) | ✅ **new** |
| **Heap / Priority Queue** | `adv-heap` | Kth largest (min-heap, no built-in) | ✅ **new** |
| **Intervals** | `adv-intervals` | Merge intervals (sort + sweep) | ✅ |
| **Greedy** | `adv-greedy` | Max subarray / Kadane | ✅ |
| **Graphs (grid/adjacency)** | `adv-graphs` | Number of islands (DFS + BFS flood fill) | ✅ **new** |
| **Tries** | `adv-tries` | Implement trie (insert/search/startsWith) | ✅ **new** |
| **Bit Manipulation** | `adv-bit-manipulation` | Single number (XOR) + counting bits | ✅ **new** |
| Trees (depth) | (in `adv-trees-dom`) | invert / max depth / LCA — could deepen | ⏳ optional |
| Advanced Graphs / Math & Geo | — | Dijkstra / geometry — thin in the doc | ⏳ optional |
| — cheat sheet — | `adv-cheatsheet` | pattern table + JS idioms + TS seed | ✅ |

**Result: the core NeetCode taxonomy is covered.** `adv-algorithms` is **16 lessons** (15 patterns +
cheat sheet), 14 taught-logic-tested. Every pattern lesson shows the brute→optimized journey, lists its
full category question set, and carries a **`codeNotes`** ("Code to reach for") panel of the concrete JS
idioms it uses. Only optional/thin categories remain (deepen trees, Advanced Graphs, Math & Geo).

## Done — remaining is optional
The 13 substantive NeetCode pattern categories are all represented. Optional future depth:
- Deepen `adv-trees-dom` with invert / max-depth / LCA / serialize as their own worked problems.
- **Advanced Graphs** (Dijkstra, union-find) and **Math & Geo** — thin in the doc, low interview weight.
- Optionally split `adv-algorithms` into sub-modules now that it is 16 lessons (Track→Module→Lesson
  supports adding modules under Advanced — see [[expansion-roadmap]]).

**Pivot:** with DSA complete, the next priority is the **Front-End Performance** module (the top
target-weighted P1 gap in [[target-role-profile]]).

## Notes
- **Language focus: TypeScript / JavaScript only — not Java.** The doc includes Java snippets; we drop
  them and teach every solution in JS (with TS as the near-term priority per [[target-role-profile]]).
- Each new lesson pulls its explanation from the owner's own method notes (e.g. sliding-window shrink
  logic, monotonic stack, deque for window-max) so the app reflects *their* understanding.
- Doc also contains non-lesson value: Google prep tips, interview-communication advice, sorting notes —
  candidates for a future **Behavioral / interview-technique** module, not algo lessons.
