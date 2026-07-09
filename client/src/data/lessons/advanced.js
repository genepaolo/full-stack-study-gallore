// Advanced track — a real project, system design, and AI-assisted development.

const snakeStarter = `import { useRef, useEffect, useState } from "react";

// A complete Snake game. Arrow keys / WASD to steer. Tweak SIZE, SPEED, colors — it's yours.
const CELL = 20;      // pixels per cell
const COUNT = 20;     // grid is COUNT x COUNT
const SPEED = 110;    // ms per tick (smaller = faster)

export default function Snake() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  // Mutable game state kept in refs so the loop isn't recreated every render.
  const game = useRef(null);
  if (!game.current) {
    game.current = {
      snake: [{ x: 8, y: 10 }],
      dir: { x: 1, y: 0 },
      food: { x: 14, y: 10 },
    };
  }

  useEffect(() => {
    const onKey = (e) => {
      const g = game.current;
      const k = e.key.toLowerCase();
      if ((k === "arrowup" || k === "w") && g.dir.y !== 1) g.dir = { x: 0, y: -1 };
      else if ((k === "arrowdown" || k === "s") && g.dir.y !== -1) g.dir = { x: 0, y: 1 };
      else if ((k === "arrowleft" || k === "a") && g.dir.x !== 1) g.dir = { x: -1, y: 0 };
      else if ((k === "arrowright" || k === "d") && g.dir.x !== -1) g.dir = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const randFood = () => ({ x: (Math.random() * COUNT) | 0, y: (Math.random() * COUNT) | 0 });

    const id = setInterval(() => {
      const g = game.current;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };

      // Collisions: walls or self -> game over.
      const hitWall = head.x < 0 || head.y < 0 || head.x >= COUNT || head.y >= COUNT;
      const hitSelf = g.snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) { setOver(true); clearInterval(id); return; }

      g.snake.unshift(head);                 // move: add new head
      if (head.x === g.food.x && head.y === g.food.y) {
        setScore((s) => s + 1);              // eat: grow + new food
        g.food = randFood();
      } else {
        g.snake.pop();                       // no food: drop tail
      }

      // Draw
      ctx.fillStyle = "#0f1117";
      ctx.fillRect(0, 0, COUNT * CELL, COUNT * CELL);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(g.food.x * CELL, g.food.y * CELL, CELL, CELL);
      g.snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#818cf8" : "#6366f1";
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
    }, SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: 12 }}>
      <h3>🐍 Snake — score {score}{over ? " · Game over (reload to retry)" : ""}</h3>
      <canvas ref={canvasRef} width={COUNT * CELL} height={COUNT * CELL}
        style={{ borderRadius: 8, border: "1px solid #2a2e38" }} />
      <p style={{ color: "#6b7280", fontSize: 13 }}>Click the preview, then use arrow keys or WASD.</p>
    </div>
  );
}
`

// ---- Algorithms & DS starters (adv-algorithms) ----

const twoPointersStarter = `// Two Pointers: walk from both ends of a SORTED array to hit O(n) instead of O(n^2).

// twoSumSorted: return the indices [i, j] whose values add up to target.
function twoSumSorted(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;   // sum too small -> move the low pointer up
    else hi--;                // sum too big   -> move the high pointer down
  }
  return null;                // no pair found
}

// isPalindrome: two pointers moving inward, ignoring case and punctuation.
function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++; j--;
  }
  return true;
}

console.log("twoSumSorted([1,3,4,5,7,11], 9) =", twoSumSorted([1, 3, 4, 5, 7, 11], 9)); // [2, 3]
console.log("isPalindrome('A man, a plan, a canal: Panama') =", isPalindrome("A man, a plan, a canal: Panama")); // true
console.log("isPalindrome('hello') =", isPalindrome("hello")); // false
`

const recursionStarter = `// Recursion & backtracking: choose one element, recurse on the rest, then undo the choice.

// permutations: every possible ordering of the input array.
function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];        // base case: a single ordering
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];  // everything except arr[i]
    for (const p of permutations(rest)) {
      out.push([arr[i], ...p]);                     // put arr[i] in front of each sub-ordering
    }
  }
  return out;
}

const result = permutations([1, 2, 3]);
console.log("permutations([1,2,3]) — count:", result.length); // 6
console.log(result); // [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]
`

const treesDomStarter = `// Trees & DOM traversal. The DOM is a tree — so is a Canvas/WebGL scene graph. Two ways to walk it.

// A tiny tree of { value, children }. Read value as an HTML tag name.
const tree = {
  value: "html",
  children: [
    { value: "head", children: [{ value: "title", children: [] }] },
    { value: "body", children: [
      { value: "nav", children: [] },
      { value: "main", children: [{ value: "h1", children: [] }, { value: "p", children: [] }] },
    ] },
  ],
};

// DFS (pre-order): go as deep as possible first. Recursion uses the call stack for you.
function dfs(node, out = []) {
  out.push(node.value);
  for (const child of node.children) dfs(child, out);
  return out;
}

// BFS (level order): visit every node at one depth before going deeper, using a queue.
function bfs(root) {
  const out = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();                    // dequeue the front
    out.push(node.value);
    for (const child of node.children) queue.push(child);  // enqueue its children
  }
  return out;
}

console.log("DFS  (pre-order):", dfs(tree).join(" -> "));
console.log("BFS (level order):", bfs(tree).join(" -> "));
`

const hashMapsStarter = `// Hash maps & sets: trade a little memory for O(1) lookups — the #1 way to turn O(n^2) into O(n).

// twoSum: indices of the two numbers adding to target, in a SINGLE pass (unsorted input).
function twoSum(nums, target) {
  const seen = new Map();                 // value -> index we saw it at
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

// frequency: count occurrences — the core of "log and analyze engagement metrics".
function frequency(items) {
  const counts = new Map();
  for (const it of items) counts.set(it, (counts.get(it) || 0) + 1);
  return counts;
}

console.log("twoSum([2,7,11,15], 9) =", twoSum([2, 7, 11, 15], 9));               // [0, 1]
console.log("frequency(['tap','swipe','tap']) =", [...frequency(["tap", "swipe", "tap"])]); // [['tap',2],['swipe',1]]
`

const slidingWindowStarter = `// Longest substring without repeating characters (LeetCode 3).
// Watch the SAME problem go from O(n^2) to O(n) by reusing work instead of restarting.

// ---- Brute force: try every start, extend until a repeat. O(n^2) time, O(n) space. ----
function lengthOfLongestSubstringBrute(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;        // repeat -> this start is finished
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;                          // re-scans the same chars from every start = wasteful
}

// ---- Optimized: one sliding window. O(n) time. ----
// Insight: when we hit a repeat we DON'T restart — we just move 'left' past the earlier copy.
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();           // char -> most recent index
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (lastSeen.has(c) && lastSeen.get(c) >= left) {
      left = lastSeen.get(c) + 1;       // jump left past the previous copy (no restart)
    }
    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// Same answers, less work:
for (const s of ["abcabcbb", "bbbbb", "pwwkew"]) {
  console.log(s, "-> brute:", lengthOfLongestSubstringBrute(s), " window:", lengthOfLongestSubstring(s));
}
`

