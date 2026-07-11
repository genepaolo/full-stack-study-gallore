# full-stack-gallore 🖼️

[![CI](https://github.com/genepaolo/full-stack-study-gallore/actions/workflows/ci.yml/badge.svg)](https://github.com/genepaolo/full-stack-study-gallore/actions/workflows/ci.yml)

A progressive **full-stack interview study guide** — a curriculum that ramps from semantic HTML all the
way to system design. Inspired by the [Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/)
and extended across the whole stack. Every lesson pairs a plain-English explanation + key terms with a
**live, editable code block** (Sandpack) and a **Reset** button, so you can read the idea and then poke at
the code to see exactly how it behaves.

## Highlights

- **Structured curriculum** — **4 tracks → 22 modules → ~98 lessons**, ordered on a beginner → pro ramp.
- **Live-editable code** for hands-on lessons: edit the source, watch the preview update below the editor,
  hit **Reset** to restore the starter. User code runs in an isolated Sandpack iframe (see [SECURITY.md](./SECURITY.md)).
- **Offline-first progress** — saved to your browser's `localStorage`, so it works with **no account and no
  database**. Mark modules as learned and watch the per-track and overall progress bars fill in the sidebar.
- **Test-enforced correctness** — a Vitest suite (170 tests) validates the content; "taught-logic" tests
  actually execute the reference code in each hands-on lesson, so a regression fails CI.
- **Polished & responsive** — light/dark themes, GSAP motion (reduced-motion-safe), and a mobile nav drawer.

## What's covered

| Track | Modules |
|---|---|
| 🎨 **Frontend** | HTML & CSS foundations · CSS layout/responsive · JavaScript core · **OOP & functional programming** · React essentials · UI component challenges · **TypeScript** · **front-end performance** · **React depth & performance** |
| 🛠️ **Backend** | Node & Express · REST API design · Data & MongoDB · Auth & security · **GraphQL basics** |
| 🔗 **Full-Stack** | Connecting frontend & backend · data fetching & state · deployment & DevOps · **web security (SOP/CORS, XSS, CSRF, injection, CSP, OWASP Top 10)** |
| 🚀 **Advanced** | Algorithms & data structures (NeetCode taxonomy) · Snake game project · system design (frontend + backend) · AI in the dev workflow (incl. auditing generated code) |

Content is treated as study material and verified against primary/authoritative sources (MDN, official docs,
OWASP, the Frontend Interview Handbook) before it ships — see [CONTENT.md](./CONTENT.md).

## Getting started

```bash
git clone https://github.com/genepaolo/full-stack-study-gallore.git
cd full-stack-study-gallore
npm install
npm run dev:client            # http://localhost:5173  (no database needed)
```

Progress is saved locally in your browser — **no server or database required**; the Express + Mongo backend
is optional. Full setup, requirements, env vars, and troubleshooting: **[SETUP.md](./SETUP.md)**.

If a dev port ever gets stuck: `npm run kill`.

## Add a lesson

Append one object to `client/src/data/lessons/<track>.js` — it flows automatically into the sidebar, module
page, prev/next navigation, and the glossary. The lesson shape (`id`, `module`, `kind`, `starterCode`,
`keyTerms`, `codeNotes`, `explanation`, …) is documented in [CLAUDE.md](./CLAUDE.md); the architecture is in
[DESIGN.md](./DESIGN.md).

```bash
npm test                      # Vitest — run before committing content changes
npm run build                 # production build of the client
```

## Stack

React 18 + Vite + Tailwind + GSAP · Sandpack (live code) · optional Express + Mongoose + MongoDB Atlas ·
npm workspaces (`client`, `server`).
