import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    challengeId: { type: String, required: true },
    body: { type: String, default: '' },
  },
  { timestamps: true },
)

noteSchema.index({ userId: 1, challengeId: 1 }, { unique: true })

export const Note = mongoose.model('Note', noteSchema)
