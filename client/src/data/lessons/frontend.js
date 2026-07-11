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

      /* The classic "center a div". Four ways to center .box on BOTH axes.
         Approach 1 (flexbox) is active — uncomment another block to compare. */
      .stage {
        height: 100vh;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        position: relative; /* lets the absolute approaches (3 & 4) center against .stage */

        /* ── 1 · FLEXBOX (active) — the modern default, 3 lines ── */
        display: flex;
        justify-content: center; /* main axis  -> horizontal */
        align-items: center;     /* cross axis -> vertical   */

        /* ── 2 · GRID one-liner — replace the 3 flex lines above with these 2 ──
        display: grid;
        place-items: center; */
      }

      .box {
        padding: 24px 32px; background: #fff; border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,.25); font-weight: 600; color: #4338ca;

        /* ── 3 · ABSOLUTE + margin:auto — also delete flex/grid from .stage above ──
        position: absolute; inset: 0;             top/right/bottom/left all 0
        margin: auto;                             auto on all 4 sides = both axes
        width: max-content; height: max-content;  needs an intrinsic size to solve */

        /* ── 4 · ABSOLUTE + translate — best when the box's size is unknown ──
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);         pull back by half the box's OWN size */
      }
    </style>
  </head>
  <body><div class="stage"><div class="box">Perfectly centered ✨</div></div></body>
</html>
`

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

// ---------- fe-performance ----------
const virtualizationStarter = `// List virtualization ("windowing"): render only the rows visible in the viewport — not all 10,000.
// The whole trick is pure math: compute WHICH rows to render from the scroll position.

// Given the scroll position + sizes, return the [start, end) row range to actually render.
// 'overscan' renders a few extra above/below so a fast scroll does not flash blank.
function visibleRange(scrollTop, rowHeight, viewportHeight, total, overscan = 3) {
  const first = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const start = Math.max(0, first - overscan);
  const end = Math.min(total, first + visibleCount + overscan);
  return [start, end];
}

// The scrollbar must still reflect ALL rows, so the spacer is the full height...
function totalHeight(total, rowHeight) {
  return total * rowHeight;
}
// ...and each rendered row is pushed to its true position (absolute top, or a translateY).
function offsetFor(index, rowHeight) {
  return index * rowHeight;
}

const TOTAL = 10000, ROW = 30, VIEWPORT = 300;
const [aStart, aEnd] = visibleRange(0, ROW, VIEWPORT, TOTAL);
const [bStart, bEnd] = visibleRange(3000, ROW, VIEWPORT, TOTAL);
console.log("at top:          rows", aStart, "..", aEnd);          // 0 .. 13
console.log("scrolled 3000px: rows", bStart, "..", bEnd);          // 97 .. 113
console.log("DOM nodes rendered:", bEnd - bStart, "of", TOTAL);    // 16 of 10000
console.log("spacer height:", totalHeight(TOTAL, ROW), "px (scrollbar stays correct)");
`

// ---------- fe-typescript ----------
const tsNarrowingStarter = `// Narrowing & discriminated unions in action. TypeScript uses the 'kind' tag to figure out which
// shape it has; at RUNTIME the types are gone, so this is plain JS. The codeNotes show the TS version.

// A "discriminated union": every shape carries a literal 'kind' tag TS can switch on.
function area(shape) {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "square":    return shape.side ** 2;
    case "rectangle": return shape.width * shape.height;
    default:
      // Exhaustiveness: in TS you assign 'shape' to a 'never' here, so adding a new kind
      // without handling it becomes a COMPILE error. At runtime we just guard.
      throw new Error("Unhandled shape: " + shape.kind);
  }
}

// A runtime type guard — 'typeof x === "string"' narrows to string in TS, and works in JS too.
function isString(x) {
  return typeof x === "string";
}

console.log("circle:   ", area({ kind: "circle", radius: 2 }).toFixed(2)); // 12.57
console.log("square:   ", area({ kind: "square", side: 3 }));              // 9
console.log("rectangle:", area({ kind: "rectangle", width: 2, height: 5 })); // 10
console.log("isString('hi'):", isString("hi"), " isString(5):", isString(5)); // true false
`

const tsGenericsStarter = `// Generics let ONE function work over many types without losing type info. Types erase at runtime,
// so below is the plain-JS runtime; the codeNotes show the <T> signatures TypeScript layers on top.

// first<T>(arr: T[]): T | undefined
function first(arr) {
  return arr[0];
}

// identity<T>(x: T): T
function identity(x) {
  return x;
}

// pluck<T, K extends keyof T>(items: T[], key: K): T[K][]
// A CONSTRAINED generic: K must be a key of T, so items.map(it => it[key]) is type-safe.
function pluck(items, key) {
  return items.map((it) => it[key]);
}

console.log("first([1,2,3]):", first([1, 2, 3]));   // 1
console.log("first([]):     ", first([]));           // undefined (that is why the return is T | undefined)
console.log("identity('hi'):", identity("hi"));      // hi
const users = [{ id: 1, name: "Ada" }, { id: 2, name: "Lin" }];
console.log("pluck names:   ", pluck(users, "name")); // ["Ada", "Lin"]
`

// ---------- fe-paradigms ----------
const fpPureStarter = `// PURE FUNCTION = (1) same input -> same output (deterministic), (2) no side effects
// (no mutating inputs, no I/O). Pure functions are trivial to test and reason about — and
// React depends on them: state must be treated as immutable, so you return NEW data, never edit.

// IMPURE: mutates the caller's array underneath them. The classic AI-generated bug.
function addImpure(cart, item) {
  cart.push(item);          // <-- side effect: the input is changed
  return cart;
}

// PURE: return a NEW array; the original is untouched.
function addItem(cart, item) {
  return [...cart, item];                 // spread = shallow copy + append
}

// PURE update: map to a new array, replacing ONLY the matched item with a new object.
function setQty(cart, id, qty) {
  return cart.map((it) => (it.id === id ? { ...it, qty } : it));
}

// PURE remove.
function removeItem(cart, id) {
  return cart.filter((it) => it.id !== id);
}

// PURE derivation: reduce is a fold — deterministic, no mutation.
function total(cart) {
  return cart.reduce((sum, it) => sum + it.price * it.qty, 0);
}

const cart = [{ id: 1, price: 10, qty: 1 }, { id: 2, price: 5, qty: 3 }];
const bigger = addItem(cart, { id: 3, price: 2, qty: 10 });
console.log("original length:", cart.length, " new length:", bigger.length); // 2  3  (original untouched)
console.log("total(bigger):", total(bigger));                                // 45
console.log("setQty is immutable:", total(setQty(cart, 1, 5)), "vs original", total(cart)); // 65 vs 25
`

const fpComposeStarter = `// HIGHER-ORDER FUNCTIONS take and/or return functions. map / filter / reduce are the daily trio.
// COMPOSITION builds one big transform by chaining small, pure steps — each independently testable.

// pipe: LEFT-to-right. pipe(f, g)(x) === g(f(x)) — reads top-to-bottom like a recipe.
function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

// compose: RIGHT-to-left (classic math order). compose(f, g)(x) === f(g(x)).
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

// small, pure, reusable steps:
const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const spacesToDashes = (s) => s.replace(/\\s+/g, "-");

// one readable pipeline instead of nested calls:
const slugify = pipe(trim, lower, spacesToDashes);

// map/filter/reduce is itself a data pipeline:
const nums = [1, 2, 3, 4, 5, 6];
const sumOfEvenSquares = nums
  .filter((n) => n % 2 === 0)   // [2, 4, 6]
  .map((n) => n * n)            // [4, 16, 36]
  .reduce((a, b) => a + b, 0);  // 56

console.log("slugify:", slugify("  Hello World  "));            // "hello-world"
console.log("compose is right-to-left:", compose(trim, lower)("  HI  ")); // "hi"
console.log("sumOfEvenSquares:", sumOfEvenSquares);            // 56
`

// ---------- fe-react-depth ----------
const reactEqualityStarter = `// What React actually compares. React.memo skips a re-render when the new props are SHALLOW-equal
// to the old ones; a hook's dependency array re-runs when any dep changes by Object.is. Implement
// both — then you'll know exactly why an inline {} or () => {} prop "breaks" memoization.

// Object.is is React's equality primitive: like === but NaN===NaN is true and +0 !== -0.
function areEqual(a, b) {
  return Object.is(a, b);
}

// React.memo's default: compare each top-level prop with Object.is. Same keys + same refs => skip render.
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.hasOwn(b, k) && Object.is(a[k], b[k]));
}

// useMemo/useCallback/useEffect deps: recompute when the array changed (null = first render).
function depsChanged(prev, next) {
  if (prev === null) return true;             // first render — always run
  if (prev.length !== next.length) return true;
  return next.some((dep, i) => !Object.is(dep, prev[i]));
}

const propsA = { value: 1, onPick: shallowEqual };
console.log("same refs -> memo skips:", shallowEqual(propsA, { value: 1, onPick: shallowEqual })); // true
console.log("new fn each render -> re-renders:", shallowEqual(propsA, { value: 1, onPick: () => {} })); // false
console.log("deps unchanged:", depsChanged([1, "a"], [1, "a"]));  // false (skip)
console.log("deps changed:  ", depsChanged([1, "a"], [2, "a"]));  // true  (recompute)
console.log("first render:  ", depsChanged(null, [1]));           // true
`

const reactMemoStarter = `import { useState, useMemo, useCallback, memo, useRef } from "react";

// A deliberately expensive computation. useMemo caches it so it only re-runs when \`n\` changes —
// NOT on every keystroke in the unrelated text box.
function buildSquares(n) {
  let work = 0;
  for (let i = 0; i < 1_000_000; i++) work += 1; // simulate real cost
  return Array.from({ length: n }, (_, i) => i * i);
}

// memo() skips re-rendering when props are shallow-equal. Watch the per-row render counter.
const Row = memo(function Row({ value, onPick }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <li>
      {value}{" "}
      <button onClick={() => onPick(value)}>pick</button>
      <small style={{ color: "#9ca3af" }}> (rendered {renders.current}×)</small>
    </li>
  );
});

export default function App() {
  const [n, setN] = useState(5);
  const [text, setText] = useState("");
  const [picked, setPicked] = useState(null);

  // useMemo: recompute the array only when n changes.
  const squares = useMemo(() => buildSquares(n), [n]);
  // useCallback: keep a STABLE function identity so memo(Row) isn't busted every render.
  const onPick = useCallback((v) => setPicked(v), []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <p>Type here — the list does NOT recompute or re-render per keystroke:</p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type…" />
      <p>
        n = {n} <button onClick={() => setN(n + 1)}>+1</button>
        {picked !== null && <span> · picked {picked}</span>}
      </p>
      <ul>
        {squares.map((v) => (
          <Row key={v} value={v} onPick={onPick} />
        ))}
      </ul>
      <p style={{ color: "#6b7280" }}>
        Try removing useCallback (pass onPick={"{(v) => setPicked(v)}"}) — every Row re-renders on each keystroke.
      </p>
    </div>
  );
}
`

const reactHooksStarter = `import { useState, useEffect, useCallback } from "react";

// A CUSTOM HOOK is just a function named useXxx that calls other hooks. It extracts reusable
// STATEFUL LOGIC (single responsibility) — never markup. Two examples:

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle];
}

// Debounce a fast-changing value. The timer logic lives ONCE and is reusable anywhere.
function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel on the next change — the debounce
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [dark, toggleDark] = useToggle(false);
  const [text, setText] = useState("");
  const debounced = useDebouncedValue(text, 500);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, minHeight: 180,
      background: dark ? "#111827" : "#fff", color: dark ? "#f9fafb" : "#111827" }}>
      <button onClick={toggleDark}>{dark ? "☀️ light" : "🌙 dark"}</button>
      <p>Type — “debounced” only catches up 500ms after you stop:</p>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="search…" />
      <p>live: <b>{text || "—"}</b></p>
      <p>debounced: <b>{debounced || "—"}</b></p>
    </div>
  );
}
`

const reactFormsStarter = `import { useState, useRef } from "react";

