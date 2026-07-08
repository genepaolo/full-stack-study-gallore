# Setup & Requirements

How to get **full-stack-gallore** running on a fresh machine. The study app (frontend) runs fully
standalone — **no database or server required**. The backend is optional and only needed for future
server-side features.

---

## 1. Requirements

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | ≥ 18 (tested on 24) | Includes `npm` ≥ 9. Get it from https://nodejs.org |
| **npm** | ≥ 9 | Ships with Node. Uses npm **workspaces**. |
| **git** | any recent | To clone. |
| **MongoDB Atlas** | free M0 tier | **Optional** — only if you run the backend. https://www.mongodb.com/cloud/atlas |

A modern browser (Chrome/Edge/Firefox/Safari). No global installs needed — everything is local to the repo.

Check your versions:
```bash
node -v      # v18+  (v24 recommended)
npm -v       # 9+
git --version
```

---

## 2. Clone & install

```bash
git clone https://github.com/genepaolo/full-stack-study-gallore.git
cd full-stack-study-gallore
npm install            # installs all workspaces (client + server)
```

---

## 3. Run

**Frontend only (recommended — no DB needed).** Progress is saved in your browser's `localStorage`.
```bash
npm run dev:client     # http://localhost:5173
```

**Full stack (client + optional API).**
```bash
npm run dev            # client :5173, server :5000
```

Stop any dev server with **Ctrl+C**. If a port is ever stuck, free it with:
```bash
npm run kill
```

---

## 4. Environment variables (optional — backend only)

There are **no secrets required** to use the app. Only configure this if you run the Express server:

```bash
cp .env.example server/.env       # then edit server/.env
```

`server/.env` (git-ignored — never commit it):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | no | MongoDB Atlas connection string. Unset ⇒ API runs without persistence and logs a clear message. |
| `PORT` | no | API port (default `5000`). |

> ⚠️ Never commit real credentials. Only `*.env.example` (placeholders) is tracked. Anything
> prefixed `VITE_` in a client `.env` is **bundled into the public frontend** — never put secrets there.

---

## 5. Tests

```bash
npm test        # runs the Vitest suite (client/tests/)
```

Covers curriculum/content integrity, navigation + glossary helpers, that every taught code snippet
compiles, that the key taught utilities behave correctly, and the offline progress logic. See
[CONTENT.md](./CONTENT.md) for how content correctness is enforced.

> Dev-only advisory: `npm audit` flags esbuild's dev-server (GHSA-67mh-4wv8-2f99) via vite/vitest.
> It affects only the local dev server, never the static production build. Don't `audit fix --force`
> (it breaks the vite 6 / vitest 2 toolchain).

## 6. Build for production

```bash
npm run build          # outputs client/dist (static, deployable to any CDN/static host)
```

Deploy `client/dist` to Vercel/Netlify/GitHub Pages/S3. If you also deploy the API, set `MONGO_URI`
in the host's environment (not a committed file), enable HTTPS, and restrict CORS to your domain.

---

## 7. Project layout

```
client/   React + Vite + Tailwind + GSAP + Sandpack (the study guide UI)
server/   Express + Mongoose API (optional)
scripts/  kill-dev.mjs (frees stuck dev ports)
wiki/     Obsidian vault — project memory / decisions (safe to read; contains no secrets)
```

See [CLAUDE.md](./CLAUDE.md) for conventions and how to add a lesson.

---

## 8. Troubleshooting

- **`npm run dev:client` fails with "unauthorized access" / EACCES / "Port 5173 is in use"** — a
  previous dev server is still holding the port. Run `npm run kill`, then retry. (A `predev` hook
  also auto-frees the port on each run.) On Windows, don't use Git Bash `pkill` — it doesn't kill
  native `node.exe`.
- **Blank page / stale content** — hard-refresh the browser (Ctrl+Shift+R).
- **Reset your progress** — open the app's **Progress** tab → **Reset progress**.
