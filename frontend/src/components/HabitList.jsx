import HabitCard from './HabitCard'

export default function HabitList({ habits, onToggleToday, onDeleteHabit }) {
  if (!habits.length) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No habits yet. Add one to get started.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDeleteHabit={onDeleteHabit}
        />
      ))}
    </div>
  )
}
