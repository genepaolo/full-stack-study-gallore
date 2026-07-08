// Frontend track lessons. kind: component | utility | quiz | concept | project.

// ---------- fe-foundations ----------
const boxModelHtml = `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: system-ui; padding: 24px; background: #f6f6f9; }
      .box {
        /* Try changing these and watch the total size. */
        width: 200px;
        padding: 20px;
        border: 4px solid #6366f1;
        margin: 16px;
        background: #fff;

        /* box-sizing decides whether width includes padding+border. */
        box-sizing: content-box; /* try: border-box */
      }
    </style>
  </head>
  <body>
    <div class="box">Resize me by editing width, padding, border, box-sizing.</div>
    <p>content-box: total width = width + padding + border. border-box: width IS the total.</p>
  </body>
</html>
`

// ---------- fe-css-layout (Center + Flexbox/Grid) ----------
const centerStarter = `<!doctype html>
<html>
  <head>
    <style>
      body { margin: 0; font-family: system-ui; }
      .stage {
        height: 100vh;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        /* Three lines centre anything. Try swapping for grid + place-items. */
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .box { padding: 24px 32px; background:#fff; border-radius:14px;
        box-shadow:0 10px 30px rgba(0,0,0,.25); font-weight:600; color:#4338ca; }
    </style>
  </head>
  <body><div class="stage"><div class="box">Perfectly centered ✨</div></div></body>
</html>
`
const centerSolution = centerStarter.replace(
  `        display: flex;
        align-items: center;
        justify-content: center;`,
  `        display: grid;
        place-items: center; /* one line, both axes */`,
)

const flexGridHtml = `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: system-ui; padding: 16px; background:#f6f6f9; }
      h3 { margin: 8px 0; }
      .row { display: flex; gap: 8px; margin-bottom: 20px; }
      .row .item { flex: 1; }               /* flex: grow to fill the row */
      .grid { display: grid; gap: 8px; grid-template-columns: repeat(3, 1fr); }
      .item { background: #6366f1; color:#fff; padding:16px; border-radius:8px; text-align:center; }
    </style>
  </head>
  <body>
    <h3>Flexbox — one dimension (a row)</h3>
    <div class="row"><div class="item">1</div><div class="item">2</div><div class="item">3</div></div>
    <h3>Grid — two dimensions (rows &amp; columns)</h3>
    <div class="grid"><div class="item">1</div><div class="item">2</div><div class="item">3</div><div class="item">4</div><div class="item">5</div><div class="item">6</div></div>
  </body>
</html>
`

// ---------- fe-js-core (closures, this, debounce, promises) ----------
const closureStarter = `// A closure = a function + the variables it "remembers" from where it was created.
function makeCounter() {
  let count = 0;                 // private state
  return function () {
    count += 1;                  // still reachable after makeCounter returns
    return count;
  };
}

const next = makeCounter();
console.log(next(), next(), next()); // 1 2 3

// Each counter keeps its OWN count. Try making a second one:
const other = makeCounter();
console.log(other()); // 1, not 4
`

const debounceStarter = `// debounce(fn, wait): delay calling fn until \\\`wait\\\` ms after the LAST call.
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

const search = debounce((q) => console.log("🔎 search:", q), 300);
console.log("Typing 'react' fast...");
["r","re","rea","reac","react"].forEach((q,i) => setTimeout(() => search(q), i*80));
// Only the last call ('react') fires — rapid calls collapse into one.
`
const debounceSolution = debounceStarter.replace(
  'function debounce(fn, wait) {',
  'function debounce(fn, wait, { leading = false } = {}) {\n  // leading: fire on the FIRST call instead of the last',
)

const promiseStarter = `// Implement Promise.all: resolve when ALL resolve; reject on the FIRST rejection.
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;          // keep original order
        done += 1;
        if (done === promises.length) resolve(results);
      }, reject);                  // any rejection rejects the whole thing
    });
  });
}

const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
promiseAll([wait(100, "a"), wait(50, "b"), wait(10, "c")])
  .then((r) => console.log("all done, in order:", r)); // ["a","b","c"]
`

