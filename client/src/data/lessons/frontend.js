// Frontend track lessons. kind: component | utility | quiz | concept | project.

// ---------- fe-foundations ----------
// Structure is locked (read-only) — the learner edits only styles.css. See `lockedFiles` below.
const boxModelHtml = `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="box">Resize me by editing styles.css → width, padding, border, box-sizing.</div>
    <p>content-box: total width = width + padding + border. border-box: width IS the total.</p>
  </body>
</html>
`
const boxModelCss = `body { font-family: system-ui; padding: 24px; background: #f6f6f9; }

.box {
  /* Try changing these and watch the total size. */
  width: 200px;
  padding: 20px;
  border: 4px solid #6366f1;
  margin: 16px;
  background: #fff;

  /* box-sizing decides whether width includes padding + border. */
  box-sizing: content-box; /* try: border-box */
}
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

// ---------- fe-js-core (added: throttle, curry, deepClone, flatten, memoize) ----------
const throttleStarter = `// throttle(fn, wait): allow fn at most once per \\\`wait\\\` ms (leading edge).
function throttle(fn, wait) {
  let blocked = false;
  return function (...args) {
    if (blocked) return;
    fn.apply(this, args);            // fire immediately (leading edge)
    blocked = true;
    setTimeout(() => { blocked = false; }, wait); // unblock after the window
  };
}

const onScroll = throttle((y) => console.log("handle scroll at", y), 200);
[0, 30, 60, 90, 250, 300].forEach((y, i) => setTimeout(() => onScroll(y), i * 60));
// Fires ~once per 200ms window no matter how often it's called.
`

const curryStarter = `// curry(fn): call fn one (or several) args at a time until it has enough.
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args); // enough args -> run
    return (...more) => curried.apply(this, args.concat(more)); // otherwise collect more
  };
}

const add = (a, b, c) => a + b + c;
const cadd = curry(add);
console.log(cadd(1)(2)(3)); // 6
console.log(cadd(1, 2)(3)); // 6
console.log(cadd(1)(2, 3)); // 6
`

const deepCloneStarter = `// deepClone(value): a recursive copy with no shared references. Handles circular refs.
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value; // primitives copy by value
  if (seen.has(value)) return seen.get(value);                   // circular reference guard
  if (value instanceof Date) return new Date(value);
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}

const original = { a: 1, nested: { b: 2 }, list: [1, 2, 3] };
const clone = deepClone(original);
clone.nested.b = 99;
console.log(original.nested.b, clone.nested.b); // 2 99 — fully independent
`

const flattenStarter = `// flatten(arr): turn a nested array into a single flat array (any depth).
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}

console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
`

const memoizeStarter = `// memoize(fn): cache results by arguments so repeat calls are instant.
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args); // simple key; fine for JSON-serializable args
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

let calls = 0;
const slowSquare = (n) => { calls++; return n * n; };
const fast = memoize(slowSquare);
console.log(fast(5), fast(5), fast(6)); // 25 25 36
console.log("actual computations:", calls); // 2 — the second fast(5) was cached
`

// ---------- fe-ui (added: Todo List, Star Rating, Signup Form, Carousel, Stopwatch) ----------
const todoStarter = `import { useState } from "react";
import "./styles.css";

