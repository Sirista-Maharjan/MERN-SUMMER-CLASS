export default function HabitSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          </div>
          <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div key={d} className="w-3.5 h-3.5 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
