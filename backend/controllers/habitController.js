import Habit from '../models/Habit.js'
import { toDateOnly, resolveLocalDate } from '../utils/streak.js'

// Week 5 item 3: every query is scoped to req.userId (set by the auth
// middleware), so users only ever see/modify their own habits.

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: 1 })
    res.json(habits)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body

    if (!name || !frequency) {
      return res.status(400).json({ message: 'name and frequency are required' })
    }
    if (!['daily', 'weekly'].includes(frequency)) {
      return res.status(400).json({ message: 'frequency must be "daily" or "weekly"' })
    }

    const habit = await Habit.create({ name, frequency, userId: req.userId, completions: [] })
    res.status(201).json(habit)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    // Week 6 item 5 (timezone fix): trust the client's local calendar
    // date rather than the server's own UTC "today". The server may run
    // in a different timezone than the user (e.g. Render defaults to
    // UTC), so computing "today" server-side caused completions logged
    // near midnight to occasionally land on the wrong day / break
    // streaks. The date is stored anchored to UTC midnight of that
    // string so it reads back identically everywhere.
    const today = resolveLocalDate(req.body.localDate)

    const alreadyCompleted = habit.completions.some((c) => toDateOnly(c) === today)
    if (alreadyCompleted) {
      return res.status(409).json({ message: 'Habit already completed today' })
    }

    habit.completions.push(new Date(`${today}T00:00:00.000Z`))
    await habit.save()
    res.status(200).json(habit)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getHabitHistory = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    res.json(habit.completions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