// ---------- fe-react (useState, useEffect) ----------
const useStateStarter = `import { useState } from "react";

export default function Counter() {
  // useState returns [value, setter]. Calling the setter re-renders.
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: 32 }}>
      <h1>{count}</h1>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>+</button>
      <p style={{ color: "#6b7280" }}>Edit the step, add a reset button — the preview updates live.</p>
    </div>
  );
}
`

const useEffectStarter = `import { useState, useEffect } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id); // cleanup runs on unmount / before re-run
  }, []); // [] = run once after mount
  return <h1 style={{ fontFamily: "system-ui", textAlign: "center" }}>🕐 {now}</h1>;
}
`

// ---------- fe-ui (accordion, tabs, modal) ----------
const accordionStarter = `import { useState } from "react";
import "./styles.css";
const ITEMS = [
  { q: "What is the DOM?", a: "The browser's tree representation of the page." },
  { q: "What is a closure?", a: "A function bundled with its surrounding state." },
  { q: "What is event delegation?", a: "Handling events at a parent via bubbling." },
];
export default function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {ITEMS.map((it, i) => (
        <div className="item" key={i}>
          <button className="header" aria-expanded={i === open} onClick={() => setOpen(i === open ? -1 : i)}>
            <span>{it.q}</span><span className={"chev " + (i === open ? "open" : "")}>▶</span>
          </button>
          {i === open && <div className="panel">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}
`
const accordionCss = `body{font-family:system-ui;padding:16px}
.accordion{max-width:460px;margin:0 auto;border:1px solid #e3e3e8;border-radius:10px;overflow:hidden}
.item+.item{border-top:1px solid #e3e3e8}
.header{width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#fff;border:0;font-size:15px;font-weight:600;cursor:pointer}
.header:hover{background:#f6f6f9}
.chev{transition:transform .2s;color:#6366f1}.chev.open{transform:rotate(90deg)}
.panel{padding:0 16px 14px;color:#4b5563;font-size:14px}
`

const tabsStarter = `import { useState } from "react";
import "./styles.css";
const TABS = [
  { label: "Profile", body: "Your name, bio and avatar." },
  { label: "Settings", body: "Theme, notifications, privacy." },
  { label: "Billing", body: "Plan, invoices, payment method." },
];
export default function Tabs() {
  const [active, setActive] = useState(0);
  return (
    <div className="tabs">
      <div className="tablist" role="tablist">
        {TABS.map((t, i) => (
          <button key={i} role="tab" aria-selected={i === active}
            className={"tab " + (i === active ? "active" : "")} onClick={() => setActive(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel" role="tabpanel">{TABS[active].body}</div>
    </div>
  );
}
`
const tabsCss = `body{font-family:system-ui;padding:16px}
.tabs{max-width:460px;margin:0 auto}
.tablist{display:flex;gap:4px;border-bottom:2px solid #e3e3e8}
.tab{border:0;background:none;padding:10px 14px;font-size:14px;font-weight:600;color:#6b7280;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px}
.tab.active{color:#4338ca;border-bottom-color:#6366f1}
.panel{padding:16px 4px;color:#4b5563;font-size:14px}
`

const modalStarter = `import { useState } from "react";
import "./styles.css";
export default function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="wrap">
      <button className="btn" onClick={() => setOpen(true)}>Open modal</button>
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          {/* stopPropagation so clicks inside don't close it */}
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Delete item?</h3>
            <p>This action cannot be undone.</p>
            <div className="actions">
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn danger" onClick={() => setOpen(false)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`
const modalCss = `body{font-family:system-ui;padding:16px}
.wrap{display:flex;justify-content:center;padding:24px}
.btn{border:0;border-radius:8px;padding:8px 14px;font-weight:600;cursor:pointer;background:#6366f1;color:#fff}
.btn.ghost{background:#eef;color:#4338ca}.btn.danger{background:#ef4444}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center}
.modal{background:#fff;border-radius:14px;padding:24px;max-width:320px;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
`

