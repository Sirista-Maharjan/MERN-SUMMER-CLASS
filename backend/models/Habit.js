import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    frequency: { type: String, enum: ['daily', 'weekly'], required: true },
    completions: { type: [Date], default: [] },
    userId: { type: String, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Habit', habitSchema)
