import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB, isConnected } from './db.js'
import progressRoutes from './routes/progress.js'
import notesRoutes from './routes/notes.js'

const app = express()
app.use(cors())
app.use(express.json())

// Identify the personal user via the x-user-id header (set by the client).
app.use((req, res, next) => {
  req.userId = req.header('x-user-id') || 'anonymous'
  next()
})

app.get('/api/health', (req, res) => res.json({ ok: true, db: isConnected() }))
app.use('/api/progress', progressRoutes)
app.use('/api/notes', notesRoutes)

// Central error handler.
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 5000

connectDB().finally(() => {
  app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`))
})