const stackStarter = `// Valid parentheses (LeetCode 20). Same problem, two ways — see why the stack is the point.

// ---- Brute force: repeatedly strip matched pairs until nothing changes. O(n^2). ----
function isValidNaive(s) {
  let prev;
  do {
    prev = s;
    s = s.split("()").join("").split("[]").join("").split("{}").join("");
  } while (s !== prev);                 // each pass re-scans the whole string
  return s.length === 0;
}

// ---- Optimized: one pass with a stack. O(n) time, O(n) space. ----
// A stack captures ORDER: "([)]" has balanced counts but the wrong nesting — counting can't catch that.
function isValid(s) {
  const stack = [];
  const pairFor = { ")": "(", "]": "[", "}": "{" };   // closer -> its opener
  for (const ch of s) {
    if (ch in pairFor) {
      if (stack.pop() !== pairFor[ch]) return false;  // closer must match the most-recent opener
    } else {
      stack.push(ch);                                 // an opener — remember it
    }
  }
  return stack.length === 0;                          // nothing left unclosed
}

for (const s of ["()[]{}", "([])", "[(])"]) {
  console.log(JSON.stringify(s), "-> naive:", isValidNaive(s), " stack:", isValid(s));
}
`

const binarySearchStarter = `// Search a SORTED array. The sorted-ness is the whole trick — use it or waste it.

// ---- Brute force: linear scan, ignores that the array is sorted. O(n). ----
function linearSearch(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}

// ---- Optimized: binary search — halve the range each step. O(log n), O(1) space. ----
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {                       // range still non-empty
    const mid = (lo + hi) >> 1;            // floor of the midpoint
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;  // answer must be in the right half
    else hi = mid - 1;                     // answer must be in the left half  (±1 or you loop forever)
  }
  return -1;
}

const arr = [-5, -2, 0, 3, 7, 11, 18, 42];   // ~1M items would be ~20 steps for binary search, ~1M for linear
for (const t of [11, -5, 6]) {
  console.log("find", t, "-> linear:", linearSearch(arr, t), " binary:", binarySearch(arr, t));
}
`

const linkedListStarter = `// Singly linked list: nodes of { val, next }. No indexes — you follow 'next' pointers.
// Reversing one is THE classic: re-point every node's 'next' to the node before it.

// Helpers to move between arrays and lists (so we can see the result).
function toList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
  return head;
}
function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

// ---- Brute force: copy values out, rebuild reversed. Works, but O(n) EXTRA space. ----
function reverseListNaive(head) {
  const vals = [];
  for (let n = head; n; n = n.next) vals.push(n.val);   // extra array the size of the list
  let newHead = null;
  for (const v of vals) newHead = { val: v, next: newHead };  // prepend each -> reversed
  return newHead;
}

// ---- Optimized: rewire pointers in place. O(n) time, O(1) space (no extra array). ----
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;   // 1. save the rest of the list (or we lose it)
    curr.next = prev;         // 2. flip this node's pointer backward
    prev = curr;              // 3. advance prev
    curr = next;              // 4. advance curr
  }
  return prev;                // new head = last node we processed
}

console.log("naive:    ", toArray(reverseListNaive(toList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
console.log("in-place: ", toArray(reverseList(toList([1, 2, 3, 4, 5]))));      // [5,4,3,2,1]
`

const heapStarter = `// Kth largest element. JS has NO built-in heap — so here's a minimal one, and when it pays off.

// ---- Brute force: sort descending, take index k-1. O(n log n). ----
function findKthLargestBrute(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}

// ---- Optimized: a MIN-heap of size k. Keep only the k largest; its smallest IS the answer. O(n log k). ----
class MinHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  peek() { return this.h[0]; }
  push(v) {
    const h = this.h; h.push(v);
    let i = h.length - 1;
    while (i > 0) {                 // sift up
      const p = (i - 1) >> 1;
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]]; i = p;
    }
  }
  pop() {
    const h = this.h, top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last;
      let i = 0;
      for (;;) {                    // sift down
        let s = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < h.length && h[l] < h[s]) s = l;
        if (r < h.length && h[r] < h[s]) s = r;
        if (s === i) break;
        [h[s], h[i]] = [h[i], h[s]]; i = s;
      }
    }
    return top;
  }
}

function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop();   // drop the smallest so only the k largest remain
  }
  return heap.peek();
}

const nums = [3, 2, 1, 5, 6, 4];
console.log("2nd largest -> brute:", findKthLargestBrute(nums, 2), " heap:", findKthLargest(nums, 2)); // 5
`

const intervalsStarter = `// Merge overlapping intervals. The move that unlocks the whole category: SORT by start first.

// ---- Brute-force idea: compare every interval against every other and merge — up to O(n^2), fiddly.
//      (The sorted sweep below is the real answer.) ----

// ---- Optimized: sort by start, then sweep once. Overlaps become adjacent. O(n log n). ----
function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]); // copy so we don't mutate the input
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);   // overlap -> extend the previous interval
    } else {
      out.push([start, end]);             // no overlap -> start a new one
    }
  }
  return out;
}

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]])); // [[1,6],[8,10],[15,18]]
console.log(merge([[1, 4], [4, 5]]));                     // [[1,5]] (touching counts as overlap)
`

const greedyStarter = `// Maximum subarray sum (Kadane's algorithm) — the greedy "extend or restart" move.

// ---- Brute force: try every subarray and sum it. O(n^2). ----
function maxSubArrayBrute(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) { sum += nums[j]; best = Math.max(best, sum); }
  }
  return best;
}

// ---- Optimized (Kadane): at each element, extend the running sum OR restart from here. O(n). ----
function maxSubArray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]); // the greedy choice: restart vs extend
    best = Math.max(best, cur);
  }
  return best;
}

const a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("max subarray -> brute:", maxSubArrayBrute(a), " kadane:", maxSubArray(a)); // 6  ([4,-1,2,1])
`

