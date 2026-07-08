import { Router } from 'express'
import { Progress } from '../models/Progress.js'
import { isConnected } from '../db.js'

const router = Router()

// GET /api/progress — all progress rows for the current user.
router.get('/', async (req, res, next) => {
  if (!isConnected()) return res.json([]) // no DB: client falls back to its local cache
  try {
    const rows = await Progress.find({ userId: req.userId }).lean()
    res.json(rows.map((r) => ({ challengeId: r.challengeId, status: r.status })))
  } catch (err) {
    next(err)
  }
})

// POST /api/progress { challengeId, status } — upsert or remove.
router.post('/', async (req, res, next) => {
  const { challengeId, status } = req.body || {}
  if (!challengeId) return res.status(400).json({ error: 'challengeId required' })
  if (!isConnected()) return res.status(202).json({ challengeId, status, persisted: false })
  try {
    if (status === 'incomplete') {
      await Progress.deleteOne({ userId: req.userId, challengeId })
      return res.json({ challengeId, status: 'incomplete' })
    }
    await Progress.findOneAndUpdate(
      { userId: req.userId, challengeId },
      { status: 'complete', completedAt: new Date() },
      { upsert: true, new: true },
    )
    res.json({ challengeId, status: 'complete' })
  } catch (err) {
    next(err)
  }
})

export default router
