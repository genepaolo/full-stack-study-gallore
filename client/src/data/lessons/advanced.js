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
    starterCode: { '/index.js': hashMapsStarter },
    explanation: `Hash maps are the single highest-leverage tool in a coding round: any time you catch yourself scanning a list **inside** another loop, a \`Map\`/\`Set\` usually removes the inner scan and drops O(n²) → O(n). Two-sum is the archetype — remember the **complement** (\`target − current\`) as you go. Counting/grouping with a \`Map\` is exactly what "log and analyze engagement metrics" looks like in practice. Follow-ups: **group anagrams**, **first unique character**, **top-K frequent** (map + heap), and **LRU cache** (Map preserves insertion order).`,
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