export default function TodoList() {
  const [items, setItems] = useState([{ id: 1, text: "Learn closures", done: false }]);
  const [text, setText] = useState("");

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;                 // ignore empty input
    setItems([...items, { id: Date.now(), text: t, done: false }]); // new array, not push
    setText("");
  };
  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="todo">
      <h3>Todos</h3>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" />
        <button>Add</button>
      </form>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={i.done ? "done" : ""}>
            <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} />
            <span>{i.text}</span>
            <button className="x" onClick={() => remove(i.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p className="count">{items.filter((i) => !i.done).length} left</p>
    </div>
  );
}
`
const todoCss = `body{font-family:system-ui;padding:16px}
.todo{max-width:420px;margin:0 auto}
form{display:flex;gap:8px;margin-bottom:12px}
input[type=text],form input{flex:1;padding:8px;border:1px solid #d1d5db;border-radius:8px}
button{border:0;border-radius:8px;padding:8px 12px;background:#6366f1;color:#fff;cursor:pointer}
ul{list-style:none;padding:0;margin:0;display:grid;gap:6px}
li{display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #eee;border-radius:8px}
li span{flex:1}
li.done span{text-decoration:line-through;color:#9ca3af}
.x{background:#f3f4f6;color:#6b7280}
.count{color:#6b7280;font-size:13px;margin-top:10px}
`

const starRatingStarter = `import { useState } from "react";

export default function StarRating({ max = 5 }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); // preview on hover

  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: 24 }}>
      <h3>Rate it</h3>
      <div style={{ fontSize: 40, cursor: "pointer" }} onMouseLeave={() => setHover(0)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            style={{ color: n <= (hover || rating) ? "#f59e0b" : "#d1d5db" }}
          >
            ★
          </span>
        ))}
      </div>
      <p>{rating ? "You rated " + rating + "/" + max : "Hover and click a star"}</p>
    </div>
  );
}
`

const signupStarter = `import { useState } from "react";

// Controlled form + validation. The inputs' values live in React state (single source of truth).
export default function SignupForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!/^[^@]+@[^@]+\\.[^@]+$/.test(f.email)) e.email = "Enter a valid email";
    if (f.password.length < 8) e.password = "Password must be 8+ characters";
    return e;
  };
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setOk(Object.keys(errs).length === 0);
  };

  const box = { fontFamily: "system-ui", maxWidth: 320, margin: "24px auto", display: "grid", gap: 8 };
  return (
    <form style={box} onSubmit={onSubmit} noValidate>
      <h3>Sign up</h3>
      <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
      {errors.email && <small style={{ color: "#ef4444" }}>{errors.email}</small>}
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
      {errors.password && <small style={{ color: "#ef4444" }}>{errors.password}</small>}
      <button style={{ padding: 8, border: 0, borderRadius: 8, background: "#6366f1", color: "#fff" }}>
        Create account
      </button>
      {ok && <small style={{ color: "#10b981" }}>✓ Looks good!</small>}
    </form>
  );
}
`

const carouselStarter = `import { useState } from "react";

const SLIDES = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function Carousel() {
  const [i, setI] = useState(0);
  const go = (dir) => setI((i + dir + SLIDES.length) % SLIDES.length); // wrap around both ends

  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: 16 }}>
      <div style={{ height: 180, borderRadius: 12, background: SLIDES[i], display: "grid",
        placeItems: "center", color: "#fff", fontSize: 24 }}>
        Slide {i + 1}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => go(-1)}>‹ Prev</button>
        <span style={{ margin: "0 12px" }}>
          {SLIDES.map((_, n) => (
            <span key={n} onClick={() => setI(n)}
              style={{ cursor: "pointer", margin: 3, fontSize: 18, color: n === i ? "#111" : "#cbd5e1" }}>
              ●
            </span>
          ))}
        </span>
        <button onClick={() => go(1)}>Next ›</button>
      </div>
    </div>
  );
}
`

const stopwatchStarter = `import { useState, useRef } from "react";

