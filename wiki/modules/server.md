---
type: module
title: "server"
status: active
created: 2026-07-07
updated: 2026-07-07
tags: [module, backend]
---

# server

Express + Mongoose API. Entry `server/src/index.js`. Port 5000. CORS open; JSON body parsing;
`x-user-id` header → `req.userId`.

## Routes (under /api)
- `GET /api/health` → `{ ok, db }`
- `GET /api/progress` → rows for user (`[]` if no DB)
- `POST /api/progress { challengeId, status }` → upsert/delete
- `GET/PUT /api/notes/:challengeId`

## Models
- `Progress` — unique `(userId, challengeId)`, status enum.
- `Note` — unique `(userId, challengeId)`, body text.

## No-DB fallback
`db.js#connectDB` warns and continues if `MONGO_URI` is unset/placeholder or connection fails.
Routes then return empty reads and `persisted:false` (202) writes, so the frontend keeps working.
→ see [[MongoDB Atlas]] for setup.

## Related
[[client]], [[decisions]].
