import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    challengeId: { type: String, required: true },
    status: { type: String, enum: ['complete', 'incomplete'], default: 'complete' },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// One record per (user, challenge).
progressSchema.index({ userId: 1, challengeId: 1 }, { unique: true })

export const Progress = mongoose.model('Progress', progressSchema)
