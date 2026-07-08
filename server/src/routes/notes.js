import { Router } from 'express'
import { Note } from '../models/Note.js'
import { isConnected } from '../db.js'

const router = Router()

// GET /api/notes/:challengeId
router.get('/:challengeId', async (req, res, next) => {
  if (!isConnected()) return res.json({ challengeId: req.params.challengeId, body: '' })
  try {
    const note = await Note.findOne({ userId: req.userId, challengeId: req.params.challengeId }).lean()
    res.json({ challengeId: req.params.challengeId, body: note?.body || '' })
  } catch (err) {
    next(err)
  }
})

// PUT /api/notes/:challengeId { body }
router.put('/:challengeId', async (req, res, next) => {
  const { body = '' } = req.body || {}
  if (!isConnected()) return res.status(202).json({ challengeId: req.params.challengeId, body, persisted: false })
  try {
    await Note.findOneAndUpdate(
      { userId: req.userId, challengeId: req.params.challengeId },
      { body },
      { upsert: true },
    )
    res.json({ challengeId: req.params.challengeId, body })
  } catch (err) {
    next(err)
  }
})

export default router
