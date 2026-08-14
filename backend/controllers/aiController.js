import Habit from '../models/Habit.js'
import { getHabitSummary } from '../config/grok.js'
import { computeStreak, toDateOnly } from '../utils/streak.js'

const GEMINI_MODEL = 'gemini-3.6-flash'

// Week 7 item 1 + 2: gathers the user's habit names + current streaks
// and sends them to Gemini with a habit-coach prompt.
export const getCoachingTips = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId })

    if (!habits.length) {
      return res.status(200).json({
        tips: "You don't have any habits yet — add one on the dashboard and check back in for personalized coaching!",
      })
    }

    const today = toDateOnly(new Date())
    const summary = habits.map((habit) => ({
      name: habit.name,
      frequency: habit.frequency,
      streak: computeStreak(habit.completions, today),
    }))

    const habitList = summary
      .map((h) => `- ${h.name} (${h.frequency}): ${h.streak}-day streak`)
      .join('\n')

    const prompt = `You are a habit coach. Review these habits and give motivational tips based on the user's current streaks. Be warm, specific, and encouraging. Respond with 3 to 5 short tips as plain text lines (no markdown headers or asterisks), each 1-2 sentences.

Habits:
${habitList}`

   
    const result = await getHabitSummary(prompt);
res.status(200).json({ tips: result })
  } catch (err) {
    console.error('AI coach error:', err.message)
    res.status(500).json({ message: 'Failed to get AI coaching tips. Please try again.' })
  }
}
