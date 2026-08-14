import { useState } from 'react'

// Week 1: modal shell + form fields only. Submitting just closes the
// modal for now — actually adding the habit to state is wired up in
// Week 2 via the onAdd prop.
export default function AddHabitForm({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('daily')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    if (onAdd) {
      onAdd({ name: name.trim(), frequency })
    }

    setName('')
    setFrequency('daily')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add a Habit</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1" htmlFor="habit-name">
              Habit name
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meditate"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-green-800"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1" htmlFor="habit-frequency">
              Frequency
            </label>
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-green-800"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-green-800 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