export const frontendLessons = [
  // fe-foundations
  {
    id: 'fe-semantic-html', module: 'fe-foundations', order: 1, kind: 'concept',
    title: 'Semantic HTML', difficulty: 'easy', tags: ['html', 'a11y'],
    summary: 'Use the right element for the job — the foundation of accessible, maintainable pages.',
    prompt: `**Semantic HTML** means choosing elements for their *meaning*, not their looks: \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<button>\`, \`<label>\` — instead of a pile of \`<div>\`s.`,
    keyTerms: [
      { term: 'Semantic element', def: 'An HTML tag whose name describes its role (e.g. <nav>, <article>), not its styling.' },
      { term: 'Accessibility (a11y)', def: 'Designing so people using screen readers, keyboards, etc. can use your site. Semantic tags give assistive tech meaning for free.' },
      { term: 'Landmark', def: 'A region screen readers can jump to: <header>, <nav>, <main>, <footer>.' },
    ],
    explanation: `**Why interviewers care**

- **Accessibility for free** — a real \`<button>\` is focusable and keyboard-activatable; a clickable \`<div>\` is not (you'd re-implement \`role\`, \`tabindex\`, and key handlers).
- **SEO & structure** — search engines and assistive tech read landmarks (\`<main>\`, \`<nav>\`) to understand the page.
- **Less CSS/JS** — \`<details>/<summary>\` gives you a disclosure with zero JavaScript.

**Rule of thumb:** reach for a \`<div>\`/\`<span>\` only when no semantic element fits.`,
  },
  {
    id: 'fe-box-model', module: 'fe-foundations', order: 2, kind: 'concept', template: 'static',
    title: 'The CSS Box Model', difficulty: 'easy', tags: ['css'],
    summary: 'Every element is a box: content, padding, border, margin. Know how sizes add up.',
    prompt: `Every element is a **box** made of four layers: **content → padding → border → margin**. Edit the values and toggle \`box-sizing\` to see how the total size changes.`,
    keyTerms: [
      { term: 'Padding', def: 'Space INSIDE the border, between content and edge. Adds to size in content-box.' },
      { term: 'Margin', def: 'Space OUTSIDE the border, separating this box from others. Never part of the box size.' },
      { term: 'box-sizing', def: 'content-box (default): width = content only. border-box: width includes padding + border — usually what you want.' },
    ],
    starterCode: { '/index.html': boxModelHtml },
    explanation: `Most codebases set \`* { box-sizing: border-box; }\` globally so that setting \`width: 200px\` means the box is actually 200px wide — padding and border don't push it larger. Margins also **collapse** vertically between siblings (the larger of the two wins), a classic gotcha.`,
  },

  // fe-css-layout
  {
    id: 'fe-center-a-div', module: 'fe-css-layout', order: 1, kind: 'component', template: 'static',
    title: 'Center a div', difficulty: 'easy', tags: ['css', 'flexbox', 'grid'],
    summary: 'The eternal question. Know the flexbox and grid one-liners cold.',
    prompt: `Center a box horizontally **and** vertically. The starter uses flexbox — try the grid \`place-items: center\` one-liner (see the solution), or break it and watch what happens.`,
    keyTerms: [
      { term: 'Main axis / cross axis', def: 'In flexbox, the main axis is the flex-direction (row by default); the cross axis is perpendicular. justify-content works on the main axis, align-items on the cross.' },
      { term: 'place-items', def: 'Grid shorthand for align-items + justify-items. place-items: center centers on both axes in one line.' },
    ],
    starterCode: { '/index.html': centerStarter },
    solutionCode: { '/index.html': centerSolution },
    explanation: `Know all three approaches: **flexbox** (\`align-items\` + \`justify-content\`), **grid** (\`place-items: center\`), and **absolute** (\`inset:0; margin:auto\` or the \`top/left:50% + translate(-50%,-50%)\` trick). Be ready to explain why \`margin:auto\` centers horizontally but not vertically in normal flow.`,
  },
  {
    id: 'fe-flexbox-vs-grid', module: 'fe-css-layout', order: 2, kind: 'concept', template: 'static',
    title: 'Flexbox vs Grid', difficulty: 'medium', tags: ['css', 'layout'],
    summary: 'One dimension vs two. Pick the right tool and stop fighting your layout.',
    prompt: `**Flexbox** lays out items along **one** axis (a row *or* a column). **Grid** lays out in **two** axes (rows *and* columns) at once. Edit both examples live.`,
    keyTerms: [
      { term: 'flex: 1', def: 'Shorthand for flex-grow:1 — the item grows to share leftover space equally with siblings.' },
      { term: 'fr unit', def: 'A grid "fraction" of leftover space. repeat(3, 1fr) makes three equal columns.' },
      { term: 'gap', def: 'Spacing between flex/grid items — replaces margin hacks.' },
    ],
    starterCode: { '/index.html': flexGridHtml },
    explanation: `**Decision rule:** content flowing in a line (nav bar, toolbar, tag list) → **flexbox**. A true 2D layout (page shell, card gallery, dashboard) → **grid**. They compose: a grid of cards where each card uses flexbox inside.`,
  },

  // fe-js-core
  {
    id: 'fe-closures', module: 'fe-js-core', order: 1, kind: 'utility', template: 'vanilla',
    title: 'Closures & Scope', difficulty: 'medium', tags: ['javascript', 'closures'],
    summary: 'Functions remember where they were born. The idea behind hooks, modules, and privacy.',
    prompt: `A **closure** is a function together with the variables it captured from its birthplace. Run it, then make a second counter and confirm each keeps its own private \`count\`.`,
    keyTerms: [
      { term: 'Closure', def: 'A function that retains access to variables from the scope where it was defined, even after that scope has returned.' },
      { term: 'Lexical scope', def: 'Scope determined by where code is written (nesting), not where it is called.' },
      { term: 'Private state', def: 'Variables reachable only through the closure — the basis of the module pattern and React hooks.' },
    ],
    starterCode: { '/index.js': closureStarter },
    explanation: `Closures power **hooks** (\`useState\` keeps state in a closure), the **module pattern** (private variables), \`debounce\`/\`throttle\` (a captured \`timer\`), and event handlers. Classic gotcha: a \`var\` inside a loop shares one binding — use \`let\` (a fresh binding per iteration) to capture the loop value correctly.`,
  },
  {
    id: 'fe-this-binding', module: 'fe-js-core', order: 2, kind: 'quiz',
    title: "What does `this` refer to?", difficulty: 'medium', tags: ['javascript', 'this'],
    summary: 'The four rules of `this` binding — a guaranteed interview question.',
    prompt: `What does \`this\` evaluate to in each case?

\`\`\`js
const obj = {
  name: "gallore",
  regular() { return this.name; },
  arrow: () => this.name,
};
obj.regular();               // ?
obj.arrow();                 // ?
const f = obj.regular; f();  // ?
\`\`\``,
    keyTerms: [
      { term: 'Implicit binding', def: 'When you call obj.method(), this is the object left of the dot.' },
      { term: 'Lost this', def: 'Detaching a method (const f = obj.method) loses the receiver, so this becomes undefined/global.' },
      { term: 'Lexical this', def: 'Arrow functions have no own this; they use the enclosing scope’s this.' },
    ],
    explanation: `- \`obj.regular()\` → **"gallore"** (implicit binding — object before the dot).
- \`obj.arrow()\` → **undefined** — arrows capture the *module’s* \`this\`, not \`obj\`.
- \`f()\` → **undefined** in strict mode — the receiver was lost when detached.

**The four rules (precedence):** 1) \`new\`, 2) explicit (\`call\`/\`apply\`/\`bind\`), 3) implicit (dot), 4) default (undefined/global). Arrows ignore all four and use lexical \`this\`.`,
  },
  {
    id: 'fe-debounce', module: 'fe-js-core', order: 3, kind: 'utility', template: 'vanilla',
    title: 'debounce', difficulty: 'medium', tags: ['javascript', 'timers'],
    summary: 'Collapse rapid calls into one. The most-asked JS utility.',
    prompt: `Implement **\`debounce(fn, wait)\`**: return a function that postpones \`fn\` until \`wait\` ms after the **last** call. Watch five rapid calls collapse into one. Bonus: add a \`leading\` option (see solution).`,
    keyTerms: [
      { term: 'debounce', def: 'Wait for a pause: only fire after calls stop for N ms. Great for search inputs.' },
      { term: 'throttle', def: 'Rate-limit: fire at most once per N ms during a burst. Great for scroll/resize.' },
      { term: 'Trailing / leading edge', def: 'Trailing = fire after the pause (default). Leading = fire on the first call.' },
    ],
    starterCode: { '/index.js': debounceStarter },
    solutionCode: { '/index.js': debounceSolution },
    explanation: `Keys: a **closure** over \`timer\`, \`clearTimeout\` on every call (that’s what collapses the burst), and \`fn.apply(this, args)\` so the wrapper is transparent. Know the difference from **throttle** and when to use each — it’s the standard follow-up.`,
  },
  {
    id: 'fe-promise-all', module: 'fe-js-core', order: 4, kind: 'utility', template: 'vanilla',
    title: 'Promise.all', difficulty: 'hard', tags: ['javascript', 'async'],
    summary: 'Run promises in parallel; resolve when all finish, reject on the first failure.',
    prompt: `Implement **\`promiseAll(promises)\`**: resolve with results **in original order** once all resolve; reject as soon as any one rejects.`,
    keyTerms: [
      { term: 'Promise', def: 'An object representing a future value: pending → fulfilled or rejected.' },
      { term: 'Parallel vs sequential', def: 'Promise.all starts everything at once (parallel). Awaiting in a loop runs one-at-a-time (sequential, slower).' },
      { term: 'Fail-fast', def: 'Promise.all rejects on the FIRST rejection. Use Promise.allSettled to wait for all outcomes.' },
    ],
    starterCode: { '/index.js': promiseStarter },
    explanation: `Preserve order by writing to \`results[i]\` (not \`push\`, which depends on finish time). Count completions to know when you’re done. Interviewers often follow with **\`allSettled\`** (never rejects), **\`race\`** (first to settle), or adding **concurrency limits**.`,
  },

  // fe-react
  {
    id: 'fe-usestate', module: 'fe-react', order: 1, kind: 'component', template: 'react',
    title: 'useState & re-rendering', difficulty: 'easy', tags: ['react', 'state'],
    summary: 'State is memory that triggers a re-render. The heart of React.',
    prompt: `\`useState\` gives a component **memory**. Calling the setter schedules a **re-render** with the new value. Edit the counter — change the step, add a Reset button.`,
    keyTerms: [
      { term: 'State', def: 'Data a component remembers between renders. Changing it re-renders the component.' },
      { term: 'Re-render', def: 'React re-runs the component function to compute the new UI, then updates the DOM efficiently.' },
      { term: 'Immutability', def: 'Never mutate state directly — create a new value (setCount(count+1)) so React detects the change.' },
    ],
    starterCode: { '/App.js': useStateStarter },
    explanation: `State updates are **asynchronous and batched** — reading \`count\` right after \`setCount\` still shows the old value. For updates based on the previous value, use the functional form: \`setCount(c => c + 1)\`. Never mutate arrays/objects in place; spread into a new one.`,
  },
  {
    id: 'fe-useeffect', module: 'fe-react', order: 2, kind: 'component', template: 'react',
    title: 'useEffect & side effects', difficulty: 'medium', tags: ['react', 'effects'],
    summary: 'Sync with the outside world — timers, subscriptions, fetches — and clean up.',
    prompt: `\`useEffect\` runs code **after render** to sync with things outside React (timers, the network, subscriptions). The returned function **cleans up**. Edit the interval.`,
    keyTerms: [
      { term: 'Side effect', def: 'Anything that reaches outside rendering: fetch, timers, DOM, subscriptions.' },
      { term: 'Dependency array', def: 'The [] you pass. [] = run once. [x] = re-run when x changes. Omitted = every render.' },
      { term: 'Cleanup function', def: 'The function you return from the effect. Runs before the next effect and on unmount — prevents leaks.' },
    ],
    starterCode: { '/App.js': useEffectStarter },
    explanation: `Forgetting cleanup (here \`clearInterval\`) leaks timers/listeners and causes bugs on re-render. Missing dependencies cause **stale closures** (reading old state). In dev, StrictMode intentionally runs effects twice to surface missing cleanup — that’s a feature, not a bug.`,
  },

  // fe-ui
  {
    id: 'fe-accordion', module: 'fe-ui', order: 1, kind: 'component', template: 'react',
    title: 'Accordion', difficulty: 'easy', tags: ['react', 'state', 'a11y'],
    summary: 'Collapsible panels. A state + accessibility warm-up.',
    prompt: `Build an **accordion**: clicking a header toggles its panel. Only one open at a time. Try switching to multi-open (track a \`Set\`). Set \`aria-expanded\` on each header.`,
    keyTerms: [
      { term: 'Controlled toggling', def: 'Clicking an open header should close it: open === i ? -1 : i.' },
      { term: 'aria-expanded', def: 'Tells assistive tech whether the panel is open. Essential for a disclosure widget.' },
    ],
    starterCode: { '/App.js': accordionStarter, '/styles.css': accordionCss },
    explanation: `Interviewers probe the **state model** (single \`openIndex\` vs a \`Set\` for multi-open), using a real \`<button>\` for keyboard access, and whether you conditionally render the panel (loses transitions) or animate height (keeps them).`,
  },
  {
    id: 'fe-tabs', module: 'fe-ui', order: 2, kind: 'component', template: 'react',
    title: 'Tabs', difficulty: 'easy', tags: ['react', 'a11y'],
    summary: 'Switch panels with a tablist. Roles and selection state.',
    prompt: `Build **tabs**: a \`tablist\` of buttons, one active at a time, showing the matching panel. Add the ARIA roles (\`tab\`, \`tablist\`, \`tabpanel\`) and \`aria-selected\`.`,
    keyTerms: [
      { term: 'Single source of truth', def: 'One activeIndex state drives which tab looks selected AND which panel shows.' },
      { term: 'ARIA roles', def: 'role="tablist" / "tab" / "tabpanel" + aria-selected make the widget understandable to screen readers.' },
    ],
    starterCode: { '/App.js': tabsStarter, '/styles.css': tabsCss },
    explanation: `The follow-up is usually **keyboard support**: arrow keys should move between tabs (roving \`tabindex\`), and Home/End jump to first/last. Derive everything from one \`activeIndex\` rather than storing "isActive" per tab.`,
  },
  {
    id: 'fe-modal', module: 'fe-ui', order: 3, kind: 'component', template: 'react',
    title: 'Modal / Dialog', difficulty: 'medium', tags: ['react', 'a11y'],
    summary: 'Overlay, backdrop-close, and the accessibility checklist.',
    prompt: `Build a **modal**: a button opens an overlay; clicking the backdrop closes it, clicking inside does not (\`stopPropagation\`). Mark it \`role="dialog" aria-modal="true"\`.`,
    keyTerms: [
      { term: 'Event bubbling', def: 'A click inside the modal bubbles to the overlay; stopPropagation prevents the backdrop-close from firing.' },
      { term: 'Focus trap', def: 'Keeping keyboard focus inside the open dialog so Tab cannot escape to the page behind.' },
      { term: 'Portal', def: 'Rendering the modal at the end of <body> (ReactDOM.createPortal) to escape parent overflow/z-index.' },
    ],
    starterCode: { '/App.js': modalStarter, '/styles.css': modalCss },
    explanation: `The real interview is the **a11y checklist**: close on \`Escape\`, trap focus while open, restore focus to the trigger on close, and render through a **portal**. Production code uses \`<dialog>\` or a library — but you must be able to explain each requirement.`,
  },
]