export default function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null); // interval id kept in a ref (survives re-renders)

  const start = () => {
    if (running) return;
    setRunning(true);
    const startedAt = Date.now() - ms;                       // resume from current time
    timer.current = setInterval(() => setMs(Date.now() - startedAt), 50);
  };
  const stop = () => { setRunning(false); clearInterval(timer.current); };
  const reset = () => { stop(); setMs(0); };

  const pad = (n) => String(n).padStart(2, "0");
  const secs = Math.floor(ms / 1000);
  const cs = Math.floor((ms % 1000) / 10);

  return (
    <div style={{ fontFamily: "system-ui", textAlign: "center", padding: 24 }}>
      <h1 style={{ fontVariantNumeric: "tabular-nums" }}>
        {pad(Math.floor(secs / 60))}:{pad(secs % 60)}.{pad(cs)}
      </h1>
      <button onClick={start}>Start</button>
      <button onClick={stop} style={{ margin: "0 8px" }}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
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
    starterCode: { '/index.html': boxModelHtml, '/styles.css': boxModelCss },
    lockedFiles: ['/index.html'], // structure is fixed — only the CSS is editable
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

  // ---- JS utilities (fe-js-core) ----
  {
    id: 'fe-throttle', module: 'fe-js-core', order: 5, kind: 'utility', template: 'vanilla',
    title: 'throttle', difficulty: 'medium', tags: ['javascript', 'timers'],
    summary: 'Rate-limit a function to once per interval. The scroll/resize counterpart to debounce.',
    prompt: `Implement **\`throttle(fn, wait)\`**: allow \`fn\` to run at most **once per \`wait\` ms**, even if called continuously. Watch the console — a burst of calls fires only about once per window.`,
    keyTerms: [
      { term: 'throttle', def: 'Guarantees at most one call per N ms during a burst (rate limiting). Good for scroll/resize/mousemove.' },
      { term: 'debounce vs throttle', def: 'Debounce waits for a pause then fires once; throttle fires steadily at a capped rate.' },
      { term: 'Leading vs trailing', def: 'Leading fires immediately then blocks; trailing fires at the end of the window. This one is leading.' },
    ],
    starterCode: { '/index.js': throttleStarter },
    explanation: `Interviewers pair this with **debounce** and ask when to use each: a search box → debounce (act on the pause); a scroll handler → throttle (act at a steady rate). Common follow-ups: add a **trailing** call so the final event isn't dropped, and a \`.cancel()\`. Both rely on a **closure** over the timer/blocked flag.`,
  },
  {
    id: 'fe-curry', module: 'fe-js-core', order: 6, kind: 'utility', template: 'vanilla',
    title: 'curry', difficulty: 'medium', tags: ['javascript', 'functions'],
    summary: 'Transform f(a,b,c) into f(a)(b)(c) — partial application.',
    prompt: `Implement **\`curry(fn)\`** so \`fn\` can be called one argument (or several) at a time until it has enough, then it runs. Support \`cadd(1)(2)(3)\`, \`cadd(1,2)(3)\`, and \`cadd(1)(2,3)\`.`,
    keyTerms: [
      { term: 'Currying', def: 'Turning an N-arg function into a chain of unary/partial calls that collect args until N is reached.' },
      { term: 'Partial application', def: 'Fixing some arguments now and supplying the rest later.' },
      { term: 'fn.length (arity)', def: 'The number of declared parameters — used to know when enough args have arrived.' },
    ],
    starterCode: { '/index.js': curryStarter },
    explanation: `The trick is the recursive \`curried\`: if we have \`>= fn.length\` args, call \`fn\`; otherwise return a function that concatenates more args and recurses. Probes: relies on **closures** and \`fn.length\`; a follow-up is **infinite/variadic currying** where you call the result to get the value (no fixed arity).`,
  },
  {
    id: 'fe-deep-clone', module: 'fe-js-core', order: 7, kind: 'utility', template: 'vanilla',
    title: 'deepClone', difficulty: 'hard', tags: ['javascript', 'recursion'],
    summary: 'A true copy with no shared references — including circular ones.',
    prompt: `Implement **\`deepClone(value)\`**: recursively copy objects and arrays so mutating the clone never affects the original. Handle **circular references** (an object that points to itself).`,
    keyTerms: [
      { term: 'Shallow vs deep copy', def: 'Shallow ({...obj}) shares nested references; deep copies every level so nothing is shared.' },
      { term: 'Circular reference', def: 'An object reachable from itself. A naive recursive clone infinite-loops; a WeakMap of seen objects fixes it.' },
      { term: 'WeakMap', def: 'A map keyed by objects that does not prevent garbage collection — ideal for the "seen" cache.' },
    ],
    starterCode: { '/index.js': deepCloneStarter },
    explanation: `\`structuredClone()\` now does this natively, but interviewers want the algorithm: recurse over keys, and track already-cloned objects in a **WeakMap** to break cycles and preserve shared identity. Follow-ups: handle \`Date\`, \`Map\`, \`Set\`, and \`RegExp\` (not just plain objects/arrays).`,
  },
  {
    id: 'fe-flatten', module: 'fe-js-core', order: 8, kind: 'utility', template: 'vanilla',
    title: 'flatten', difficulty: 'easy', tags: ['javascript', 'recursion', 'arrays'],
    summary: 'Collapse a deeply nested array into one flat list.',
    prompt: `Implement **\`flatten(arr)\`** that flattens an array of arbitrary depth: \`[1,[2,[3,[4]],5]] → [1,2,3,4,5]\`.`,
    keyTerms: [
      { term: 'Recursion', def: 'A function that calls itself on a smaller sub-problem (each nested array) until a base case.' },
      { term: 'reduce', def: 'Folds an array into a single accumulator — here, concatenating flattened items.' },
      { term: 'Array.isArray', def: 'The reliable check for "is this an array?" used to decide whether to recurse.' },
    ],
    starterCode: { '/index.js': flattenStarter },
    explanation: `\`Array.prototype.flat(Infinity)\` does this natively; the interview wants the recursion. Follow-ups: an **iterative** version using a stack (avoids call-stack limits on very deep input), and a depth-limited \`flatten(arr, depth)\`.`,
  },
  {
    id: 'fe-memoize', module: 'fe-js-core', order: 9, kind: 'utility', template: 'vanilla',
    title: 'memoize', difficulty: 'medium', tags: ['javascript', 'performance'],
    summary: 'Cache a function’s results by its arguments.',
    prompt: `Implement **\`memoize(fn)\`**: cache results keyed by arguments so repeated calls with the same input skip the work. The demo shows only 2 real computations for 3 calls.`,
    keyTerms: [
      { term: 'Memoization', def: 'Caching a pure function’s output per input so repeats are O(1) lookups.' },
      { term: 'Cache key', def: 'A stable representation of the args (here JSON.stringify) used to look up the cache.' },
      { term: 'Pure function', def: 'Same input → same output, no side effects — a prerequisite for safe memoization.' },
    ],
    starterCode: { '/index.js': memoizeStarter },
    explanation: `Key choices interviewers probe: the **cache key** strategy (\`JSON.stringify\` is simple but fails on functions/undefined/key order; a nested \`Map\` or \`WeakMap\` handles object args better), and that memoization is only safe for **pure** functions. This is the same idea behind React’s \`useMemo\`/\`memo\`.`,
  },

  // ---- UI components (fe-ui) ----
  {
    id: 'fe-todo-list', module: 'fe-ui', order: 4, kind: 'component', template: 'react',
    title: 'Todo List', difficulty: 'easy', tags: ['react', 'state', 'lists'],
    summary: 'Add, toggle, and delete items — the canonical state + list-rendering warm-up.',
    prompt: `Build a **todo list**: an input adds items; each item can be **toggled** done and **deleted**; show a "N left" count. Keep the input a controlled component and never mutate state in place.`,
    keyTerms: [
      { term: 'Controlled input', def: 'An input whose value comes from state and updates via onChange — React is the single source of truth.' },
      { term: 'Immutable update', def: 'Produce a NEW array/object (spread, map, filter) instead of mutating — so React detects the change.' },
      { term: 'key prop', def: 'A stable unique id per list item so React can efficiently reconcile the list.' },
    ],
    starterCode: { '/App.js': todoStarter, '/styles.css': todoCss },
    explanation: `The must-nots: don’t \`push\` into state (use \`[...items, new]\`); don’t use the array **index as \`key\`** if items reorder/delete (use a stable id). Derive the "N left" **count from state** rather than storing it separately. Follow-ups: edit-in-place, filter (all/active/done), and persistence.`,
  },
  {
    id: 'fe-star-rating', module: 'fe-ui', order: 5, kind: 'component', template: 'react',
    title: 'Star Rating', difficulty: 'easy', tags: ['react', 'state', 'events'],
    summary: 'Hover preview + click to set — two pieces of state working together.',
    prompt: `Build a **star rating**: hovering previews the rating; clicking commits it; moving the mouse away shows the committed value. Make the number of stars a \`max\` prop.`,
    keyTerms: [
      { term: 'Derived display', def: 'Stars fill based on (hover || rating) — hover wins while hovering, else the committed rating shows.' },
      { term: 'Controlled by props', def: 'max drives how many stars render; the component is reusable for any scale.' },
      { term: 'onMouseEnter/Leave', def: 'Pointer events that drive the hover-preview state.' },
    ],
    starterCode: { '/App.js': starRatingStarter },
    explanation: `The elegant bit is \`n <= (hover || rating)\` — one expression handling both preview and committed states. Interview follow-ups: **keyboard accessibility** (arrow keys, \`role="radiogroup"\`), **half-stars**, and a read-only display mode.`,
  },
  {
    id: 'fe-signup-form', module: 'fe-ui', order: 6, kind: 'component', template: 'react',
    title: 'Signup Form (validation)', difficulty: 'medium', tags: ['react', 'forms', 'validation'],
    summary: 'Controlled inputs, a validation function, and inline error messages.',
    prompt: `Build a **signup form** with email + password. On submit, validate (valid email, password ≥ 8 chars), show **inline errors**, and a success message when clean. Use one \`onChange\` for all fields.`,
    keyTerms: [
      { term: 'Single change handler', def: 'One onChange keyed by input `name` updates the matching field: {...form, [name]: value}.' },
      { term: 'Validation function', def: 'A pure function (values) → errors object; keeps rules in one testable place.' },
      { term: 'Controlled vs uncontrolled', def: 'Controlled = value in React state (this). Uncontrolled = read from the DOM via a ref on submit.' },
    ],
    starterCode: { '/App.js': signupStarter },
    explanation: `Interviewers look for: a **single generic \`onChange\`** (not one per field), validation as a **pure function** returning an errors map, and \`noValidate\` so you control the UX. Follow-ups: validate on **blur** vs submit, disable the button while submitting, and async (server) validation.`,
  },
  {
    id: 'fe-carousel', module: 'fe-ui', order: 7, kind: 'component', template: 'react',
    title: 'Image Carousel', difficulty: 'medium', tags: ['react', 'state'],
    summary: 'Prev/next with wrap-around and clickable dots.',
    prompt: `Build a **carousel**: Prev/Next cycle through slides and **wrap around** at both ends; dots jump to a slide and highlight the active one.`,
    keyTerms: [
      { term: 'Modulo wrap', def: '(i + dir + n) % n keeps the index in range and wraps past either end (handles the negative case).' },
      { term: 'Single index state', def: 'One `activeIndex` drives the visible slide and the active dot — no duplicated state.' },
    ],
    starterCode: { '/App.js': carouselStarter },
    explanation: `The trick is \`(i + dir + n) % n\` — adding \`n\` before the modulo handles going **backwards** from 0. Everything derives from one index. Follow-ups: **autoplay** with \`useEffect\` + \`setInterval\` (and cleanup), swipe/touch, lazy-loading images, and keyboard arrows.`,
  },
  {
    id: 'fe-stopwatch', module: 'fe-ui', order: 8, kind: 'component', template: 'react',
    title: 'Stopwatch', difficulty: 'medium', tags: ['react', 'timers', 'refs'],
    summary: 'Start/stop/reset with an interval kept in a ref — accurate timing.',
    prompt: `Build a **stopwatch**: Start/Stop/Reset showing mm:ss.cc. Keep the interval id in a **ref**, and compute elapsed time from a start timestamp (not by counting ticks).`,
    keyTerms: [
      { term: 'Ref for the interval id', def: 'setInterval’s id lives in a useRef so it persists across renders and can be cleared.' },
      { term: 'Timestamp-based timing', def: 'Compute elapsed = Date.now() - startedAt each tick — accurate even if ticks are delayed (never drifts like a counter).' },
      { term: 'Cleanup', def: 'Clear the interval on stop/reset (and on unmount) to avoid leaks.' },
    ],
    starterCode: { '/App.js': stopwatchStarter },
    explanation: `Why timestamp math: intervals aren’t exact, so **counting ticks drifts**. Reading \`Date.now() - startedAt\` stays accurate. \`startedAt = Date.now() - ms\` lets Start **resume** from the paused time. In a fuller version, clear the interval in a \`useEffect\` cleanup so it’s torn down on unmount too.`,
  },
]
