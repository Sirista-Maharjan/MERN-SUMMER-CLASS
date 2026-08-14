// --- Timezone-safe date handling -------------------------------------
//
// Habit completions are calendar-day concepts ("I did this on July 28"),
// not precise instants. The old version of this file converted every
// date through toISOString(), which reads UTC components — so a habit
// ticked at 11pm in a timezone behind UTC could be logged as "tomorrow"
// on the server, and streaks would silently break at day boundaries.
//
// Fix: completions are stored anchored to UTC midnight of the exact
// calendar-date string the user's browser reported at completion time
// (see api/habitsApi.js, which sends `localDate`). Reading them back
// with UTC getters always returns that same exact string, no matter
// what timezone the reader is in. "Today", by contrast, must always be
// read using LOCAL getters, since that's the day the user is actually
// experiencing right now. These two rules are what keep frontend and
// backend in agreement.

// Reads a stored (UTC-midnight-anchored) completion date back into its
// original 'YYYY-MM-DD' string.
export const toStoredDateString = (date) => new Date(date).toISOString().split('T')[0]

// The viewer's real "today", in their own local timezone.
const toLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayISO = () => toLocalDateString(new Date())

export const isCompletedOn = (completions = [], dateISO) =>
  completions.some((c) => toStoredDateString(c) === dateISO)

export const isCompletedToday = (completions = []) =>
  isCompletedOn(completions, todayISO())

// Consecutive-day streak counting back from today (local calendar days).
// If today isn't completed yet, the streak shown is 0 (it resumes once ticked).
export const computeStreak = (completions = []) => {
  const completedDays = new Set(completions.map(toStoredDateString))
  let streak = 0
  const cursor = new Date()

  if (!completedDays.has(toLocalDateString(cursor))) return 0

  while (completedDays.has(toLocalDateString(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

// Last 7 local calendar days (oldest -> newest) as { date, label, completed }.
export const getLast7Days = (completions = []) => {
  const completedDays = new Set(completions.map(toStoredDateString))
  const days = []

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = toLocalDateString(d)
    days.push({
      date: iso,
      label: d.toLocaleDateString('en-US', { weekday: 'short' })[0],
      completed: completedDays.has(iso),
    })
  }

  return days
}
