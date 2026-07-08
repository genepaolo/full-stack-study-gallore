---
type: concept
title: "MongoDB Atlas"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [concept, backend, setup]
---

# MongoDB Atlas

Cloud-hosted MongoDB. Chosen so no local install is needed (free M0 tier). → [[decisions]] #3.

## Setup (owner TODO)
1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Add a database user + allow your IP (or 0.0.0.0/0 for dev).
3. Copy the connection string into `server/.env` as `MONGO_URI` (see `server/.env.example`).
4. Restart `npm run dev` — the server logs `✅ Connected to MongoDB`.

Until then the API runs without persistence and the app shows a "Local" sync indicator.
See [[server]] for the no-DB fallback behavior.
