import { getLast7Days } from '../utils/streak'

export default function MiniCalendar({ completions }) {
  const days = getLast7Days(completions)

  return (
    <div className="flex items-center gap-2 mt-3">
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-500">{day.label}</span>
          <div
            title={day.date}
            className={`w-3.5 h-3.5 rounded-full border-2 ${
              day.completed
                ? 'bg-green-800 border-green-800'
                : 'bg-transparent border-gray-300'
            }`}
          />
        </div>
      ))}
    </div>
  )
}
