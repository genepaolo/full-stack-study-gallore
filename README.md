# full-stack-gallore 🖼️

A self-help study app that encapsulates the [Frontend Interview Handbook](https://www.frontendinterviewhandbook.com/).
Browse the components, JS utilities, quizzes and CSS patterns you'd be tested on — each paired with
a **live, editable code block** and a **reset** button so you can see exactly how things interact.

## Features

- **Live-editable code** for every challenge (Sandpack): edit the source, watch the preview update,
  hit **Reset** to restore the starter.
- Four categories to start: **UI components**, **JS utilities**, **Quiz/trivia**, **CSS & layout**.
- **Progress tracking** persisted to MongoDB Atlas.
- Polished, responsive, light/dark UI.

## Getting started

```bash
git clone https://github.com/genepaolo/full-stack-study-gallore.git
cd full-stack-study-gallore
npm install
npm run dev:client            # http://localhost:5173  (no database needed)
```

Progress is saved locally in your browser — **no server or database required**. Full setup,
requirements, env vars, and troubleshooting: **[SETUP.md](./SETUP.md)**.

If a dev port ever gets stuck: `npm run kill`.

## Add a challenge

Append one object to a file in `client/src/data/challenges/`. See [CLAUDE.md](./CLAUDE.md) for the shape.

## Stack

React + Vite + Tailwind · Express + Mongoose · MongoDB Atlas · Sandpack · npm workspaces.
