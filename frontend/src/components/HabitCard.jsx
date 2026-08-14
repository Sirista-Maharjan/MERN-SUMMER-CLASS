import { isCompletedToday, computeStreak } from '../utils/streak'
import MiniCalendar from './MiniCalendar'

// Week 4: streak and today's-tick state are both computed live from
// habit.completions (which now comes straight from MongoDB via App's
// axios fetch), instead of being stored/recalculated separately.
export default function HabitCard({ habit, onToggleToday, onDeleteHabit }) {
  const completedToday = isCompletedToday(habit.completions)
  const streak = computeStreak(habit.completions)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{habit.frequency}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDeleteHabit?.(habit._id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
            aria-label={`Delete ${habit.name}`}
          >
            ×
          </button>

          <button
            type="button"
            onClick={() => onToggleToday?.(habit._id)}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors ${
              completedToday
                ? 'bg-green-800 border-green-800 text-white'
                : 'border-gray-300 text-gray-500 hover:border-green-800'
            }`}
            aria-label={completedToday ? 'Already completed today' : 'Mark today complete'}
          >
            ✓
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm">
        <span className="text-green-800 font-bold">🔥 {streak}</span>
        <span className="text-gray-500">day streak</span>
      </div>

      <MiniCalendar completions={habit.completions} />
    </div>
  )
}