export const advancedLessons = [
  // adv-algorithms — Snap-curated: JS-centric patterns, DOM-as-a-tree, performance framing.
  {
    id: 'adv-big-o', module: 'adv-algorithms', order: 1, kind: 'concept',
    title: 'Big-O & the cost of JavaScript', difficulty: 'easy', tags: ['algorithms', 'performance', 'complexity'],
    summary: 'Reason about how work grows with input — and why an O(n²) loop janks a scroll handler.',
    prompt: `**Big-O** describes how an algorithm's cost grows as the input \`n\` grows — the shape of the curve, ignoring constants. It's the vocabulary interviewers use to ask "can you make this faster?" and the lens for optimizing browser rendering.`,
    keyTerms: [
      { term: 'Big-O notation', def: 'An upper bound on how runtime (or memory) scales with input size n, dropping constants and lower-order terms. O(1) < O(log n) < O(n) < O(n log n) < O(n²).' },
      { term: 'Time vs space complexity', def: 'Time = how many operations; space = how much extra memory. A hash map often trades space (O(n)) for time (O(1) lookups).' },
      { term: 'Amortized O(1)', def: 'Average cost per operation over many operations, even if one occasionally costs more — e.g. Array.push, which is O(1) amortized.' },
      { term: 'Constant factors', def: 'Big-O hides them, but in a per-frame render loop they still matter — O(n) with a huge constant can miss the 16ms frame budget.' },
    ],
    codeNotes: [
      { label: 'Iterate: map / forEach / filter / reduce', code: `arr.map(x => x * 2);           // -> NEW array\narr.forEach(x => log(x));      // side effects, returns nothing\narr.filter(x => x > 0);        // -> subset\narr.reduce((a, x) => a + x, 0); // -> single value`, note: 'All O(n). map/filter allocate a new array; forEach does not.' },
      { label: 'Cheap vs costly array ops', code: `arr.push(x); arr.pop();        // O(1)\narr.unshift(x); arr.shift();   // O(n) — reindexes every element!\narr.includes(x); arr.indexOf(x); // O(n)`, note: 'A .includes() inside a loop is the hidden O(n^2).' },
    ],
    explanation: `**Common shapes (fastest → slowest):** O(1) hash lookup · O(log n) binary search · O(n) single pass · O(n log n) a good sort · O(n²) nested loops · O(2ⁿ) naive recursion.

**Costs of everyday JS operations — worth memorizing:**

| Operation | Cost | Why it matters |
|---|---|---|
| \`arr.push\` / \`arr.pop\` | O(1) amortized | Cheap — append/remove at the end. |
| \`arr.unshift\` / \`arr.shift\` | **O(n)** | Re-indexes every element. Avoid in loops. |
| \`arr.includes\` / \`arr.indexOf\` | O(n) | Linear scan. In a loop → O(n²). |
| \`map.get\` / \`set.has\` / \`obj[key]\` | O(1) | The fix for the above. |
| \`arr.sort\` | O(n log n) | Fine once; deadly inside a render loop. |
| Spread \`[...arr]\` / \`{...obj}\` | O(n) | Copies everything — watch it in hot paths. |

**Why Snap-style perf work cares:** a \`scroll\`/\`resize\` handler that does an O(n) \`.includes\` over a growing list becomes O(n²) as the user scrolls, blowing the ~16ms-per-frame budget and causing jank. The interview move: spot the nested linear work and replace it with a \`Map\`/\`Set\` for O(1) lookups. Same instinct as auditing AI-generated code for a hidden quadratic.`,
  },
  {
    id: 'adv-two-pointers', module: 'adv-algorithms', order: 2, kind: 'utility', template: 'vanilla',
    title: 'Two pointers (arrays & strings)', difficulty: 'medium', tags: ['algorithms', 'arrays', 'strings'],
    summary: 'Two indices moving toward each other turn many O(n²) scans into a single O(n) pass.',
    prompt: `Implement **\`twoSumSorted(nums, target)\`** — return the indices of the two values that sum to \`target\` in a **sorted** array — and **\`isPalindrome(str)\`**. Both use one pointer from each end, moving inward. No nested loop.`,
    keyTerms: [
      { term: 'Two-pointer technique', def: 'Keep two indices (often the ends) and move them toward each other based on a condition — O(n) time, O(1) space.' },
      { term: 'Sorted-input leverage', def: 'When the array is sorted, comparing the pair sum to the target tells you which pointer to move — no need to try every pair.' },
      { term: 'In-place / O(1) space', def: 'Two pointers usually mutate/scan the existing array without allocating a copy.' },
    ],
    codeNotes: [
      { label: 'Normalize a string (strip non-alphanumerics, lowercase)', code: `s = s.toLowerCase().replace(/[^a-z0-9]/g, "");`, note: 'The classic first line of Valid Palindrome. replaceAll(/.../g, "") does the same.' },
      { label: 'Two-pointer scan from both ends', code: `let lo = 0, hi = arr.length - 1;\nwhile (lo < hi) {\n  // compare arr[lo] / arr[hi], then move one inward\n  lo++; // or hi--;\n}`, note: 'O(n) time, O(1) space. Move the pointer that improves the condition.' },
    ],
    starterCode: { '/index.js': twoPointersStarter },
    explanation: `The insight: a **brute force** two-sum tries every pair — O(n²). If the array is **sorted**, the sum of the current ends tells you everything: too small → move \`lo\` up; too big → move \`hi\` down. One pass, O(n). Palindrome check is the same idea from both ends. Follow-ups interviewers love: **container with most water**, **3-sum** (sort, then two-pointer inside a loop), and **remove duplicates in place**.`,
  },
  {
    id: 'adv-recursion', module: 'adv-algorithms', order: 3, kind: 'utility', template: 'vanilla',
    title: 'Recursion & backtracking', difficulty: 'medium', tags: ['algorithms', 'recursion', 'backtracking'],
    summary: 'A base case plus a smaller sub-problem — the pattern behind permutations, trees, and JSON walks.',
    prompt: `Implement **\`permutations(arr)\`**: return every ordering of the input. Pick each element as the first, recurse on the rest, and combine. \`permutations([1,2,3])\` has **6** results.`,
    keyTerms: [
      { term: 'Base case', def: 'The smallest input the function answers directly (here, an array of length ≤ 1) — it stops the recursion.' },
      { term: 'Recursive case', def: 'Reduce the problem to a smaller one and call yourself: permute the remaining elements.' },
      { term: 'Backtracking', def: 'Choose an option, recurse, then undo the choice and try the next — how you explore all permutations/combinations.' },
      { term: 'Call stack', def: 'Each recursive call adds a frame; too deep (no base case, or huge n) throws "Maximum call stack size exceeded".' },
    ],
    codeNotes: [
      { label: 'Base case first, always', code: `if (arr.length <= 1) return [arr.slice()]; // stops the recursion`, note: 'No base case → "Maximum call stack size exceeded".' },
      { label: 'Copy an array without index i', code: `const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];`, note: 'Spread + slice = immutable "everything except i".' },
    ],
    starterCode: { '/index.js': recursionStarter },
    explanation: `Every recursion needs a **base case** (or it never stops) and a step that shrinks the input toward it. Permutations is the canonical **backtracking** shape: fix one element, solve the smaller problem, repeat for each choice. The same structure walks a **tree** or a nested JSON blob. Cost here is O(n·n!) — permutations are inherently explosive, a good prompt for "why is this slow?". Follow-ups: **subsets/powerset**, **combinations**, and converting deep recursion to an **explicit stack** to dodge call-stack limits.`,
  },
  {
    id: 'adv-trees-dom', module: 'adv-algorithms', order: 4, kind: 'utility', template: 'vanilla',
    title: 'Trees & DOM traversal (BFS/DFS)', difficulty: 'medium', tags: ['algorithms', 'trees', 'dom', 'bfs-dfs'],
    summary: 'The DOM is a tree. Walk it depth-first with recursion or breadth-first with a queue.',
    prompt: `Implement **\`dfs(node)\`** (depth-first, pre-order) and **\`bfs(root)\`** (breadth-first, level order) over a tree of \`{ value, children }\`. Return the values in visit order. This is exactly how you'd walk the DOM.`,
    keyTerms: [
      { term: 'DFS (depth-first)', def: 'Go as deep as possible before backtracking. Natural with recursion (the call stack is your stack). Pre/in/post-order are DFS variants.' },
      { term: 'BFS (breadth-first)', def: 'Visit every node at one depth before the next, using a FIFO queue. Finds the shallowest match first.' },
      { term: 'Queue vs stack', def: 'BFS uses a queue (shift/push); DFS uses a stack (or recursion). Swapping the data structure flips the traversal.' },
      { term: 'The DOM is a tree', def: 'Elements nest into a tree; querySelectorAll, event bubbling, and React reconciliation all traverse it. Same for a Canvas/WebGL scene graph.' },
    ],
    codeNotes: [
      { label: 'BFS with a queue', code: `const queue = [root];\nwhile (queue.length) {\n  const node = queue.shift();               // dequeue front\n  for (const c of node.children) queue.push(c); // enqueue kids\n}`, note: 'Swap shift() for pop() and it becomes DFS.' },
      { label: 'DFS with recursion', code: `function dfs(node, out = []) {\n  out.push(node.value);\n  for (const c of node.children) dfs(c, out);\n  return out;\n}`, note: 'The call stack IS your stack.' },
      { label: 'Make a 2D grid (graph / DP problems)', code: `const grid = Array.from({ length: rows }, () => Array(cols).fill(0));\ngrid[r][c] = 1;`, note: 'Never Array(rows).fill(Array(cols)) — every row would share ONE reference.' },
    ],
    starterCode: { '/index.js': treesDomStarter },
    explanation: `A **tree** is nodes with children and no cycles — the DOM, a file system, a JSON document, a game scene graph. **DFS** dives deep (recursion is easiest; each frame is a node); **BFS** fans out level by level with a **queue**. Choose BFS when the answer is likely shallow (shortest path / nearest ancestor), DFS to fully explore a branch. Real front-end parallels: event **bubbling** walks ancestors, \`querySelectorAll\` traverses descendants, and React's reconciler diffs the tree. Follow-ups: **max depth**, **level-order grouping**, **lowest common ancestor**, and **serialize/deserialize** a tree.`,
  },
  {
    id: 'adv-hashmaps', module: 'adv-algorithms', order: 5, kind: 'utility', template: 'vanilla',
    title: 'Hash maps & sets', difficulty: 'easy', tags: ['algorithms', 'hashmap', 'performance'],
    summary: 'O(1) lookups that collapse O(n²) scans to O(n) — dedup, counting, and one-pass two-sum.',
    prompt: `Implement **\`twoSum(nums, target)\`** in a **single pass** using a \`Map\` (unsorted input), and **\`frequency(items)\`** that counts occurrences. The map remembers what you've seen so you never rescan.`,
    keyTerms: [
      { term: 'Hash map', def: 'Key → value with O(1) average lookup/insert (JS: Map or a plain object). Trades memory for speed.' },
      { term: 'Set', def: 'A collection of unique values with O(1) has/add — ideal for dedup and "seen?" checks.' },
      { term: 'Map vs plain object', def: 'Map keeps any key type and insertion order and has .size; objects only take string/symbol keys. Prefer Map for dynamic dictionaries.' },
      { term: 'Complement trick', def: 'For two-sum, store each value and look up target − current in O(1) — one pass instead of checking every pair.' },
    ],
    codeNotes: [
      { label: 'Map & Set essentials', code: `const m = new Map();\nm.set(k, v); m.get(k); m.has(k); m.size;\nconst s = new Set(arr);   // dedup in one line\ns.has(x); s.add(x);`, note: 'Prefer Map/Set over {}/[] for O(1) lookups and any key type.' },
      { label: 'Spread a Map/Set back to an array', code: `[...m];         // [[k, v], ...]\n[...m.keys()];  [...m.values()];\n[...s];         // unique values`, note: 'Handy for returning results.' },
      { label: 'Frequency counter', code: `const count = new Map();\nfor (const x of arr) count.set(x, (count.get(x) || 0) + 1);`, note: 'The core of group-by / top-K / anagrams.' },
    ],
    starterCode: { '/index.js': hashMapsStarter },
    explanation: `Hash maps are the single highest-leverage tool in a coding round: any time you catch yourself scanning a list **inside** another loop, a \`Map\`/\`Set\` usually removes the inner scan and drops O(n²) → O(n). Two-sum is the archetype — remember the **complement** (\`target − current\`) as you go. Counting/grouping with a \`Map\` is exactly what "log and analyze engagement metrics" looks like in practice. Follow-ups: **group anagrams**, **first unique character**, **top-K frequent** (map + heap), and **LRU cache** (Map preserves insertion order).`,
  },
  {
    id: 'adv-sliding-window', module: 'adv-algorithms', order: 6, kind: 'utility', template: 'vanilla',
    title: 'Sliding window', difficulty: 'medium', tags: ['algorithms', 'strings', 'two-pointers'],
    summary: 'A window that grows and shrinks over a string/array — O(n) answers to "longest/shortest" sub-range questions.',
    prompt: `Implement **\`lengthOfLongestSubstring(s)\`** (LeetCode 3): the length of the longest substring with **no repeating characters**. Slide a window — extend \`right\`, and when a duplicate appears, move \`left\` past it. No nested loop.`,
    keyTerms: [
      { term: 'Sliding window', def: 'Two indices [left..right] bounding a contiguous range. Grow by moving right; shrink by moving left when a constraint breaks.' },
      { term: 'Variable-size window', def: 'The window resizes to stay valid (vs. a fixed-k window). Used for "longest/shortest substring with property X".' },
      { term: 'Amortized O(n)', def: 'left and right each only move forward across the whole input, so every element is visited at most twice — O(n), not O(n²).' },
      { term: 'Window state', def: 'A Map/Set/counter tracking what is inside the window (here, each char\'s last index) so you can shrink correctly.' },
    ],
    codeNotes: [
      { label: 'Current window size', code: `const size = right - left + 1;`, note: 'Off-by-one lives here — the window is inclusive [left..right].' },
      { label: 'Track window contents with a Map', code: `const seen = new Map();               // char -> last index\nseen.set(c, right);\nif (seen.has(c) && seen.get(c) >= left) left = seen.get(c) + 1;`, note: 'Jump left past a duplicate instead of stepping one at a time.' },
    ],
    starterCode: { '/index.js': slidingWindowStarter },
    explanation: `**The journey (run both above):** brute force fixes each start and re-scans forward — the same characters get re-checked from every start, so **O(n²)**. The window *reuses* that work: on a repeat you don't restart, you slide \`left\` just past the earlier copy. Each index is visited at most twice → **O(n)**.

**Your Sliding-Window set (6):** best time to buy & sell stock · **longest substring without repeating** (this) · longest repeating character replacement · minimum window substring · permutation in string · sliding window maximum. They differ only in *what you track inside the window* — a running min, a char-count, a need/have tally, or a deque.`,
  },
  {
    id: 'adv-stack', module: 'adv-algorithms', order: 7, kind: 'utility', template: 'vanilla',
    title: 'Stack (matching & nesting)', difficulty: 'easy', tags: ['algorithms', 'stack', 'data-structures'],
    summary: 'LIFO push/pop — the right tool whenever order and nesting matter (parentheses, undo, expressions).',
    prompt: `Implement **\`isValid(s)\`** (LeetCode 20): return true if every bracket \`()[]{}\` is closed in the correct order. Push openers; when you hit a closer, it must match the **most-recent** opener on top of the stack.`,
    keyTerms: [
      { term: 'Stack (LIFO)', def: 'Last-in, first-out. push() adds to the top, pop() removes the top. A plain JS array is a stack.' },
      { term: 'Why a stack here', def: 'Nesting is inherently last-opened-first-closed: "([)]" is invalid precisely because a stack would mismatch. Ordering rules out a naive count.' },
      { term: 'Monotonic stack', def: 'A stack kept sorted (increasing/decreasing) as you push — the trick behind "next greater element" and daily-temperatures.' },
    ],
    codeNotes: [
      { label: 'A JS array IS a stack', code: `const stack = [];\nstack.push(x);            // add to top\nstack.pop();              // remove + return top\nstack[stack.length - 1];  // peek`, note: 'No special class needed.' },
      { label: 'Object as a fixed lookup map', code: `const pairFor = { ")": "(", "]": "[", "}": "{" };\nif (ch in pairFor) { /* ch is a closer */ }`, note: 'The `in` operator tests keys — O(1) membership on a small fixed set.' },
    ],
    starterCode: { '/index.js': stackStarter },
    explanation: `**The journey (run both above):** the naive version strips matched pairs over and over until the string stops shrinking — correct, but each pass re-scans everything → **O(n²)**. The stack does it in **one pass** because it remembers *order*: \`([)]\` has balanced counts yet the wrong nesting, so plain counting can't catch it. Empty stack at the end = valid. **O(n)**.

**Your Stack set (12):** **valid parentheses** (this) · min-stack · evaluate reverse-polish notation · generate parentheses · daily temperatures · car fleet · largest rectangle in histogram · reverse substrings between parentheses · backspace string compare · remove adjacent duplicates I & II · basic calculator. *Daily temperatures*, *car fleet*, and *largest rectangle* are the **monotonic stack** family — a stack kept in sorted order.`,
  },
  {
    id: 'adv-binary-search', module: 'adv-algorithms', order: 8, kind: 'utility', template: 'vanilla',
    title: 'Binary search', difficulty: 'easy', tags: ['algorithms', 'binary-search'],
    summary: 'Halve a sorted range each step — O(log n). The pattern behind "search space" problems, not just arrays.',
    prompt: `Implement **\`binarySearch(nums, target)\`**: return the index of \`target\` in a **sorted** array, or \`-1\`. Compare the middle, then throw away the half that can't contain the answer.`,
    keyTerms: [
      { term: 'Binary search', def: 'Repeatedly halve a sorted search range by comparing the midpoint to the target. O(log n) time, O(1) space.' },
      { term: 'Loop invariant', def: 'The answer, if present, always lies within [lo..hi]. Each step provably shrinks that range, guaranteeing termination.' },
      { term: 'Midpoint without overflow', def: 'Use lo + ((hi - lo) >> 1) (or (lo+hi)>>1 for safe sizes) instead of (lo+hi)/2 to avoid integer overflow in other languages.' },
      { term: 'Search space', def: 'Binary search works on any monotonic predicate — rotated arrays, "koko eating bananas", or first-true boundaries, not only literal sorted values.' },
    ],
    codeNotes: [
      { label: 'Safe midpoint + loop condition', code: `while (lo <= hi) {\n  const mid = (lo + hi) >> 1;          // floor\n  // use lo + ((hi - lo) >> 1) to avoid overflow in other languages\n}`, note: '>> 1 floor-divides by 2.' },
      { label: 'Shrink the range — the ±1 matters', code: `if (nums[mid] < target) lo = mid + 1;\nelse hi = mid - 1;`, note: 'Drop the +1/-1 and the range never shrinks → infinite loop.' },
    ],
    starterCode: { '/index.js': binarySearchStarter },
    explanation: `**The journey (run both above):** linear search ignores the ordering and checks every element — **O(n)**. Binary search *uses* the sorted order to discard half each step — ~20 checks for a million items, **O(log n)**. Two correctness details: loop while \`lo <= hi\`, and move to \`mid ± 1\` (drop the ±1 and you loop forever).

**Your Binary-Search set (4):** search in rotated sorted array · find minimum in rotated sorted array · koko eating bananas · median of two sorted arrays — plus the **classic search** you built here. The bigger idea in those four: binary-search on a *condition* (is this the rotation point? is this eating-speed fast enough?), not on literal sorted values.`,
  },
  {
    id: 'adv-linked-list', module: 'adv-algorithms', order: 9, kind: 'utility', template: 'vanilla',
    title: 'Linked lists (pointer surgery)', difficulty: 'medium', tags: ['algorithms', 'linked-list', 'data-structures'],
    summary: 'Nodes joined by next pointers. Reversing one — re-pointing each link backward — is the canonical warm-up.',
    prompt: `Implement **\`reverseList(head)\`** (LeetCode 206): reverse a singly linked list of \`{ val, next }\` nodes **in place** and return the new head. Walk the list with three pointers: \`prev\`, \`curr\`, and a saved \`next\`.`,
    keyTerms: [
      { term: 'Singly linked list', def: 'A chain of nodes; each holds a value and a next pointer to the following node (null at the end). No random/index access.' },
      { term: 'Pointer re-linking', def: 'Reversal flips each node\'s next to point at the previous node — save next first, or you lose the rest of the list.' },
      { term: 'Dummy head', def: 'A throwaway node before the real head that removes edge cases when merging/removing at the front. Common across linked-list problems.' },
      { term: 'Fast & slow pointers', def: 'Two pointers at different speeds — finds the middle, detects a cycle (Floyd\'s), or locates the nth-from-end in one pass.' },
    ],
    codeNotes: [
      { label: 'A list node — object literal or class', code: `const node = { val: 1, next: null };\n// LeetCode-style class:\nclass ListNode {\n  constructor(val = 0, next = null) { this.val = val; this.next = next; }\n}`, note: 'Interviews usually accept either.' },
      { label: 'Save next BEFORE you rewire', code: `const next = curr.next; // 1. save the rest\ncurr.next = prev;       // 2. reverse this link\nprev = curr;            // 3. advance prev\ncurr = next;            // 4. advance curr`, note: 'Wrong order = you drop the tail.' },
      { label: 'Dummy head kills edge cases', code: `const dummy = { val: 0, next: head };\nlet tail = dummy;\n// ... build tail.next ...\nreturn dummy.next;`, note: 'Cleans up merge / remove-nth-node.' },
    ],
    starterCode: { '/index.js': linkedListStarter },
    explanation: `**The journey (run both above):** the naive reversal copies values into an array and rebuilds — O(n) time but **O(n) extra space**. Rewiring pointers in place is O(n) time and **O(1) space**; the one trap is order — **save \`next\` before** overwriting \`curr.next\`, or you lose the tail.

**Your Linked-List set (8):** **reverse linked list** (this) · merge two sorted lists · reorder list · remove nth node from end · linked list cycle · merge k sorted lists · find the duplicate number · copy list with random pointer. Two tricks unlock most: a **dummy head** (merge, remove-nth) and **fast/slow pointers** (find the middle, detect a *cycle*, reorder).`,
  },

  {
    id: 'adv-heap', module: 'adv-algorithms', order: 11, kind: 'utility', template: 'vanilla',
    title: 'Heaps & priority queues', difficulty: 'hard', tags: ['algorithms', 'heap', 'priority-queue', 'data-structures'],
    summary: 'A structure that always hands you the smallest (or largest) item in O(log n) — the tool for top-K, medians, and scheduling.',
    prompt: `Implement **\`findKthLargest(nums, k)\`**. **JS has no built-in heap**, so you'll build a minimal **min-heap** and keep only the \`k\` largest elements — its smallest is the answer. Compare it to the brute-force sort.`,
    keyTerms: [
      { term: 'Heap / priority queue', def: 'A binary tree (stored in an array) where each parent ≤ (min-heap) or ≥ (max-heap) its children, so peek is O(1) and push/pop are O(log n).' },
      { term: 'sift up / sift down', def: 'After a push, bubble the new value up to its spot; after a pop, move the last value to the root and sink it down. This keeps the heap ordered.' },
      { term: 'No built-in heap in JS', def: 'Unlike Java (PriorityQueue) or Python (heapq), JS ships none — you implement one, or fake it with a sorted array for small inputs.' },
      { term: 'Keep-k trick', def: 'A min-heap of size k gives the kth largest: push all, pop whenever size > k, and the root is the answer. O(n log k).' },
    ],
    codeNotes: [
      { label: 'Array-as-heap index math', code: `parent = (i - 1) >> 1;\nleft   = 2 * i + 1;\nright  = 2 * i + 2;`, note: 'A heap is just an array — no node objects needed.' },
      { label: 'Keep only the k largest (min-heap)', code: `heap.push(n);\nif (heap.size() > k) heap.pop(); // drop the smallest\n// answer = heap.peek();`, note: 'O(n log k) — beats sorting when k << n or the data streams in.' },
    ],
    starterCode: { '/index.js': heapStarter },
    explanation: `**The journey (run both above):** sorting the whole array to grab one element is **O(n log n)** and needs all the data up front. A **min-heap of size k** processes items one at a time and stays size k, so it's **O(n log k)** — the win when k is small, n is huge, or the data **streams**.

**Your Heap set:** find median from data stream (two heaps — a max-heap + min-heap balanced around the middle) · campus bikes — plus the canonical crew: **kth largest** (this) · **top-K frequent** (map + heap) · **merge K sorted lists** · **task scheduler**. The tell for a heap: "top/smallest/largest **K**" or "**streaming** median".`,
  },
  {
    id: 'adv-intervals', module: 'adv-algorithms', order: 12, kind: 'utility', template: 'vanilla',
    title: 'Intervals', difficulty: 'medium', tags: ['algorithms', 'intervals', 'sorting'],
    summary: 'Overlapping ranges become easy the moment you sort by start — then sweep once.',
    prompt: `Implement **\`merge(intervals)\`** (LeetCode 56): combine all overlapping intervals. Sort by start, then sweep — if the next interval starts at or before the current end, extend; otherwise begin a new one.`,
    keyTerms: [
      { term: 'Overlap condition', def: 'Two intervals [a,b] and [c,d] overlap iff c <= b (once sorted by start). Touching ends (b == c) usually counts as overlap.' },
      { term: 'Sort-by-start', def: 'The category-defining move — after sorting on the start value, all overlaps are adjacent, so one linear pass merges them.' },
      { term: 'Sweep line', def: 'Process endpoints in order, tracking active intervals — the general tool behind meeting-rooms and calendar problems.' },
    ],
    codeNotes: [
      { label: 'Sort by start (copy first)', code: `const sorted = [...intervals].sort((a, b) => a[0] - b[0]);`, note: 'Spread-copy so you do not mutate the input array.' },
      { label: 'Extend or push', code: `const last = out[out.length - 1];\nif (last && start <= last[1]) last[1] = Math.max(last[1], end);\nelse out.push([start, end]);`, note: 'start <= last[1] is the overlap test.' },
    ],
    starterCode: { '/index.js': intervalsStarter },
    explanation: `**The journey (run both above):** comparing every interval to every other to find overlaps is **O(n²)** and awkward. **Sort by start first** and overlaps line up next to each other, so a single sweep merges them — **O(n log n)**, dominated by the sort.

**Your Intervals set (5):** insert interval · **merge intervals** (this) · non-overlapping intervals (min removals) · meeting rooms (can you attend all?) · meeting rooms II (how many rooms — a min-heap of end times). Almost all start with **sort by start** (or by end, for the greedy ones).`,
  },
  {
    id: 'adv-greedy', module: 'adv-algorithms', order: 13, kind: 'utility', template: 'vanilla',
    title: 'Greedy (Kadane & friends)', difficulty: 'medium', tags: ['algorithms', 'greedy'],
    summary: 'Take the best local choice and never look back — when the problem guarantees it works.',
    prompt: `Implement **\`maxSubArray(nums)\`** (LeetCode 53) with **Kadane's algorithm**: walk once, and at each element choose to **extend** the running sum or **restart** from here. Compare it to the O(n²) brute force.`,
    keyTerms: [
      { term: 'Greedy', def: 'Make the locally optimal choice at each step and never reconsider. Fast and simple — but only correct when the problem has the greedy-choice property.' },
      { term: "Kadane's algorithm", def: 'For max subarray: keep a running sum; if it goes negative it can only hurt, so restart. Track the best seen. O(n), O(1) space.' },
      { term: 'When greedy fails', def: 'If a locally best choice can block a better global outcome (e.g. 0/1 knapsack), greedy is wrong — you need DP instead.' },
    ],
    codeNotes: [
      { label: 'Kadane — extend or restart', code: `cur = Math.max(nums[i], cur + nums[i]);\nbest = Math.max(best, cur);`, note: 'If cur + nums[i] < nums[i], the past was dragging you down — restart.' },
    ],
    starterCode: { '/index.js': greedyStarter },
    explanation: `**The journey (run both above):** summing **every** subarray is **O(n²)**. Kadane's insight is greedy: a running sum that has gone **negative can only hurt** what comes next, so drop it and restart — one pass, **O(n)**.

**Your Greedy set (5):** **maximum subarray** (this) · jump game (can you reach the end?) · jump game II (fewest jumps) · gas station · hand of straights. The hard part of greedy isn't the code — it's **arguing the local choice is safe**. If it isn't, reach for DP.`,
  },
  {
    id: 'adv-cheatsheet', module: 'adv-algorithms', order: 99, kind: 'concept',
    title: 'Cheat sheet — patterns & JS idioms', difficulty: 'easy', tags: ['algorithms', 'cheatsheet', 'reference', 'javascript'],
    summary: 'One-page recap: which pattern to reach for, plus the JavaScript one-liners you actually code them with.',
    prompt: `A quick-reference recap of everything in this module — the **pattern table** (how to recognize which tool to grab), and the **JS idioms** you reach for while coding (see the "Code to reach for" panel). A TypeScript quick-ref is seeded at the bottom for when that module lands.`,
    keyTerms: [
      { term: 'Pattern recognition', def: 'The real interview skill: mapping a problem to a known pattern (hashing, two-pointer, window, stack, binary search, BFS/DFS) fast.' },
      { term: 'Mutating vs non-mutating', def: 'sort/reverse/push/splice change the array in place; map/filter/slice/spread return a new one. Know which you called.' },
      { term: 'Reference vs value', def: 'Objects/arrays are shared by reference — {...o}/[...a] copy one level (shallow); structuredClone copies all levels (deep).' },
    ],
    codeNotes: [
      { label: 'Arrays — transform', code: `arr.map(x => x * 2);            // -> NEW array\narr.filter(x => x > 0);         // -> subset\narr.reduce((a, x) => a + x, 0); // -> one value\narr.forEach(x => log(x));       // side effects only`, note: 'All O(n). map/filter allocate; forEach does not.' },
      { label: 'Sort (numbers need a comparator!)', code: `[...arr].sort((a, b) => a - b);  // ascending numbers (copy first to not mutate)\narr.sort();                       // string/lexicographic — [1,10,2] bug!`, note: 'Bare sort() compares as strings.' },
      { label: 'Shallow vs deep copy', code: `const shallow = { ...obj };        // or [...arr] — one level\nconst deep = structuredClone(obj); // every level (modern)\nconst deep2 = JSON.parse(JSON.stringify(obj)); // loses Date/Map/undefined`, note: 'Nested objects are shared in a shallow copy.' },
      { label: '2D array (grids)', code: `const grid = Array.from({ length: rows }, () => Array(cols).fill(0));`, note: 'Never Array(rows).fill(Array(cols)) — rows would share ONE reference.' },
      { label: 'Class (custom data structures)', code: `class Node {\n  constructor(val = 0, next = null) { this.val = val; this.next = next; }\n}\nconst n = new Node(1);`, note: 'For list/tree nodes, stacks-with-metadata, etc.' },
      { label: 'Map / Set', code: `const m = new Map(); m.set(k, v); m.get(k); m.has(k);\nconst s = new Set(arr); s.has(x); s.add(x);   // dedup + O(1) membership`, note: 'Reach for these over {}/[] in almost every problem.' },
      { label: 'Regex — normalize a string', code: `s.toLowerCase().replace(/[^a-z0-9]/g, ""); // strip to lowercase alphanumerics`, note: 'The palindrome / string-cleanup workhorse.' },
      { label: 'TypeScript quick-ref (seed — its own module later)', code: `function twoSum(nums: number[], target: number): number[] { ... }\ninterface ListNode { val: number; next: ListNode | null; }\nfunction first<T>(arr: T[]): T | undefined { return arr[0]; } // generic\ntype Dir = "N" | "E" | "S" | "W";   // union / literal types`, note: 'Same algorithms, with types on the inputs/outputs.' },
    ],
    explanation: `## Pattern table — reach for…

| Pattern | When you see… | Core idea | Time |
|---|---|---|---|
| Hashing (Map/Set) | "seen before?", counts, pairs summing to K | O(1) lookups; complement trick | O(n) |
| Two pointers | sorted array, palindrome, pair from both ends | walk inward from the ends | O(n) |
| Sliding window | longest/shortest substring or subarray | grow right, shrink left | O(n) |
| Stack | matching/nesting, "next greater/warmer" | LIFO; monotonic stack | O(n) |
| Binary search | sorted input, or "smallest value that works" | halve the search space | O(log n) |
| Linked list | reverse/reorder/cycle/middle in place | dummy head; fast & slow pointers | O(n) |
| Recursion / backtracking | permutations, subsets, tree walks | base case + smaller subproblem | varies |
| Trees / graphs | hierarchy, grid, connectivity | BFS = queue, DFS = stack/recursion | O(V+E) |
| Heap / priority queue | top/smallest K, streaming median | keep-k min-heap | O(n log k) |
| Intervals | overlapping ranges, meeting rooms | sort by start, then sweep | O(n log n) |
| Greedy | max subarray, jumps, scheduling | best local choice (when provably safe) | O(n) |

## How to pick, in 15 seconds
1. **Is the input sorted?** → binary search or two pointers.
2. **Counting, dedup, or "have I seen X?"** → Map/Set.
3. **Contiguous "longest/shortest with property"** → sliding window.
4. **Matching, nesting, or most-recent-first** → stack.
5. **All arrangements / explore then undo** → recursion + backtracking.
6. **Tree/grid/graph** → BFS (shortest/level) or DFS (explore a branch).

Then check the **Code to reach for** panel above for the exact JavaScript one-liners. Everything here
generalizes to TypeScript — you just add types to the inputs and outputs (see the last snippet).`,
  },

  // adv-projects
  {
    id: 'adv-snake', module: 'adv-projects', order: 1, kind: 'project', template: 'react',
    title: 'Build a Snake game', difficulty: 'hard', tags: ['project', 'canvas', 'game-loop'],
    title: 'Build a Snake game', difficulty: 'hard', tags: ['project', 'canvas', 'game-loop'],
    summary: 'A full interactive project: the game loop, canvas rendering, and input handling.',
    prompt: `Build **Snake** from scratch. Click the preview and steer with **arrow keys / WASD**. Then make it yours: change \`SPEED\`, \`COUNT\`, colors, add wrap-around walls or a restart button.`,
    keyTerms: [
      { term: 'Game loop', def: 'A fixed-interval tick that updates state then redraws. Here a setInterval every SPEED ms.' },
      { term: 'Canvas', def: 'An immediate-mode drawing surface. You clear and repaint every frame with the 2D context.' },
      { term: 'Refs for mutable state', def: 'Fast-changing game state lives in useRef so the loop isn’t recreated each render (which would reset the game).' },
      { term: 'Collision detection', def: 'Checking the head against walls and the snake’s own body each tick.' },
    ],
    starterCode: { '/App.js': snakeStarter },
    explanation: `**What this teaches:** separating *update* (move, eat, collide) from *render* (draw), why fast game state belongs in **refs** not \`useState\` (state re-creates the effect and stutters), and cleaning up the interval + key listener on unmount.

**Extend it:** a restart button (reset the ref + \`setOver(false)\`), wrap-around edges (\`(head.x + COUNT) % COUNT\`), increasing speed as the score climbs, or \`requestAnimationFrame\` with delta-time instead of \`setInterval\`. Great portfolio piece and a common live-coding round.`,
  },

  // adv-sysdesign
  {
    id: 'adv-sysdesign-frontend', module: 'adv-sysdesign', order: 1, kind: 'concept',
    title: 'Frontend system design framework', difficulty: 'hard', tags: ['system-design', 'frontend'],
    summary: 'A repeatable structure for "design a news feed / autocomplete / chat" questions.',
    prompt: `Frontend system design isn’t about servers — it’s **components, data flow, state, performance, and edge cases** at scale. Use a framework so you don’t ramble.`,
    keyTerms: [
      { term: 'Requirements', def: 'Clarify functional (what it does) and non-functional (perf, a11y, i18n, offline) needs first.' },
      { term: 'Component architecture', def: 'Break the UI into a tree; define props/state boundaries and ownership.' },
      { term: 'Data model & API', def: 'What the client stores, what it fetches, pagination shape (cursor vs offset).' },
      { term: 'Rendering strategy', def: 'CSR vs SSR vs SSG; virtualization for long lists; when to lazy-load.' },
    ],
    explanation: `**RADIO-style flow:** **R**equirements → **A**rchitecture (component tree + data flow) → **D**ata model → **I**nterface/API → **O**ptimizations & edge cases.

For a **news feed**: infinite scroll with **cursor pagination**, **list virtualization** so the DOM stays small, **optimistic** likes, image lazy-loading, skeleton loading states, and a11y (keyboard, ARIA live regions). Always close with trade-offs and failure modes (empty, error, slow network). Talk **out loud** and drive the conversation.`,
  },
  {
    id: 'adv-sysdesign-scale', module: 'adv-sysdesign', order: 2, kind: 'concept',
    title: 'Scaling a backend', difficulty: 'hard', tags: ['system-design', 'backend'],
    summary: 'Caching, load balancing, queues, and databases that outgrow one box.',
    prompt: `When one server/DB isn’t enough: add **caching**, **horizontal scaling** behind a **load balancer**, **queues** for slow work, and **replicas/sharding** for the database.`,
    keyTerms: [
      { term: 'Vertical vs horizontal scaling', def: 'Bigger box vs more boxes. Horizontal scales further but needs statelessness.' },
      { term: 'Load balancer', def: 'Distributes requests across many server instances; enables zero-downtime deploys.' },
      { term: 'Cache (Redis)', def: 'In-memory store for hot data/sessions to cut DB load and latency.' },
      { term: 'Message queue', def: 'Buffer (e.g. RabbitMQ/SQS) that offloads slow tasks (email, image processing) to workers.' },
      { term: 'Replication & sharding', def: 'Copies for read scale/failover (replication); splitting data across nodes for write scale (sharding).' },
    ],
    explanation: `A typical progression: **1)** one server + DB → **2)** add a **cache** for hot reads → **3)** go **stateless** and put N servers behind a **load balancer** → **4)** move slow work to a **queue + workers** → **5)** add **read replicas**, then **shard** when writes dominate. Every step trades simplicity for scale — interviewers want you to justify *why* and name the new failure modes (cache invalidation, replication lag, hot shards).`,
  },

  // adv-ai
  {
    id: 'adv-ai-workflow', module: 'adv-ai', order: 1, kind: 'concept',
    title: 'Using AI in your dev workflow', difficulty: 'medium', tags: ['ai', 'productivity'],
    summary: 'Where AI accelerates you, where it hurts, and how to stay the engineer in charge.',
    prompt: `AI coding tools are a **force multiplier** for scaffolding, boilerplate, tests, explanations, and refactors — but you own **correctness, security, and architecture**. Use it deliberately.`,
    keyTerms: [
      { term: 'Autocomplete vs agent', def: 'Inline completion (Copilot) suggests as you type; agents (Claude Code) plan and edit across files.' },
      { term: 'Context', def: 'What the model can see — files, errors, docs. Better context in → better output.' },
      { term: 'Hallucination', def: 'Confident, wrong output (a fake API, a subtly buggy loop). Always verify.' },
      { term: 'Verification loop', def: 'Run it, test it, read the diff. Never merge AI code you haven’t understood.' },
    ],
    explanation: `**High-value uses:** scaffolding a component/route, writing tests, explaining unfamiliar code, translating between languages, drafting docs, exploring an approach fast. **Low-value / risky:** novel algorithms, security-critical code, anything you can’t verify.

**Stay in control:** give clear context, work in small verifiable steps, read every diff, and keep the mental model yourself — in interviews you must still explain *why* the code works. This very app was built with an AI agent, then verified with builds and tests.`,
  },
  {
    id: 'adv-ai-prompting', module: 'adv-ai', order: 2, kind: 'utility', template: 'vanilla',
    title: 'Prompt patterns for coding', difficulty: 'easy', tags: ['ai', 'prompting'],
    summary: 'Structure requests so you get correct, reviewable code back.',
    prompt: `Good coding prompts share a shape: **role + task + context + constraints + output format**. Edit the template and see the assembled prompt.`,
    keyTerms: [
      { term: 'Specificity', def: 'Vague in → vague out. State the language, versions, inputs, and edge cases.' },
      { term: 'Constraints', def: 'Rules the answer must obey (no new deps, match existing style, handle errors).' },
      { term: 'Few-shot example', def: 'Showing one input→output example steers format and style better than describing it.' },
      { term: 'Iterative refinement', def: 'Treat it as a conversation: run, report the error, ask for a fix.' },
    ],
    starterCode: {
      '/index.js': `// Assemble a strong coding prompt from parts. Tweak the fields.
const spec = {
  role: "senior TypeScript engineer",
  task: "write a debounce<T> utility",
  context: "used in a React search box; strict mode; no external deps",
  constraints: ["preserve 'this' and args", "add a .cancel() method", "include JSDoc"],
  outputFormat: "a single .ts file, then 2 lines on the tradeoff vs throttle",
};

const prompt = [
  \`You are a \${spec.role}.\`,
  \`Task: \${spec.task}.\`,
  \`Context: \${spec.context}.\`,
  \`Constraints:\\n- \${spec.constraints.join("\\n- ")}\`,
  \`Output: \${spec.outputFormat}.\`,
].join("\\n\\n");

console.log(prompt);
// A specific, constrained prompt yields code you can actually review and merge.
`,
    },
    explanation: `Notice the pattern generalizes beyond code: **role** sets expertise, **task** is the ask, **context** grounds it in your real situation, **constraints** prevent the common wrong answers, and **output format** makes the result easy to use and verify. When the first answer is off, don’t restart — **refine iteratively** with the specific error.`,
  },
]
