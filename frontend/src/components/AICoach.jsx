import { useState } from 'react'
import { getCoachingTips } from '../api/aiApi'

// Week 7: "Get AI Coaching" button + styled motivational card, with
// loading and error states (items 3, 4, 5).
export default function AICoach() {
  const [tips, setTips] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetCoaching = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getCoachingTips()
      setTips(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach your AI coach. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleGetCoaching}
        disabled={isLoading}
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-md disabled:opacity-60"
      >
        <span role="img" aria-label="sparkles">✨</span>
        {isLoading ? 'Thinking of tips…' : 'Get AI Coaching'}
      </button>

      {isLoading && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-md p-5 animate-pulse">
          <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-3 w-full bg-gray-100 rounded mb-2" />
          <div className="h-3 w-5/6 bg-gray-100 rounded mb-2" />
          <div className="h-3 w-2/3 bg-gray-100 rounded" />
        </div>
      )}

      {!isLoading && error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}

      {!isLoading && !error && tips && (
        <div className="mt-4 bg-gradient-to-br from-green-800 to-green-900 text-white rounded-lg shadow-md p-5">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span role="img" aria-label="sparkles">🌱</span> Your Habit Coach
          </h3>
          <p className="whitespace-pre-line text-green-50 leading-relaxed">{tips}</p>
        </div>
      )}
    </div>
  )
}
