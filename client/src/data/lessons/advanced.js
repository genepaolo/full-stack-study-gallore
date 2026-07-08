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

export const advancedLessons = [
  // adv-projects
  {
    id: 'adv-snake', module: 'adv-projects', order: 1, kind: 'project', template: 'react',
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
