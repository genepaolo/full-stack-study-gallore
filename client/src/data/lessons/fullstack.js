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
]
