// Completions are stored anchored to UTC midnight of a calendar-date
// string (see habitController.completeHabit), so reading them back with
// toISOString() always returns that exact original date, regardless of
// server timezone. See frontend/src/utils/streak.js for the full
// rationale (Week 6 item 5 — timezone fix).
export const toDateOnly = (date) => new Date(date).toISOString().split('T')[0]

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Validates a client-supplied local date string; falls back to the
// server's own UTC date if the client didn't send one (e.g. requests
// made directly via curl/Postman rather than the app).
export const resolveLocalDate = (candidate) => {
  if (typeof candidate === 'string' && LOCAL_DATE_RE.test(candidate)) {
    return candidate
  }
  return toDateOnly(new Date())
}

// Consecutive-day streak counting back from today. Mirrors the frontend
// implementation so the AI coach prompt (Week 7) sees the same numbers
// the user sees in the UI.
export const computeStreak = (completions = [], todayLocalISO) => {
  const completedDays = new Set(completions.map(toDateOnly))
  const today = todayLocalISO || toDateOnly(new Date())
  let streak = 0
  const cursor = new Date(`${today}T00:00:00.000Z`)

  const cursorKey = () => cursor.toISOString().split('T')[0]

  if (!completedDays.has(cursorKey())) return 0

  while (completedDays.has(cursorKey())) {
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}