// CONTROLLED: React state is the single source of truth. ONE handler drives many fields via name.
// UNCONTROLLED: some inputs (file) can't be controlled — read them from a ref on submit.
export default function App() {
  const [form, setForm] = useState({ name: "", email: "", plan: "free" });
  const fileRef = useRef(null);
  const [submitted, setSubmitted] = useState(null);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value })); // immutable update, computed key
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted({ ...form, file: fileRef.current?.files?.[0]?.name ?? null });
  };

  return (
    <form onSubmit={submit} style={{ fontFamily: "system-ui", padding: 24, display: "grid", gap: 8, maxWidth: 320 }}>
      <input name="name" value={form.name} onChange={update} placeholder="name" />
      <input name="email" value={form.email} onChange={update} placeholder="email" />
      <select name="plan" value={form.plan} onChange={update}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <label style={{ fontSize: 13, color: "#6b7280" }}>Avatar (uncontrolled): <input type="file" ref={fileRef} /></label>
      <button type="submit">Submit</button>
      <pre style={{ background: "#f3f4f6", padding: 8, borderRadius: 6 }}>
        live state: {JSON.stringify(form)}
        {submitted ? "\\n\\nsubmitted: " + JSON.stringify(submitted) : ""}
      </pre>
    </form>
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
    summary: 'The eternal question. Know the flexbox/grid one-liners — and why margin:auto only centers horizontally.',
    prompt: `Center a box horizontally **and** vertically — the interview classic. The starter centers with **flexbox**; the other three approaches (**grid**, **absolute + \`margin:auto\`**, **absolute + \`translate\`**) are right there in the CSS, **commented out** — uncomment one to compare. Then read below for when to reach for each, and the \`margin:auto\` gotcha.`,
    keyTerms: [
      { term: 'Main axis / cross axis', def: 'In flexbox, the main axis follows flex-direction (row by default); the cross axis is perpendicular. justify-content aligns on the main axis, align-items on the cross.' },
      { term: 'place-items', def: 'Grid shorthand for align-items + justify-items. place-items: center centers on both axes in one line — the shortest full-centering.' },
      { term: 'margin: auto', def: 'In normal flow, auto left/right margins split the leftover horizontal space (centering horizontally), but auto top/bottom margins compute to 0 — so it does NOT center vertically.' },
      { term: 'translate(-50%, -50%)', def: 'After top/left:50% puts the box’s top-left corner at the center, transform pulls it back by half its OWN width/height — centering an element of unknown size.' },
    ],
    starterCode: { '/index.html': centerStarter },
    explanation: `**When to reach for each** (all four are in the editor, commented):

| Approach | How | Best for | Watch out |
|---|---|---|---|
| **Flexbox** | \`display:flex; justify-content:center; align-items:center\` | The modern default — one item, or a row/column of them; keeps items in flow with \`gap\` | Three lines where grid needs two |
| **Grid** | \`display:grid; place-items:center\` | The shortest both-axes centering; real 2D layouts | Slightly less familiar to some reviewers |
| **Absolute + \`margin:auto\`** | \`position:absolute; inset:0; margin:auto\` | Overlaying a positioned ancestor (badge, close button) when the box **has a size** | Removed from flow; needs an intrinsic width/height to solve |
| **Absolute + \`translate\`** | \`position:absolute; top:50%; left:50%; transform:translate(-50%,-50%)\` | Centering an element of **unknown** size — the classic modal/tooltip | Removed from flow; can blur on subpixel boundaries |

**Rule of thumb:** reach for **flexbox or grid** by default — they keep the box in normal flow and give you \`gap\` for free. Use the **absolute** tricks only when the element must **overlay** other content (modals, tooltips, badges): \`translate\` when its size is unknown, \`margin:auto\` when it isn’t.

**Why \`margin:auto\` centers horizontally but not vertically (in normal flow):** a block-level box takes its **width from its parent** but its **height from its content**. Setting \`margin-left\`/\`margin-right: auto\` tells the browser to split the **leftover horizontal space** between the two margins — so the box lands in the horizontal middle. Vertically there’s no leftover space to split (the box is exactly as tall as its content), and the CSS spec says \`auto\` **top/bottom margins compute to \`0\`** for in-flow blocks. So \`margin:auto\` slides the box horizontally and leaves it pinned to the top.

**So how do you center vertically?** Give the browser vertical space to distribute:
- **Make the parent flex or grid** — inside a flex/grid container, \`auto\` margins absorb free space on **both** axes, so \`align-items:center\` / \`place-items:center\` (or even \`margin:auto\`) now centers vertically too. This is the modern answer.
- **Absolutely position it** — \`position:absolute; inset:0; margin:auto\` gives the box a defined slot on all four sides, so the auto margins finally have vertical space to share.
- **Use the translate trick** — \`top:50%; left:50%; transform:translate(-50%,-50%)\` centers regardless of the box’s size.

*Sources: [MDN — margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin), [MDN — Centering in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Center_an_element).*`,
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

  // ---------- fe-performance ----------
  {
    id: 'fe-perf-rendering', module: 'fe-performance', order: 1, kind: 'concept',
    title: 'How the browser renders (the pixel pipeline)', difficulty: 'medium', tags: ['performance', 'rendering', 'browser'],
    summary: 'DOM + CSSOM → render tree → layout → paint → composite. Know the pipeline to know what makes it slow.',
    prompt: `Every frame, the browser turns your HTML/CSS/JS into pixels through a fixed **pipeline**. To hit **60fps** you have ~**16.7ms per frame** — so the goal of most front-end perf work is to do *less* of the expensive stages. This is exactly the "rendering & performance" work a Snap-style role centers on.`,
    keyTerms: [
      { term: 'Critical rendering path', def: 'The sequence the browser runs to first paint: parse HTML → DOM, parse CSS → CSSOM, combine into the render tree, then layout → paint → composite.' },
      { term: 'DOM & CSSOM', def: 'The Document Object Model (element tree) and CSS Object Model (computed styles). The render tree is their intersection — only visible, styled nodes.' },
      { term: 'Layout (reflow)', def: 'Computing the geometry — size and position — of every box. Triggered by changes to width, height, position, font-size, adding/removing nodes. Expensive.' },
      { term: 'Paint', def: 'Filling in pixels: text, colors, borders, shadows, images. Happens into layers.' },
      { term: 'Composite', def: 'Assembling painted layers into the final image on the GPU. transform and opacity changes can be composite-only — no layout, no paint.' },
      { term: 'Frame budget (16.7ms)', def: 'At 60fps each frame has ~16.7ms; after the browser’s own overhead you get ~10ms. Blow it and the frame drops → visible jank.' },
    ],
    codeNotes: [
      { label: 'Which stages does a CSS change trigger?', code: `/* Layout + Paint + Composite (expensive): */\nel.style.width = "200px";   top / left / height / margin / font-size\n\n/* Paint + Composite (cheaper): */\nel.style.background = "red"; color / box-shadow / border-radius\n\n/* Composite only (cheapest — GPU, no layout/paint): */\nel.style.transform = "translateX(20px)";\nel.style.opacity = "0.5";`, note: 'Animate with transform/opacity to stay on the compositor. See csstriggers.com.' },
    ],
    explanation: `## The pipeline, stage by stage

| Stage | What happens | Triggered by |
|---|---|---|
| **JavaScript** | Your code mutates the DOM/styles | event handlers, timers, \`fetch\` callbacks |
| **Style** | Recalculate which CSS rules apply | class/attr changes, added nodes |
| **Layout** *(reflow)* | Compute geometry of every box | size/position/text changes |
| **Paint** | Rasterize pixels into layers | color, shadow, image changes |
| **Composite** | Assemble layers on the GPU | \`transform\`, \`opacity\` |

**The key insight:** the stages run top-to-bottom, and each one you *skip* is time saved. Changing a
geometric property (\`width\`, \`top\`) forces **Layout → Paint → Composite** — the whole chain. Changing
\`background\` skips Layout. Changing \`transform\`/\`opacity\` can skip **both** Layout and Paint and run
purely on the **compositor** (GPU) — which is why smooth animations use them.

**Why it matters for the role:** hitting 60fps means keeping each frame under ~16.7ms. When a scroll or
animation janks, you open DevTools → Performance, find which stage is eating the frame (long *Layout* =
reflow thrash, long *Paint* = expensive fills, long *Scripting* = JS), and remove that work. The next
lessons drill into the two biggest wins: **avoiding layout thrash** and **rendering less** (virtualization).`,
  },
  {
    id: 'fe-perf-reflow', module: 'fe-performance', order: 2, kind: 'concept',
    title: 'Reflow, repaint & layout thrashing', difficulty: 'medium', tags: ['performance', 'reflow', 'dom'],
    summary: 'Interleaving DOM reads and writes forces synchronous reflows in a loop — batch them to stay smooth.',
    prompt: `**Layout thrashing** is the #1 self-inflicted jank bug: reading a layout property right after writing one forces the browser to **reflow synchronously**, over and over inside a loop. The fix is a discipline — **read everything first, then write everything** — plus \`requestAnimationFrame\` for visual updates.`,
    keyTerms: [
      { term: 'Reflow vs repaint', def: 'Reflow (layout) recomputes geometry; repaint just refills pixels. Reflow is the pricier of the two and often forces a repaint after it.' },
      { term: 'Layout thrashing', def: 'Alternating DOM writes and layout reads in a loop, each read forcing the browser to flush a fresh layout. Turns O(n) work into O(n) forced reflows.' },
      { term: 'Forced synchronous layout', def: 'Reading offsetHeight / getBoundingClientRect / offsetTop / scrollTop / getComputedStyle after a write makes the browser reflow NOW to give you a fresh value.' },
      { term: 'Read-then-write batching', def: 'Do all measurements first (reads), then all mutations (writes). One reflow instead of n. Libraries like FastDOM formalize this.' },
      { term: 'requestAnimationFrame', def: 'Schedules a callback right before the next paint (~60fps). Batch visual DOM writes here so they land once per frame, aligned with the pipeline.' },
    ],
    codeNotes: [
      { label: 'The thrash — write then read, in a loop (BAD)', code: `for (const box of boxes) {\n  box.style.width = box.offsetWidth + 10 + "px"; // WRITE then READ\n  // offsetWidth forces a synchronous reflow every iteration -> O(n) reflows\n}`, note: 'Each read must flush the pending write to be accurate.' },
      { label: 'The fix — batch: read all, then write all (GOOD)', code: `const widths = boxes.map((b) => b.offsetWidth);      // READ phase (one reflow)\nboxes.forEach((b, i) => { b.style.width = widths[i] + 10 + "px"; }); // WRITE phase`, note: 'One reflow total instead of n.' },
      { label: 'Layout-reading properties to watch', code: `offsetTop / offsetLeft / offsetWidth / offsetHeight\nclientTop / clientWidth / scrollTop / scrollHeight\ngetBoundingClientRect()  getComputedStyle(el)`, note: 'Reading any of these after a write forces a reflow.' },
      { label: 'Batch visual writes into a frame', code: `requestAnimationFrame(() => {\n  el.style.transform = "translateY(" + y + "px)"; // lands once, right before paint\n});`, note: 'Prefer transform/opacity — composite-only, no reflow.' },
    ],
    explanation: `**What goes wrong:** the browser is lazy — it queues style/DOM changes and reflows *once* when it
has to. But the moment you **read** a layout value (\`offsetHeight\`, \`getBoundingClientRect()\`, …), it
must give you an accurate answer, so it **flushes a full reflow right then**. Do that inside a loop that
also writes, and you force a reflow on every iteration — a smooth O(n) pass becomes n synchronous
layouts and the frame blows past 16.7ms.

**The fix is ordering, not cleverness:** separate the **read phase** from the **write phase**. Measure
everything you need first, then apply all mutations. One reflow instead of n. For animations, push the
writes into a \`requestAnimationFrame\` callback so they align with the paint, and prefer **\`transform\`/
\`opacity\`** so the change is composite-only (no reflow at all).

**In an interview / audit:** this is a textbook thing to spot in AI-generated or legacy code — a loop
that reads \`el.offsetTop\` and then sets \`el.style.top\`. Call out the forced synchronous layout and
propose the read/write split. It’s the same instinct as spotting a hidden O(n²) in the algorithms track.`,
  },
  {
    id: 'fe-perf-virtualization', module: 'fe-performance', order: 3, kind: 'utility', template: 'vanilla',
    title: 'List virtualization (windowing)', difficulty: 'medium', tags: ['performance', 'virtualization', 'dom'],
    summary: 'Render only the rows in view — 16 DOM nodes for a 10,000-item list. The math is pure and testable.',
    prompt: `Implement **\`visibleRange(scrollTop, rowHeight, viewportHeight, total, overscan)\`**: return the \`[start, end)\` rows to actually render for a scrolled list. A 10,000-row list should mount ~**16** nodes, not 10,000 — the core technique behind fast feeds and long lists.`,
    keyTerms: [
      { term: 'Virtualization / windowing', def: 'Render only the items currently visible (plus a small buffer); as the user scrolls, recycle nodes and re-render the new window. Keeps the DOM tiny.' },
      { term: 'Overscan', def: 'A few extra rows rendered just above/below the viewport so a fast scroll does not flash blank before the next update.' },
      { term: 'Spacer / total height', def: 'A container sized to total × rowHeight so the scrollbar reflects the full list even though most rows are not in the DOM.' },
      { term: 'Row offset', def: 'Each rendered row is positioned at index × rowHeight (absolute top or translateY) so it sits where it belongs inside the tall spacer.' },
    ],
    codeNotes: [
      { label: 'Which rows to render', code: `const first = Math.floor(scrollTop / rowHeight);\nconst count = Math.ceil(viewportHeight / rowHeight);\nconst start = Math.max(0, first - overscan);\nconst end = Math.min(total, first + count + overscan);`, note: 'Clamp to [0, total] so you never index past the ends.' },
      { label: 'Keep the scrollbar honest', code: `spacer.style.height = total * rowHeight + "px"; // full height\nrow.style.transform = "translateY(" + index * rowHeight + "px)"; // true position`, note: 'translateY is composite-only — cheaper than top.' },
    ],
    starterCode: { '/index.js': virtualizationStarter },
    explanation: `**The problem:** a 10,000-row list = 10,000 DOM nodes = slow layout, huge memory, janky scroll.
**The fix:** only rows in the viewport exist in the DOM. From \`scrollTop\` you compute the first visible
row (\`scrollTop / rowHeight\`) and how many fit (\`viewportHeight / rowHeight\`), add a little **overscan**,
and render just that window — ~16 nodes regardless of list size. A full-height **spacer** keeps the
scrollbar correct, and each row is offset to its real position with \`translateY\`.

**Wiring it up:** attach a \`scroll\` handler (throttled with \`requestAnimationFrame\`), recompute
\`visibleRange\`, and re-render the window. In React this is what **react-window** / **react-virtualized**
/ TanStack Virtual do; the pure \`visibleRange\` math above is the part interviewers actually probe.
Follow-ups: **variable row heights** (measure + prefix-sum offsets), **horizontal** virtualization, and
**infinite scroll** (fetch the next page as \`end\` approaches \`total\`).`,
  },
  {
    id: 'fe-perf-splitting', module: 'fe-performance', order: 4, kind: 'concept',
    title: 'Code-splitting & lazy loading', difficulty: 'medium', tags: ['performance', 'bundling', 'react'],
    summary: 'Ship less JavaScript up front — split by route/component with dynamic import() and React.lazy.',
    prompt: `The fastest code is the code you don’t send. **Code-splitting** breaks one giant bundle into chunks loaded **on demand** (per route or interaction), so the first load is small. \`import()\`, \`React.lazy\`, and route-based splitting are the tools — this very app **lazy-loads Sandpack** so the editor’s weight isn’t in the initial bundle.`,
    keyTerms: [
      { term: 'Bundle', def: 'The JS your bundler (Vite/webpack) produces. One big bundle blocks first render; splitting it defers what’s not needed yet.' },
      { term: 'Dynamic import()', def: 'import("./Heavy.js") returns a Promise and creates a separate chunk fetched at runtime — the primitive all code-splitting builds on.' },
      { term: 'React.lazy + Suspense', def: 'React.lazy(() => import("./Chart")) renders a component only when needed; <Suspense fallback> shows a placeholder while its chunk loads.' },
      { term: 'Route-based splitting', def: 'Split at the router so each page loads its own chunk — the highest-leverage split, since users rarely visit every route.' },
      { term: 'Tree-shaking', def: 'Dead-code elimination: bundlers drop unused ES-module exports. Import only what you use (named imports) so unused code never ships.' },
    ],
    codeNotes: [
      { label: 'Lazy-load a heavy component', code: `import { lazy, Suspense } from "react";\nconst Chart = lazy(() => import("./Chart")); // its own chunk\n\n<Suspense fallback={<Spinner />}>\n  <Chart />\n</Suspense>`, note: 'The Chart bundle is fetched only when it first renders.' },
      { label: 'Split at the route', code: `const Settings = lazy(() => import("./pages/Settings"));\n<Route path="/settings" element={<Settings />} />`, note: 'Users pay for a page only when they visit it.' },
      { label: 'Defer non-critical work', code: `button.onclick = async () => {\n  const { exportPdf } = await import("./pdf"); // load the big lib on click\n  exportPdf(data);\n};`, note: 'Keep rarely-used heavy deps out of the initial bundle.' },
    ],
    explanation: `**Why it matters:** JavaScript is the most expensive resource — it must download, parse, compile,
and execute before the page is interactive. A smaller initial bundle means a faster **LCP** and **INP**
(next lesson). Splitting defers everything the first screen doesn’t need.

**The three moves, in order of leverage:** (1) **route-based** splitting — each page its own chunk;
(2) **component-level** \`React.lazy\` for heavy widgets (charts, editors, maps) behind a \`Suspense\`
fallback; (3) **on-interaction** \`import()\` for big libraries used only after a click (PDF export,
a rich-text editor). Underneath, **tree-shaking** trims unused exports, and a bundle analyzer
(\`rollup-plugin-visualizer\`) shows what’s actually shipping.

**The trade-off to name in an interview:** splitting adds network round-trips (a chunk must be fetched
when needed), so you **preload/prefetch** likely-next chunks and avoid over-splitting tiny modules.
This app applies it directly — the Sandpack live editor is \`lazy\`-loaded so lessons without it start fast.`,
  },
  {
    id: 'fe-perf-web-vitals', module: 'fe-performance', order: 5, kind: 'concept',
    title: 'Core Web Vitals (LCP, CLS, INP)', difficulty: 'medium', tags: ['performance', 'metrics', 'web-vitals'],
    summary: 'The three user-centric metrics Google measures — what they mean, their targets, and how to fix each.',
    prompt: `**Core Web Vitals** are Google’s user-centric performance metrics — how fast the main content **loads** (LCP), how **stable** the layout is (CLS), and how **responsive** it feels to input (INP). They’re measured on real users and affect search ranking, so they’re the shared vocabulary for "is this fast?"`,
    keyTerms: [
      { term: 'LCP — Largest Contentful Paint', def: 'Time until the largest visible element (hero image, heading block) has rendered. Good: ≤ 2.5s. Loading speed.' },
      { term: 'CLS — Cumulative Layout Shift', def: 'How much visible content unexpectedly jumps during load. Good: ≤ 0.1. Visual stability.' },
      { term: 'INP — Interaction to Next Paint', def: 'Responsiveness: the latency from a user interaction to the next visual update, across the whole visit. Good: ≤ 200ms. Replaced FID in March 2024.' },
      { term: 'Field vs lab data', def: 'Field (RUM, real users, e.g. CrUX) is what counts; lab (Lighthouse, synthetic) is for debugging. They can disagree.' },
      { term: 'web-vitals library', def: 'Google’s tiny JS library (onLCP/onCLS/onINP) to measure the vitals on real users and send them to analytics.' },
    ],
    codeNotes: [
      { label: 'Measure vitals on real users', code: `import { onLCP, onCLS, onINP } from "web-vitals";\nonLCP(console.log);\nonCLS(console.log);\nonINP(console.log);   // send these to your analytics endpoint`, note: 'Field data is the source of truth; lab tools are for debugging.' },
      { label: 'Reserve space to prevent CLS', code: `<img src="hero.jpg" width="1200" height="600" /> {/* aspect ratio reserved */}\n.skeleton { aspect-ratio: 16 / 9; }`, note: 'Images/ads without dimensions are the classic layout-shift culprit.' },
    ],
    explanation: `## The three vitals

| Metric | Measures | Good | Main fixes |
|---|---|---|---|
| **LCP** | Loading — largest element painted | ≤ 2.5s | optimize/prioritize the hero image, cut render-blocking JS/CSS, faster server/CDN, preload key assets |
| **CLS** | Stability — unexpected layout jumps | ≤ 0.1 | set width/height on images & embeds, reserve space for ads/skeletons, avoid inserting content above existing content |
| **INP** | Responsiveness — input → next paint | ≤ 200ms | break up long tasks, defer/split JS, keep the main thread free, avoid heavy handlers |

**How to think about them:** LCP is a *loading* problem (get the important pixels on screen fast), CLS
is a *layout* problem (don’t move things after the user starts reading), and INP is a *main-thread*
problem (don’t block the thread so interactions can paint quickly). **INP replaced FID** in March 2024 —
it’s stricter because it watches every interaction across the visit, not just the first.

**The connective tissue:** everything in this module feeds the vitals — **code-splitting** improves LCP
and INP (less JS to load and run), **avoiding layout thrash** and **transform/opacity** animations protect
INP and CLS, and **virtualization** keeps the DOM small so interactions stay responsive. Measure with the
**web-vitals** library on real users, debug in Lighthouse/DevTools, and always cite the metric you’re
moving.`,
  },

  // ---------- fe-typescript ----------
  {
    id: 'fe-ts-basics', module: 'fe-typescript', order: 1, kind: 'concept',
    title: 'Why TypeScript (types, inference, erasure)', difficulty: 'easy', tags: ['typescript', 'types'],
    summary: 'TypeScript is JavaScript plus a compile-time type checker — it catches bugs before they run, then disappears.',
    prompt: `**TypeScript is a superset of JavaScript**: all valid JS is valid TS, plus a **static type system** that checks your code *before* it runs. The role lists "JavaScript **and/or TypeScript**" — TS is table stakes now. The key mental model: types are checked at **compile time** and then **erased**, so at runtime it is just plain JavaScript (which is why this app's live editors run the JS underneath).`,
    keyTerms: [
      { term: 'Static vs dynamic typing', def: 'TS checks types at compile time (before running); JS only finds type errors at runtime, if at all. Static typing surfaces the bug in your editor.' },
      { term: 'Type inference', def: 'TS infers types automatically from initializers — `let name = "Ada"` is inferred as `string`. The handbook advises: use fewer annotations than you think.' },
      { term: 'Type annotation', def: 'Explicitly stating a type: `let name: string`. Needed mainly on function parameters and where inference can’t help.' },
      { term: 'Type erasure', def: 'Types have no runtime footprint — the compiler removes them, emitting plain JS. You cannot check a TS type with `if` at runtime; you narrow with real JS checks instead.' },
      { term: 'any vs unknown', def: '`any` disables all type checking (an escape hatch). `unknown` is the safe counterpart — you must narrow it before use. Prefer `unknown` over `any`.' },
      { term: 'Structural typing', def: 'TS matches types by shape, not by name ("if it has the right properties, it fits"). Two differently-named types with the same shape are compatible.' },
    ],
    codeNotes: [
      { label: 'Annotate params; let inference do the rest', code: `function greet(name: string): string {  // annotate inputs/outputs\n  return "Hi " + name;\n}\nlet count = 5;            // inferred as number — no annotation needed\nconst names = ["a", "b"]; // inferred as string[]`, note: "Lead with inference; annotate function parameters and public APIs." },
      { label: 'unknown is the safe any', code: `let a: any = JSON.parse(s);      // a.foo.bar — no error, no safety\nlet u: unknown = JSON.parse(s);  // must narrow before use:\nif (typeof u === "string") u.toUpperCase();`, note: "any switches off the checker; unknown forces you to prove the type first." },
    ],
    explanation: `**What you get:** the type checker catches whole classes of bugs — typos, \`undefined\` is not a
function, passing a \`number\` where a \`string\` is expected, forgetting a case — **in your editor**, before
the code ever runs. It also powers autocomplete, safe refactors, and self-documenting function signatures.

**The compile-time / runtime split (the thing to internalize):** TypeScript runs a checker over your
code, then a compiler **strips the types** and emits ordinary JavaScript. So types are a *development-time*
tool with **zero runtime cost and zero runtime presence**. You can't write \`if (x is Foo)\` — the type is
gone. To make decisions at runtime you use real JS checks (\`typeof\`, \`in\`, \`instanceof\`) that TS
understands (the **narrowing** lesson). This is exactly why this study app stays JavaScript under the hood
while teaching TS as content: the runtime behavior is identical.

**Two habits from the official handbook:** (1) **prefer inference** — annotate function parameters and
public APIs, but let TS infer local variables; (2) **avoid \`any\`** — it silently switches the checker off;
reach for \`unknown\` and narrow. *Source: [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).*`,
  },
  {
    id: 'fe-ts-interfaces', module: 'fe-typescript', order: 2, kind: 'concept',
    title: 'Interfaces, type aliases & unions', difficulty: 'medium', tags: ['typescript', 'interfaces', 'unions'],
    summary: 'Shape your data with interface/type, combine with unions (|) and intersections (&), and lock values with literals.',
    prompt: `Model your data’s **shape** with an \`interface\` or a \`type\` alias, then compose types with **unions** (\`A | B\` — "one of") and **intersections** (\`A & B\` — "both"). **Literal types** (\`"sm" | "md" | "lg"\`) turn a loose \`string\` into an exact set of allowed values — one of TS’s highest-leverage features.`,
    keyTerms: [
      { term: 'interface', def: 'Declares the shape of an object. Always extendable — it can be re-opened to add fields (declaration merging) and `extends` other interfaces. Preferred for object/class shapes and public APIs.' },
      { term: 'type alias', def: 'Names any type — objects, unions, primitives, tuples, functions. Cannot be re-opened after definition. Use it for unions and anything that isn’t a plain object shape.' },
      { term: 'Union type (|)', def: '`string | number` means the value is one of these types. You must narrow before using type-specific methods.' },
      { term: 'Intersection type (&)', def: '`A & B` combines both — the value must satisfy every member. Handy for mixing in extra fields: `Animal & { honey: boolean }`.' },
      { term: 'Literal types', def: 'Exact values as types: `type Size = "sm" | "md" | "lg"`. Restricts a string/number to a known set — the compiler rejects `"xl"`.' },
      { term: 'Optional & readonly', def: '`name?: string` marks a property optional; `readonly id: number` forbids reassignment after creation.' },
    ],
    codeNotes: [
      { label: 'interface for object shapes', code: `interface User {\n  readonly id: number;   // cannot be reassigned\n  name: string;\n  email?: string;        // optional\n}\ninterface Admin extends User { role: "admin"; }`, note: "Interfaces extend and can be re-opened; reach for them for object/class shapes." },
      { label: 'type for unions, literals, composition', code: `type Size = "sm" | "md" | "lg";     // literal union\ntype ID = string | number;          // union\ntype Staff = User & { level: number }; // intersection`, note: "A type alias cannot be re-opened; use it for unions and compositions." },
      { label: 'as const freezes to literal types', code: `const sizes = ["sm", "md", "lg"] as const;\n// type is readonly ["sm","md","lg"], not string[]\ntype Size = typeof sizes[number];   // "sm" | "md" | "lg"`, note: "as const derives a literal union from a real array — single source of truth." },
    ],
    explanation: `**interface vs type — the real rule (from the handbook):** they’re nearly interchangeable for
object shapes; the one hard difference is that **a \`type\` cannot be re-opened to add properties, while an
\`interface\` is always extendable**. Practical guidance: use \`interface\` for object and class shapes and
public APIs (it \`extends\` cleanly and supports declaration merging), and use \`type\` for **unions**,
**literals**, tuples, and function types — things an interface can’t express.

**Unions and literals are where TS earns its keep.** A \`union\` (\`|\`) models "this is one of these
types/values"; an **intersection** (\`&\`) models "this has all of these." Turning a loose \`string\` into a
**literal union** (\`"GET" | "POST" | "PUT" | "DELETE"\`) means the compiler rejects typos like \`"POTS"\`
before you ever run the code. Combined with **discriminated unions** (next lesson), literals let TS prove
you handled every case. *Source: [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).*`,
  },
  {
    id: 'fe-ts-narrowing', module: 'fe-typescript', order: 3, kind: 'utility', template: 'vanilla',
    title: 'Narrowing & discriminated unions', difficulty: 'medium', tags: ['typescript', 'narrowing', 'unions'],
    summary: 'Real JS checks (typeof, in, instanceof, a discriminant tag) let TS refine a union to one exact type.',
    prompt: `Implement **\`area(shape)\`** over a **discriminated union** of shapes tagged by \`kind\`. A \`switch\` on \`shape.kind\` lets TypeScript **narrow** to the exact shape in each branch. Because types erase, the code you run is plain JS — but the same checks drive the compiler’s narrowing.`,
    keyTerms: [
      { term: 'Narrowing', def: 'TS follows your control flow and refines a value to a more specific type inside a branch — e.g. `number | string` becomes `string` after a `typeof` check.' },
      { term: 'Type guard', def: 'A runtime check TS recognizes for narrowing: `typeof x === "string"`, `"swim" in animal`, `x instanceof Date`, or a custom `x is Fish` predicate.' },
      { term: 'Discriminated union', def: 'A union of object types sharing a common literal property (the discriminant, e.g. `kind: "circle"`). Switching on it narrows to the matching member.' },
      { term: 'Exhaustiveness with never', def: 'In the `default` branch, assigning the value to a `never` makes TS error if any union member is unhandled — so adding a new shape forces you to handle it. `never`: no type is assignable to it (except never).' },
    ],
    codeNotes: [
      { label: 'The discriminant + switch (TS narrows each case)', code: `type Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case "circle": return Math.PI * s.radius ** 2; // s is Circle here\n    case "square": return s.side ** 2;             // s is Square here\n  }\n}`, note: "The shared literal 'kind' is the discriminant TS switches on." },
      { label: 'Exhaustiveness check with never', code: `default: {\n  const _exhaustive: never = s; // compile error if a kind is unhandled\n  return _exhaustive;\n}`, note: "Add a new shape kind and TS forces you to handle it — no silent gaps." },
      { label: 'Custom type guard (x is Fish)', code: `function isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}`, note: "A 'x is T' return type teaches TS to narrow at the call site." },
    ],
    starterCode: { '/index.js': tsNarrowingStarter },
    explanation: `**The idea:** a value typed as a **union** can’t be used as any one member until you prove which
it is. TypeScript watches ordinary JS checks — \`typeof\`, truthiness, \`===\`, the \`in\` operator,
\`instanceof\` — and **narrows** the type inside that branch. A **discriminated union** makes this airtight:
give every member a shared literal tag (\`kind: "circle"\`) and a \`switch\` narrows to the exact shape in
each \`case\`.

**The killer feature is exhaustiveness.** Put \`const _exhaustive: never = shape\` in the \`default\`: because
**no type is assignable to \`never\`**, TS raises a compile error the moment you add a new \`kind\` without a
matching \`case\`. That turns "did I handle every state?" from a code-review hope into a compiler guarantee
— exactly the reliability the role cares about. Run the editor to see the runtime (plain JS); the codeNotes
show the types that make it safe. *Source: [TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).*`,
  },
  {
    id: 'fe-ts-generics', module: 'fe-typescript', order: 4, kind: 'utility', template: 'vanilla',
    title: 'Generics', difficulty: 'medium', tags: ['typescript', 'generics'],
    summary: 'One function, many types, without losing type info — `<T>` is a type parameter you fill in per call.',
    prompt: `Implement generic helpers — **\`first(arr)\`**, **\`identity(x)\`**, and **\`pluck(items, key)\`**. In TypeScript these are \`first<T>\`, \`identity<T>\`, and a **constrained** \`pluck<T, K extends keyof T>\`, so callers keep exact types instead of falling back to \`any\`. Types erase, so the running code is plain JS.`,
    keyTerms: [
      { term: 'Generic / type parameter', def: 'A placeholder type (`<T>`) filled in when the function is called, so `first<number>([1,2])` returns `number`. One implementation, full type safety across types.' },
      { term: 'Why not any', def: '`any` loses information — `first(arr): any` forgets the element type. `first<T>(arr: T[]): T` remembers it, so the result keeps autocomplete and checking.' },
      { term: 'Generic constraint (extends)', def: '`<T extends { length: number }>` restricts T to types that have the required shape, so you can safely use those members inside.' },
      { term: 'keyof', def: '`keyof T` is the union of T’s property names. `pluck<T, K extends keyof T>` guarantees `key` is a real property of the items — a typo won’t compile.' },
    ],
    codeNotes: [
      { label: 'Generic function signatures', code: `function first<T>(arr: T[]): T | undefined { return arr[0]; }\nfunction identity<T>(x: T): T { return x; }\n// first([1,2,3]) -> number | undefined  (T inferred as number)`, note: "T is inferred from the argument — callers rarely write it explicitly." },
      { label: 'Constrained generic with keyof', code: `function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {\n  return items.map((it) => it[key]);\n}\npluck(users, "name"); // OK   pluck(users, "nope"); // compile error`, note: "K extends keyof T rejects keys that do not exist on T." },
    ],
    starterCode: { '/index.js': tsGenericsStarter },
    explanation: `**The problem generics solve:** without them you either write the same function once per type
(repetitive) or type it as \`any\` (unsafe — you lose all checking and autocomplete). A **generic** captures
the type as a parameter \`T\` and threads it through: \`first<T>(arr: T[]): T | undefined\` means "give me an
array of some \`T\`, I return that same \`T\`." Call \`first([1,2,3])\` and TS **infers** \`T = number\`, so the
result is \`number | undefined\` — fully typed, zero annotations at the call site.

**Constraints make generics precise.** \`<T extends { length: number }>\` says "T must at least have a
\`length\`," letting you use \`.length\` safely inside. \`pluck<T, K extends keyof T>\` uses **\`keyof\`** so the
\`key\` argument must be a real property name of the items — \`pluck(users, "nmae")\` fails to compile. This
is the same generic machinery React uses to type components (\`useState<number>\`, \`Array<User>\`), so it’s
worth real fluency. Run the editor for the JS runtime; the codeNotes carry the \`<T>\` signatures.`,
  },
  {
    id: 'fe-ts-utility-types', module: 'fe-typescript', order: 5, kind: 'concept',
    title: 'Utility types (Partial, Pick, Record…)', difficulty: 'medium', tags: ['typescript', 'utility-types', 'react'],
    summary: 'Built-in type transformers — reshape an existing type instead of hand-writing a new one.',
    prompt: `TypeScript ships **utility types** that transform existing types: make every field optional (\`Partial\`), select a subset (\`Pick\`), remove fields (\`Omit\`), build a dictionary (\`Record\`), and more. They keep your types **DRY** — derive from one source of truth instead of re-declaring shapes that drift apart.`,
    keyTerms: [
      { term: 'Partial<T> / Required<T>', def: '`Partial<T>` makes every property optional (great for update/patch objects); `Required<T>` makes every property mandatory.' },
      { term: 'Pick<T, K> / Omit<T, K>', def: '`Pick` keeps only the named keys; `Omit` removes them. E.g. `Omit<User, "password">` for a safe public shape.' },
      { term: 'Record<K, V>', def: 'A dictionary/object type with keys K and values V: `Record<string, number>` or `Record<"sm" | "lg", string>`.' },
      { term: 'Readonly<T>', def: 'Makes all properties `readonly` — a compile-time immutable view of the shape.' },
      { term: 'ReturnType<F> / Parameters<F>', def: 'Extract a function’s return type or its parameter tuple from the function type itself — no manual duplication.' },
    ],
    codeNotes: [
      { label: 'Reshape one source-of-truth type', code: `interface User { id: number; name: string; email: string; password: string; }\ntype UserUpdate = Partial<User>;          // all optional (PATCH body)\ntype PublicUser = Omit<User, "password">;  // drop the secret\ntype Credentials = Pick<User, "email" | "password">;`, note: "Derive from User; if User changes, these follow automatically." },
      { label: 'Record for dictionaries', code: `type Roles = Record<"admin" | "editor" | "viewer", string[]>;\n// { admin: string[]; editor: string[]; viewer: string[] }\nconst counts: Record<string, number> = {};`, note: "Cleaner than index signatures for known key sets." },
      { label: 'Typing React props (where you meet these)', code: `interface ButtonProps {\n  label: string;\n  variant?: "primary" | "ghost";   // optional literal union\n  onClick: () => void;\n}\nfunction Button({ label, variant = "primary", onClick }: ButtonProps) { /* ... */ }`, note: "Props are just an object type; literal unions constrain variants." },
    ],
    explanation: `**Why they matter:** the biggest maintenance win in TS is a **single source of truth** for a
shape, then *deriving* everything else from it. Hand-writing a \`UserUpdate\` next to \`User\` guarantees they
drift; \`Partial<User>\` stays in sync forever. The core set to know cold: **\`Partial\`**, **\`Required\`**,
**\`Readonly\`**, **\`Pick\`**, **\`Omit\`**, **\`Record\`**, and **\`ReturnType\`**.

| Utility | Turns \`User\` into… | Use for |
|---|---|---|
| \`Partial<User>\` | all fields optional | PATCH/update payloads |
| \`Required<User>\` | all fields mandatory | tightening a loose type |
| \`Pick<User, "id" \\| "name">\` | only those keys | narrow view models |
| \`Omit<User, "password">\` | everything except those | safe public objects |
| \`Record<Role, string[]>\` | dictionary of Role → string[] | keyed maps |
| \`Readonly<User>\` | immutable view | frozen config/state |

**Where you’ll use them daily:** typing **React props** (a props object is just a type — often with
optional fields and literal-union variants), API request/response shapes, and reducer state. Master these
and you write far fewer bespoke types. *Source: [TypeScript Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).*`,
  },

  // ---------- fe-paradigms (OOP & Functional Programming) ----------
  {
    id: 'fe-para-intro', module: 'fe-paradigms', order: 1, kind: 'concept',
    title: 'Two paradigms, one language', difficulty: 'easy', tags: ['oop', 'functional', 'paradigms'],
    summary: 'JavaScript is multi-paradigm: it does object-oriented AND functional. Know what each optimizes for and when to reach for it.',
    prompt: `The role asks for "**OOP + functional programming principles**." JavaScript is **multi-paradigm** — it supports both, and idiomatic code mixes them. The one-line contrast: **OOP bundles state and the behavior that acts on it together** (objects/classes); **FP keeps data and behavior separate** and transforms **immutable** data with **pure functions**. React itself is the poster child — components used to be classes (OOP) and are now functions with hooks that lean hard on FP (immutable state, pure render).`,
    keyTerms: [
      { term: 'Imperative vs declarative', def: 'Imperative code says HOW step by step (a `for` loop that pushes). Declarative code says WHAT you want (`.map`/`.filter`). FP and React both push you toward declarative.' },
      { term: 'Object-oriented programming (OOP)', def: 'Organize code as objects that bundle state (data) with behavior (methods). Core ideas: encapsulation, inheritance, polymorphism.' },
      { term: 'Functional programming (FP)', def: 'Build programs from pure functions over immutable data, composed together. Core ideas: pure functions, immutability, first-class & higher-order functions, composition.' },
      { term: 'Multi-paradigm', def: 'A language that supports several paradigms. JS has first-class functions (FP) AND classes/prototypes (OOP) — real code blends them.' },
      { term: 'State', def: 'Data that changes over time. OOP tends to hold and mutate state inside objects; FP tends to thread state through as immutable values you replace, not edit.' },
    ],
    codeNotes: [
      { label: 'Same task, two styles', code: `// Imperative (how):\nlet totals = [];\nfor (let i = 0; i < carts.length; i++) totals.push(sum(carts[i]));\n\n// Declarative / functional (what):\nconst totals2 = carts.map(sum);`, note: "Declarative reads as intent; fewer places for an off-by-one to hide." },
      { label: 'OOP: state + behavior together', code: `class Counter {\n  #count = 0;               // state, encapsulated\n  increment() { this.#count++; } // behavior on that state\n  get value() { return this.#count; }\n}`, note: "The data and the methods that change it live in one unit." },
      { label: 'FP: data in, new data out', code: `const increment = (count) => count + 1; // pure: no stored state\nconst next = increment(0);              // caller holds the state`, note: "No hidden state; the value is passed in and a new value returned." },
    ],
    explanation: `**Neither paradigm is "the right one" — they optimize for different things, and senior code
uses both deliberately.**

**OOP** shines when you have a *thing* with identity and lifecycle — a DOM element wrapper, a game entity,
a database connection — where bundling state with the methods that manage it (**encapsulation**) keeps the
invariants in one place. **FP** shines for **data transformation** — take input, run it through pure steps,
get output — which is most of what a UI does (props → view) and most of what interview problems ask for.

**Why front-end interviews lean functional:** React's model is *"UI is a pure function of state."* Render
must be pure (same props/state → same output, no side effects during render); state updates must be
**immutable** (return new objects/arrays so React can detect the change by reference). Getting fluent with
pure functions, immutability, and composition — the next lessons — directly pays off in React, and makes
your code far easier to unit-test.

**The pragmatic rule:** reach for a **class** when you're modeling a stateful entity with a clear identity;
reach for **pure functions + composition** when you're transforming data. Don't force everything into one.
*Sources: [MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function),
[React — Keeping Components Pure](https://react.dev/learn/keeping-components-pure).*`,
  },
  {
    id: 'fe-fp-pure', module: 'fe-paradigms', order: 2, kind: 'utility', template: 'vanilla',
    title: 'Pure functions & immutability', difficulty: 'medium', tags: ['functional', 'immutability', 'react'],
    summary: 'A pure function is deterministic and side-effect-free. Update data by returning copies (spread/map/filter), never by mutating.',
    prompt: `Implement **pure** cart operations — \`addItem\`, \`setQty\`, \`removeItem\`, and \`total\` — that **never mutate** their inputs. Each returns a **new** array/value; the original is left untouched. This is exactly how you update React state, and why these functions are trivial to test.`,
    keyTerms: [
      { term: 'Pure function', def: 'Two rules: (1) same input → same output (deterministic), and (2) no side effects — it doesn’t mutate inputs, touch globals, or do I/O. Everything it needs comes in as arguments.' },
      { term: 'Side effect', def: 'Anything a function does beyond returning a value: mutating an argument, writing a global, logging, network/DOM. Pure functions have none.' },
      { term: 'Immutability', def: 'Treat data as read-only: to "change" it, produce a new copy with the change applied (`[...arr]`, `{...obj}`), leaving the original intact.' },
      { term: 'Referential transparency', def: 'A pure call can be replaced by its result without changing the program. It’s what makes pure code cacheable (memoizable) and easy to reason about.' },
      { term: 'Mutation vs copy', def: '`arr.push`/`arr.sort`/`obj.x = 1` mutate in place (impure). `[...arr, x]`, `arr.map(...)`, `arr.filter(...)`, `{...obj, x: 1}` return copies (pure).' },
    ],
    codeNotes: [
      { label: 'Immutable array updates (the cheat sheet)', code: `const add    = [...arr, item];                 // append\nconst remove = arr.filter((x) => x.id !== id);  // delete\nconst update = arr.map((x) => x.id === id ? { ...x, done: true } : x); // edit one\n// sort/reverse MUTATE — copy first:\nconst sorted = [...arr].sort();`, note: "push/splice/sort/reverse mutate; spread/map/filter/slice return copies." },
      { label: 'Immutable object update', code: `const next = { ...user, name: "Ada" };  // new object, name replaced\n// nested: copy each level you change\nconst next2 = { ...state, cart: { ...state.cart, qty: 5 } };`, note: "Spread is a SHALLOW copy — spread each nested level you touch." },
      { label: 'Why React needs this', code: `// WRONG: mutating state — React sees the same reference, skips re-render\nstate.items.push(item);\nsetState(state);\n// RIGHT: new array reference\nsetState({ ...state, items: [...state.items, item] });`, note: "React detects change by reference (Object.is). Mutation = missed render." },
    ],
    starterCode: { '/index.js': fpPureStarter },
    explanation: `**The definition to say out loud:** a function is **pure** if (1) it always returns the same
output for the same input, and (2) it has **no side effects** — crucially, it does not mutate its arguments.
\`addItem(cart, item)\` returning \`[...cart, item]\` is pure; \`cart.push(item)\` is not, because the caller's
array silently changes.

**Why this is a front-end power tool, not academic trivia:**
- **React correctness.** React decides whether to re-render by comparing references with \`Object.is\`. If you
  \`push\` into the existing state array and set it back, the reference is unchanged and **your UI won't
  update**. Returning a new array/object is mandatory. \`useMemo\`/\`useCallback\` rely on the same purity to
  cache safely.
- **Testability.** A pure function needs no mocks, no setup, no teardown — feed input, assert output. That's
  why the reference implementations here are unit-tested directly.
- **The AI-audit angle.** In-place mutation of a caller's data is one of the most common bugs AI-generated
  helpers introduce (a \`.sort()\` or \`.push()\` on the input). When you review generated code, check: *does
  this function change something it was only supposed to read?*

**One gotcha:** spread and \`Object.freeze\` are **shallow** — they protect the top level only. To update
nested data immutably, copy each level you touch (see the codeNotes). *Sources:
[MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function),
[React — Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state).*`,
  },
  {
    id: 'fe-fp-compose', module: 'fe-paradigms', order: 3, kind: 'utility', template: 'vanilla',
    title: 'Higher-order functions & composition', difficulty: 'medium', tags: ['functional', 'composition', 'hof'],
    summary: 'Functions are values. map/filter/reduce and compose/pipe let you build big transforms from small pure steps.',
    prompt: `Implement **\`pipe\`** (left-to-right) and **\`compose\`** (right-to-left), then use them to build a \`slugify\` from tiny pure steps. Because functions are **first-class values** in JS, you can pass them around, return them, and chain them — the essence of functional composition.`,
    keyTerms: [
      { term: 'First-class functions', def: 'Functions are values: you can store them in variables, pass them as arguments, and return them. This is what makes everything below possible.' },
      { term: 'Higher-order function (HOF)', def: 'A function that takes a function and/or returns one. `map`, `filter`, `reduce`, `debounce`, and `pipe` are all HOFs.' },
      { term: 'map / filter / reduce', def: '`map` transforms each element 1:1; `filter` keeps elements passing a test; `reduce` folds a list into a single value with an accumulator. All return new data.' },
      { term: 'Composition', def: 'Combining small functions into a bigger one. `pipe(f, g)(x)` runs `f` then `g` (left→right); `compose(f, g)(x)` runs `g` then `f` (right→left).' },
      { term: 'Currying / partial application', def: 'Turning `f(a, b)` into `f(a)(b)`, so you can pre-fill arguments and get back a specialized function — handy for building reusable pipeline steps.' },
    ],
    codeNotes: [
      { label: 'pipe & compose via reduce', code: `const pipe    = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\nconst compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);\n// pipe(a, b, c)(x)  === c(b(a(x)))   // top-to-bottom\n// compose(a, b, c)(x) === a(b(c(x))) // math order`, note: "Same engine (reduce); pipe folds left, compose folds right." },
      { label: 'The map/filter/reduce trio', code: `[1,2,3,4].filter((n) => n % 2 === 0) // [2,4]\n         .map((n) => n * n)          // [4,16]\n         .reduce((a, b) => a + b, 0); // 20`, note: "Declarative pipeline — no loop, no mutable accumulator you manage by hand." },
      { label: 'HOF that RETURNS a function', code: `const multiplyBy = (factor) => (n) => n * factor; // partial application\nconst double = multiplyBy(2);\n[1,2,3].map(double); // [2,4,6]`, note: "Returning a function pre-fills args — reusable, composable steps." },
    ],
    starterCode: { '/index.js': fpComposeStarter },
    explanation: `**Functions are first-class values in JS** — you can pass them in, return them out, and store
them. A **higher-order function** is one that does either: \`map\`, \`filter\`, \`reduce\`, \`debounce\`, and the
\`pipe\`/\`compose\` you just built are all HOFs.

**map / filter / reduce is the functional core of everyday front-end work.** Instead of an imperative loop
with a mutable accumulator you babysit, you declare the transformation: filter down, map across, reduce to a
value — each step pure, each returning new data. It reads as intent and has fewer places for bugs to hide.

**Composition** is how you scale that up. Rather than one big function, write small single-purpose ones and
glue them: \`pipe(trim, lower, spacesToDashes)\`. \`pipe\` runs **left-to-right** (top-to-bottom, how most
people read); \`compose\` runs **right-to-left** (the mathematical \`f(g(x))\` order). Both are one-liners over
\`reduce\`/\`reduceRight\` — knowing that you can *derive* them on the spot is a great interview signal.

**Where you already use this:** React's \`children.map(...)\`, Redux/reducer folds, middleware chains
(\`compose\` is literally how Redux composes middleware), and RxJS-style pipelines. **Performance note:** each
\`map\`/\`filter\` creates a new array and one more pass over the data — clean and usually fine, but on a hot
path over large lists, a single \`reduce\` (or one loop) avoids the intermediate arrays. Readability first;
fuse passes only when profiling says so. *Source:
[MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function).*`,
  },
  {
    id: 'fe-oop-classes', module: 'fe-paradigms', order: 4, kind: 'concept',
    title: 'Classes, encapsulation & prototypes', difficulty: 'medium', tags: ['oop', 'classes', 'prototypes'],
    summary: 'Classes bundle state with behavior. Private #fields enforce encapsulation; under the hood it’s all prototypes. Favor composition over deep inheritance.',
    prompt: `**Classes** are JavaScript's OOP syntax: a blueprint that bundles **state** (fields) with **behavior** (methods) and enforces **encapsulation** via \`#private\` fields. Under the hood classes are **prototype**-based (methods live on the shared prototype, not copied per instance). The senior instinct: reach for classes to model stateful entities, but **favor composition over inheritance** rather than building deep class trees.`,
    keyTerms: [
      { term: 'Class', def: 'A template for creating objects that share structure and behavior. `new Thing()` runs the `constructor` and returns an instance whose methods live on `Thing.prototype`.' },
      { term: 'Encapsulation', def: 'Hiding internal state and exposing a controlled API. `#private` fields (ES2022) are truly inaccessible outside the class — a hard boundary the language enforces.' },
      { term: 'Prototype chain', def: 'JS objects delegate to a prototype; property lookups walk the chain until found. `class` is syntax sugar over this — methods sit on the prototype, shared by all instances.' },
      { term: 'Inheritance (extends)', def: '`class B extends A` makes B a specialized A, reusing/overriding its behavior. `super(...)` calls the parent constructor/method. Powerful but easy to overuse.' },
      { term: 'Polymorphism', def: 'Different types responding to the same method name (`shape.area()`), so calling code doesn’t care which concrete class it holds.' },
      { term: 'Composition over inheritance', def: 'Build behavior by combining small pieces (objects/functions an object HAS) rather than inheriting from a base class (what an object IS). More flexible; avoids brittle deep hierarchies.' },
    ],
    codeNotes: [
      { label: 'A class with encapsulated state', code: `class BankAccount {\n  #balance = 0;                         // truly private (ES2022)\n  constructor(opening = 0) { this.#balance = opening; }\n  deposit(n) { if (n > 0) this.#balance += n; return this; } // guard the invariant\n  get balance() { return this.#balance; }                    // read-only view\n}\nconst a = new BankAccount(100);\na.deposit(50);\nconsole.log(a.balance); // 150\n// a.#balance -> SyntaxError: private field not accessible`, note: "#balance can only be changed through deposit(), which enforces the rule." },
      { label: 'Methods live on the prototype (shared)', code: `class Point { constructor(x){ this.x = x; } show(){ return this.x; } }\nconst p = new Point(3), q = new Point(9);\nPoint.prototype.show === Object.getPrototypeOf(p).show; // true\np.show === q.show; // true — ONE function shared, not copied per instance`, note: "Instances hold data; the shared prototype holds methods. Memory-efficient." },
      { label: 'Composition often beats inheritance', code: `// Instead of Duck extends Bird extends Animal (rigid):\nconst canFly  = (o) => ({ fly:  () => o.name + " flies" });\nconst canSwim = (o) => ({ swim: () => o.name + " swims" });\nconst duck = (name) => { const self = { name }; return { ...self, ...canFly(self), ...canSwim(self) }; };\nduck("Rio").fly();  // mix in exactly the behaviors you need`, note: "HAS-A (compose behaviors) is more flexible than IS-A (deep class trees)." },
    ],
    explanation: `**Classes bundle state and behavior behind an API.** The constructor initializes fields;
methods act on them; **\`#private\` fields** (standardized in ES2022) give you real **encapsulation** — code
outside the class literally cannot read or write \`#balance\`, so the only way to change it is through methods
that enforce your invariants (no negative deposits, etc.). That guarantee is the whole point of OOP: keep the
rules that protect your data next to the data.

**It's prototypes underneath.** \`class\` is syntax sugar over JavaScript's prototype system. Methods are
defined once on \`ClassName.prototype\` and **shared** by every instance (not copied), while per-instance data
lives on the object. Property access walks the **prototype chain** until it finds the method. Knowing this
explains \`this\` binding, \`instanceof\`, and why arrow-function methods behave differently.

**Inheritance — use sparingly.** \`extends\` + \`super\` model an "is-a" relationship and enable
**polymorphism** (many shapes, one \`area()\` call). But deep inheritance trees are the classic OOP trap:
they're rigid, and a change to a base class ripples everywhere. The widely-taught guideline —
**"favor composition over inheritance"** (Gang of Four) — says prefer building objects out of smaller
behaviors they *have* over hierarchies of what they *are*. In React this is explicit: the docs recommend
composition (children/props) over component inheritance. **The AI-audit angle:** generated OOP code loves to
spin up needless class hierarchies and leak state through public fields — check whether a class earns its
keep or a couple of pure functions would be clearer. *Sources:
[MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes),
[MDN — Private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties).*`,
  },
  {
    id: 'fe-solid', module: 'fe-paradigms', order: 5, kind: 'concept',
    title: 'SOLID principles, lightly', difficulty: 'medium', tags: ['oop', 'solid', 'design'],
    summary: 'Five design principles for code that’s easy to change. You don’t need the jargon — you need the instincts: small units, extend don’t edit, depend on abstractions.',
    prompt: `**SOLID** is five object-oriented design principles (Robert C. Martin) aimed at one goal: **code that's easy to change without breaking**. You rarely need to recite the acronym in a front-end interview — but the *instincts* (one job per unit, extend rather than edit, depend on abstractions) show up constantly in component and hook design. Learn them as habits, not vocabulary.`,
    keyTerms: [
      { term: 'S — Single Responsibility', def: 'A module/class/component should have one reason to change — one job. A component that fetches, formats, AND renders is three jobs; split them.' },
      { term: 'O — Open/Closed', def: 'Open for extension, closed for modification: add new behavior without editing working code. In React: pass new props/children or a render function instead of adding `if` branches.' },
      { term: 'L — Liskov Substitution', def: 'A subtype must be usable anywhere its base type is expected, without surprises. A `<Button>` variant shouldn’t silently drop `onClick`.' },
      { term: 'I — Interface Segregation', def: 'Don’t force clients to depend on things they don’t use. Prefer small, focused props/interfaces over one giant "God" prop object.' },
      { term: 'D — Dependency Inversion', def: 'Depend on abstractions, not concretions. High-level code shouldn’t hard-wire a concrete implementation — inject it (props, context, a passed-in function).' },
    ],
    codeNotes: [
      { label: 'S — split responsibilities', code: `// Before: one component does fetching + formatting + rendering.\n// After: a hook owns data, a pure fn formats, the component just renders.\nfunction useUsers() { /* fetch + state */ }\nconst fullName = (u) => u.first + " " + u.last;  // pure, testable\nfunction UserList() { const users = useUsers(); return users.map(/* render */); }`, note: "Each piece has one reason to change — and each is testable alone." },
      { label: 'O — extend without editing (inject behavior)', code: `// Closed to edits, open to new variants — no growing if/else:\nfunction Button({ variant = "primary", ...props }) {\n  return <button className={styles[variant]} {...props} />;\n}\n// New variant? add a style key; don't touch Button's logic.`, note: "New cases arrive as data/props, not as edits to tested code." },
      { label: 'D — depend on an abstraction (inject it)', code: `// Hard-wired (rigid): the component knows the concrete API client.\n// Inverted: pass the dependency in, so it's swappable + mockable.\nfunction UserList({ fetchUsers }) { /* uses fetchUsers() */ }\n// prod: <UserList fetchUsers={api.getUsers} />  test: <UserList fetchUsers={fake} />`, note: "Injecting the dependency makes the unit testable and swappable." },
    ],
    explanation: `**The point of SOLID isn't the acronym — it's making change cheap and safe.** Here's each
principle as a front-end instinct:

- **S — Single Responsibility.** One unit, one job. The most useful one day-to-day: a component that fetches
  *and* formats *and* renders has three reasons to change. Pull data into a **custom hook**, formatting into
  a **pure function**, and let the component just render. Each becomes independently testable.
- **O — Open/Closed.** Add behavior without editing working code. Every time you'd add another \`if
  (type === ...)\`, consider passing behavior in instead (a prop, a \`render\` function, a strategy object) so
  new cases don't risk breaking old ones.
- **L — Liskov Substitution.** A specialized version must honor the contract of the general one. A
  \`<PrimaryButton>\` that silently ignores \`disabled\` or \`onClick\` violates it — callers get surprises.
- **I — Interface Segregation.** Keep props/interfaces small and focused. A component shouldn't demand a huge
  config object when it uses three fields; many small props beat one God object.
- **D — Dependency Inversion.** Depend on **abstractions**, not concrete implementations. Don't hard-wire a
  specific API client inside a component — **inject** it (via props, context, or a passed-in function). That's
  what makes the unit swappable and mockable in tests.

**How to use this in an interview:** don't lecture the acronym — *demonstrate* the instincts. "I'd split the
data-fetching into a hook (single responsibility) and inject the API so it's testable (dependency
inversion)" lands far better than reciting five definitions. These principles are guidelines, not laws —
apply them to reduce coupling, not to add ceremony. *Source:
[Wikipedia — SOLID](https://en.wikipedia.org/wiki/SOLID) (Robert C. Martin's principles).*`,
  },

  // ---------- fe-react-depth (React Depth & Performance) ----------
  {
    id: 'fe-react-render', module: 'fe-react-depth', order: 1, kind: 'concept',
    title: 'Rendering, reconciliation & keys', difficulty: 'medium', tags: ['react', 'reconciliation', 'keys', 'performance'],
    summary: 'React renders in two phases and diffs a tree. Stable keys tell it which items are the same across renders — index keys quietly corrupt state.',
    prompt: `A "render" in React is **two phases**: the **render phase** re-runs your component to build a new element tree, then the **commit phase** applies the minimal DOM changes. To do that minimally, React **reconciles** — diffs the new tree against the old, position by position. For lists it can't use position alone, so you give each item a **key**: a stable identity. Get keys wrong (e.g. the array index) and React mismatches items — dropping or duplicating state. This is the same **DOM-as-a-tree** diffing idea from the algorithms track, applied to UI.`,
    keyTerms: [
      { term: 'Render vs commit phase', def: 'Render = React calls your component to compute the new element tree (must be pure). Commit = React mutates the real DOM to match. Your effects run after commit.' },
      { term: 'Reconciliation', def: 'React’s diff of the new element tree against the previous one to compute the smallest set of DOM updates. Same type at the same position → reuse & update; different type → tear down & rebuild.' },
      { term: 'Key', def: 'A stable, unique identifier you give siblings in a list so React can match an item to the same element across renders — even if the list reorders. Keys must be unique among siblings, not globally.' },
      { term: 'Index as key (anti-pattern)', def: 'Using the array index as key ties identity to POSITION, not to the item. Insert/remove/reorder and React re-associates state (inputs, focus, animations) with the wrong row.' },
      { term: 'Position = identity', def: 'React preserves state for an element that stays the same type at the same position. Rendering a different component there (or changing its key) resets its state — a deliberate tool.' },
    ],
    codeNotes: [
      { label: 'Key by stable id, never by index', code: `// ✅ stable identity — survives reorder/insert/delete\n{todos.map((t) => <TodoRow key={t.id} todo={t} />)}\n\n// ⚠️ index key — identity = position; state attaches to the wrong row on reorder\n{todos.map((t, i) => <TodoRow key={i} todo={t} />)}`, note: "The index only works when the list is static (never reordered, inserted, or filtered)." },
      { label: 'Why index keys corrupt state', code: `// Rows have uncontrolled inputs. With key={index}:\n// prepend a new todo -> every row shifts down one index ->\n// React thinks row 0 is still row 0, so the text you typed\n// stays on the WRONG todo. With key={t.id}, it follows the item.`, note: "Any per-row state — input text, focus, open/closed, animation — is the victim." },
      { label: 'Change the key to intentionally RESET state', code: `// Remount the form (clear all its internal state) when the user changes:\n<UserForm key={userId} user={user} />\n// New key -> React unmounts the old, mounts a fresh one.`, note: "A changed key is the idiomatic 'reset this subtree' switch." },
    ],
    explanation: `**The mental model:** rendering doesn't mean "touch the DOM." React first **re-runs your
component** (render phase) to produce a fresh tree of elements — cheap, pure JavaScript — then
**reconciles** that tree against the previous one and **commits** only the differences to the real DOM. This
is why keeping render pure (the paradigms lesson) matters: React may call it more than once and expects the
same output.

**Reconciliation works position-by-position.** At a given position, if the element type is the same
(\`<div>\` → \`<div>\`, \`<TodoRow>\` → \`<TodoRow>\`), React keeps the DOM node and its state and just updates
props; if the type changed, it tears the subtree down and rebuilds. For **lists**, position isn't enough —
items move — so you supply a **key** that says "this is the same logical item as before." React matches by
key, then reorders/updates accordingly.

**The bug that bites everyone: index as key.** With \`key={index}\`, identity is tied to *position*. Prepend
an item and every row's index shifts, so React believes row 0 is unchanged and keeps its DOM node — including
any **uncontrolled state** (typed-in text, focus, an open/closed toggle, an in-flight animation) — now
attached to the **wrong item**. Use a stable \`id\` from your data instead. (Index is only safe for a static,
never-reordered list.)

**The flip side is a feature:** because state is tied to position+key, **changing a component's key
deliberately resets its state** — the cleanest way to "start fresh" (e.g. remount a form when the selected
record changes). **Performance tie-in:** correct keys let React reuse DOM nodes instead of rebuilding them,
which — with the memoization in the next lessons — is how you keep list updates inside the 16ms frame budget.
*Sources: [React — Render and Commit](https://react.dev/learn/render-and-commit),
[React — Rendering Lists (keys)](https://react.dev/learn/rendering-lists),
[React — Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state).*`,
  },
  {
    id: 'fe-react-equality', module: 'fe-react-depth', order: 2, kind: 'utility', template: 'vanilla',
    title: 'The equality checks behind memo & deps', difficulty: 'medium', tags: ['react', 'memo', 'performance', 'equality'],
    summary: 'React.memo shallow-compares props; hook deps compare with Object.is. Build both and you’ll know exactly why an inline object or arrow prop “breaks” memoization.',
    prompt: `Implement the two comparisons React runs constantly: **\`shallowEqual\`** (what \`React.memo\` uses to decide whether to skip a re-render) and **\`depsChanged\`** (what \`useMemo\`/\`useCallback\`/\`useEffect\` use on their dependency arrays). Both are built on **\`Object.is\`**. Once you've written them, it's obvious why passing a fresh \`{}\` or \`() => {}\` as a prop defeats \`memo\` — a new reference is never \`Object.is\`-equal to the old one.`,
    keyTerms: [
      { term: 'Object.is', def: 'React’s equality primitive. Like `===` but with two fixes: `Object.is(NaN, NaN)` is `true`, and `Object.is(+0, -0)` is `false`. Compares objects/functions by reference, not contents.' },
      { term: 'Shallow equality', def: 'Two objects are shallowly equal if they have the same keys and each value is `Object.is`-equal (one level deep). This is what `React.memo` uses on props by default.' },
      { term: 'Referential equality', def: 'Objects/functions compare by identity: `{} !== {}` and `(() => {}) !== (() => {})`. A new literal each render is a new reference — the root cause of "why does memo still re-render?".' },
      { term: 'Dependency array', def: 'The `[a, b]` you pass to `useMemo`/`useCallback`/`useEffect`. React re-runs the hook when any dep changed by `Object.is` versus the previous render.' },
      { term: 'Why useMemo/useCallback exist', def: 'They give you a STABLE reference across renders (a cached value / a cached function) so that reference can be a safe dependency or a `memo` child’s prop.' },
    ],
    codeNotes: [
      { label: 'shallowEqual — what React.memo runs on props', code: `function shallowEqual(a, b) {\n  if (Object.is(a, b)) return true;\n  if (typeof a !== "object" || !a || typeof b !== "object" || !b) return false;\n  const ka = Object.keys(a), kb = Object.keys(b);\n  return ka.length === kb.length && ka.every((k) => Object.is(a[k], b[k]));\n}`, note: "One level deep. A nested object that was rebuilt still compares unequal." },
      { label: 'depsChanged — what a hook’s deps array runs', code: `function depsChanged(prev, next) {\n  if (prev === null) return true;             // first render\n  if (prev.length !== next.length) return true;\n  return next.some((d, i) => !Object.is(d, prev[i]));\n}`, note: "Object.is per element — same rule as React's internal areHookInputsEqual." },
      { label: 'The reference trap memoization fixes', code: `<Row onPick={() => pick(v)} />  // NEW function every render -> memo(Row) always re-renders\nconst onPick = useCallback(() => pick(v), [v]); // stable ref -> memo(Row) can skip`, note: "Inline {} / () => {} props are the #1 reason 'I used memo but it still re-renders'." },
    ],
    starterCode: { '/index.js': reactEqualityStarter },
    explanation: `**These two tiny functions explain most of React's performance behavior.**

\`React.memo(Component)\` wraps a component so it **skips re-rendering when its props didn't change** — and
"didn't change" means **shallow-equal**: same set of keys, and each value \`Object.is\`-equal to last time.
Because objects and functions compare **by reference**, a prop written inline — \`style={{ }}\`,
\`onClick={() => …}\`, \`items={[…]}\` — is a **brand-new reference on every render**, so \`memo\` sees "changed"
and re-renders anyway. That's the classic *"I added memo and nothing got faster."*

The fix is a **stable reference**: \`useMemo(fn, deps)\` caches a computed **value**, and
\`useCallback(fn, deps)\` caches a **function**, returning the *same reference* until a dependency changes.
"Changes" is decided by \`depsChanged\` — \`Object.is\` on each element of the deps array — the exact rule
React uses internally (\`areHookInputsEqual\`). So the three hooks are one idea: *give me a value/function whose
identity is stable across renders so \`memo\` (or another hook's deps) can trust it.*

**The audit angle** (ties to the AI-review module): memoization is easy to cargo-cult. \`useMemo\` around a
cheap calculation, or \`useCallback\` on a function that isn't a \`memo\` child's prop or a dependency, just
adds overhead and noise. Reach for them when (a) the computation is genuinely expensive, or (b) you need a
stable reference for a \`memo\`'d child or a dependency array — not by reflex. Run the editor to watch
\`shallowEqual\`/\`depsChanged\` return \`true\`/\`false\` on same-vs-new references. *Sources:
[React — memo](https://react.dev/reference/react/memo),
[React — useMemo](https://react.dev/reference/react/useMemo),
[React — useCallback](https://react.dev/reference/react/useCallback).*`,
  },
  {
    id: 'fe-react-memo', module: 'fe-react-depth', order: 3, kind: 'component', template: 'react',
    title: 'memo, useMemo & useCallback in action', difficulty: 'medium', tags: ['react', 'memo', 'performance', 'hooks'],
    summary: 'A live demo: an expensive list stays put while you type, because useMemo caches the value, useCallback keeps the handler stable, and memo skips unchanged rows.',
    prompt: `Three tools, one job — **skip work you already did**. \`useMemo\` caches an **expensive value**, \`useCallback\` caches a **function's identity**, and \`React.memo\` skips re-rendering a child whose props didn't change. Type in the text box: the expensive list neither recomputes nor re-renders (watch each row's render counter). Then try the experiment in the comment — remove \`useCallback\` and every row re-renders on each keystroke.`,
    keyTerms: [
      { term: 'React.memo(Component)', def: 'A wrapper that memoizes a component: it re-renders only when its props change by shallow comparison. Great for pure leaf components that render often with the same props.' },
      { term: 'useMemo(fn, deps)', def: 'Caches the RESULT of `fn()` and only recomputes when a dep changes. Use for genuinely expensive calculations, or to keep an object/array reference stable.' },
      { term: 'useCallback(fn, deps)', def: 'Caches a FUNCTION’s identity between renders (it’s `useMemo` for functions). Needed so a `memo`’d child’s callback prop stays referentially stable.' },
      { term: 'Referential stability', def: 'Keeping the same object/function reference across renders so downstream `memo`/deps comparisons see "unchanged." The reason useMemo/useCallback exist.' },
      { term: 'When NOT to memoize', def: 'Memoization has a cost (memory + comparison). Skip it for cheap renders/values; reach for it when a render is measurably expensive or a stable reference is required downstream.' },
    ],
    codeNotes: [
      { label: 'The three working together', code: `const squares = useMemo(() => buildSquares(n), [n]);   // cache the value\nconst onPick  = useCallback((v) => setPicked(v), []);  // cache the function\nconst Row = memo(function Row({ value, onPick }) { /* … */ }); // skip if props unchanged`, note: "Value stable + function stable => memo(Row)'s props are shallow-equal => it skips." },
      { label: 'Remove useCallback and watch it break', code: `// If onPick is inline instead:\n<Row value={v} onPick={(x) => setPicked(x)} />\n// a NEW function each render -> Row's props differ -> memo can't skip -> every row re-renders.`, note: "This is the live experiment in the editor's trailing comment." },
      { label: 'useMemo for a stable object/array prop', code: `// Not just for expensive math — also to stabilize a reference:\nconst config = useMemo(() => ({ sort: "asc", page }), [page]);\n<List config={config} /> // memo(List) can now skip when page is unchanged`, note: "Without useMemo, {sort,page} is a new object every render." },
    ],
    starterCode: { '/App.js': reactMemoStarter },
    explanation: `**All three are the same idea — cache to avoid redoing work — at three levels:**
\`useMemo\` caches a **value**, \`useCallback\` caches a **function**, \`React.memo\` caches a **rendered
component**. They compose: memoize the expensive value *and* stabilize the handler, and the \`memo\`'d child's
props become shallow-equal across renders, so React skips it.

**Watch the demo.** Typing in the text box updates unrelated state, so \`App\` re-renders — but \`squares\` is
the same array reference (\`useMemo\`, \`n\` unchanged) and \`onPick\` is the same function (\`useCallback\`), so
each memoized \`Row\` sees identical props and its render counter **stays put**. Click **+1**: \`n\` changes,
\`useMemo\` recomputes, and only the new row renders. Delete \`useCallback\` (see the trailing comment) and every
row re-renders on every keystroke — the classic memo-defeated-by-a-new-function bug from the previous lesson.

**The senior nuance — don't over-memoize.** Each of these adds memory and a comparison on every render; wrap
them around *cheap* work and you can make things slower and harder to read. The rule: memoize when the
computation is **measurably expensive**, or when you need a **stable reference** for a \`memo\`'d child or a
dependency array. (React's own guidance leans this way, and the React Compiler aims to automate much of it.)
This is exactly the kind of thing to flag when auditing AI-generated components: \`useCallback\`/\`useMemo\`
sprinkled everywhere is a smell, not a win. *Sources:
[React — memo](https://react.dev/reference/react/memo),
[React — useMemo](https://react.dev/reference/react/useMemo),
[React — useCallback](https://react.dev/reference/react/useCallback).*`,
  },
  {
    id: 'fe-react-custom-hooks', module: 'fe-react-depth', order: 4, kind: 'component', template: 'react',
    title: 'Custom hooks', difficulty: 'medium', tags: ['react', 'hooks', 'reuse'],
    summary: 'Extract stateful logic into a reusable useXxx function. Same single-responsibility instinct from SOLID, applied to React.',
    prompt: `A **custom hook** is just a function named \`useSomething\` that calls other hooks. It lets you **extract and reuse stateful logic** — timers, toggles, subscriptions, data fetching — without copy-paste, and *without* sharing state between components (each call gets its own state). The demo defines \`useToggle\` and \`useDebouncedValue\`; this is the **single-responsibility** instinct from the SOLID lesson, applied to React.`,
    keyTerms: [
      { term: 'Custom hook', def: 'A JS function whose name starts with `use` and that calls other hooks. It packages reusable stateful logic. Not markup — it returns values/handlers, not JSX.' },
      { term: 'Rules of Hooks', def: 'Call hooks only at the TOP LEVEL (never in loops/conditions/nested functions) and only from React components or other hooks. The `use` prefix is how React and the linter enforce this.' },
      { term: 'Logic reuse, not state sharing', def: 'Each call to a custom hook gets its own independent state. `useToggle()` in two components = two separate toggles. To SHARE state, lift it up or use Context.' },
      { term: 'Encapsulation', def: 'A custom hook hides its internal state/effects behind a small return value — the same encapsulation idea as a class, but for stateful function logic.' },
      { term: 'Composability', def: 'Hooks call hooks: a custom hook can use `useState`, `useEffect`, even other custom hooks — so you build complex behavior from small, tested pieces.' },
    ],
    codeNotes: [
      { label: 'A custom hook is a function that uses hooks', code: `function useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = useCallback(() => setOn((v) => !v), []);\n  return [on, toggle];        // return values + handlers, never JSX\n}\nconst [open, toggleOpen] = useToggle();`, note: "Naming it useX lets React/lint apply the Rules of Hooks." },
      { label: 'Wrap an effect for reuse (debounce)', code: `function useDebouncedValue(value, delay = 500) {\n  const [v, setV] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setV(value), delay);\n    return () => clearTimeout(id);   // cancel on change = the debounce\n  }, [value, delay]);\n  return v;\n}`, note: "The tricky timer + cleanup lives in ONE place, reused everywhere." },
      { label: 'Each call is independent state', code: `function A() { const [on] = useToggle(); }  // its own on\nfunction B() { const [on] = useToggle(); }  // a DIFFERENT on\n// Hooks reuse LOGIC, not state. To share state, lift it or use Context.`, note: "A common misconception: custom hooks do not create shared/global state." },
    ],
    starterCode: { '/App.js': reactHooksStarter },
    explanation: `**Why custom hooks matter:** before them, reusing stateful logic (a subscription, a debounce,
a form field's behavior) meant awkward patterns or copy-paste. A custom hook packages that logic behind a
clean API — \`const [on, toggle] = useToggle()\` — so the *component* stays focused on rendering. That's the
**single-responsibility principle** from the paradigms module made concrete: the data/effect logic lives in
the hook; the JSX lives in the component.

**Two rules keep hooks reliable.** (1) **Call them at the top level only** — never inside a loop, condition,
or nested function — because React tracks hook state by call *order*, and a conditional call would shift the
order and corrupt state. (2) **Call them only from React functions or other hooks.** The \`use\` naming
convention is what lets React and the ESLint plugin *enforce* both rules automatically.

**The key mental model — reuse logic, not state.** Every call to a custom hook gets its **own independent
state**; \`useToggle()\` in two places gives two separate toggles. Custom hooks are for sharing *behavior*, not
*data*. To share data across components you still lift state up or use Context. In the demo, \`useToggle\`
drives the theme and \`useDebouncedValue\` (built on \`useEffect\` + cleanup, reusing the debounce idea from the
JS-core module) delays the "debounced" readout — two small, composable, independently reusable pieces.
*Sources: [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks),
[React — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).*`,
  },
  {
    id: 'fe-react-forms', module: 'fe-react-depth', order: 5, kind: 'component', template: 'react',
    title: 'Controlled vs uncontrolled forms', difficulty: 'medium', tags: ['react', 'forms', 'state'],
    summary: 'Controlled inputs make React state the single source of truth; one handler drives many fields. Uncontrolled inputs (via refs) suit files and simple cases.',
    prompt: `A **controlled** input keeps its value in React state (\`value\` + \`onChange\`), so state is the **single source of truth** — easy to validate, transform, and reset. An **uncontrolled** input lets the DOM hold the value and you read it via a **ref** on submit. The demo is controlled for text/select — with **one \`onChange\` handler driving many fields** via the input's \`name\` — and uncontrolled for the file input (which must be).`,
    keyTerms: [
      { term: 'Controlled component', def: 'An input whose value comes from React state (`value={x}` + `onChange`). React is the single source of truth — the DOM shows exactly what state says.' },
      { term: 'Uncontrolled component', def: 'An input that keeps its own value in the DOM; you read it with a `ref` when needed (often on submit). Use `defaultValue` for its initial value.' },
      { term: 'One handler, many fields', def: 'Give each input a `name` and use `setForm(f => ({ ...f, [e.target.name]: e.target.value }))` — a single `onChange` and an immutable, computed-key update for the whole form.' },
      { term: 'Single source of truth', def: 'Form data lives in one place (state). Validation, formatting, conditional fields, and reset all read/write that one object — no scraping the DOM.' },
      { term: 'When to go uncontrolled', def: '`<input type="file">` is always uncontrolled; also fine for very simple or integration-with-non-React cases. React docs: prefer controlled for anything you validate or transform.' },
    ],
    codeNotes: [
      { label: 'Controlled: state is the source of truth', code: `const [form, setForm] = useState({ name: "", email: "" });\nconst update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));\n<input name="name" value={form.name} onChange={update} />\n<input name="email" value={form.email} onChange={update} />`, note: "One handler + name attribute + immutable computed-key update = the whole form." },
      { label: 'Uncontrolled: read from a ref on submit', code: `const fileRef = useRef(null);\n<input type="file" ref={fileRef} />           // DOM holds the value\n<input defaultValue="hi" ref={nameRef} />     // defaultValue, not value\nconst onSubmit = () => console.log(fileRef.current.files[0]);`, note: "File inputs are ALWAYS uncontrolled; use defaultValue for others." },
      { label: 'Controlled unlocks derived UI for free', code: `<input value={q} onChange={(e) => setQ(e.target.value)} />\n<button disabled={!q.trim()}>Search</button>   // validate from state\n<p>{q.length}/100</p>                            // live counter`, note: "Because the value is in state, validation/counters/format are trivial." },
    ],
    starterCode: { '/App.js': reactFormsStarter },
    explanation: `**Controlled is the React default and the one to reach for.** The input's \`value\` is bound to
state and every keystroke flows through \`onChange\` back into state — so the DOM always mirrors state exactly.
That single source of truth is what makes **validation, formatting, conditional fields, disabling submit, and
reset** trivial: they all just read and write one \`form\` object. The scaling trick in the demo is **one
\`onChange\` for the whole form** — give each field a \`name\`, then
\`setForm(f => ({ ...f, [e.target.name]: e.target.value }))\` updates the right key immutably (note the
computed-key + spread — the immutability lesson again).

**Uncontrolled inputs** let the DOM keep the value; you grab it with a \`ref\` when you need it (usually on
submit), and set initial values with \`defaultValue\` (not \`value\`). They're less code for trivial forms and
are **required** for \`<input type="file">\` (its value can't be set programmatically for security). React's
guidance: prefer **controlled** for anything you validate or transform, and use **uncontrolled** for
file inputs or quick integrations.

**Performance & audit notes:** controlled forms re-render the component on every keystroke — fine for normal
forms, but for a huge form on a hot path you'd debounce (the custom-hook lesson) or isolate fields. And a
frequent AI-generated bug here is a **half-controlled input** — passing \`value\` without \`onChange\`, which
makes the field read-only and logs a React warning. When you review generated form code, check that every
\`value\` has a matching \`onChange\` (or is intentionally \`defaultValue\`). *Sources:
[React — Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state),
[React — Controlling an input with a state variable](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).*`,
  },
]
