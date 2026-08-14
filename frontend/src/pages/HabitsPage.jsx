import { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HabitList from '../components/HabitList.jsx'
import AddHabitForm from '../components/AddHabitForm.jsx'
import HabitSkeleton from '../components/HabitSkeleton.jsx'
import AICoach from '../components/AICoach.jsx'
import { fetchHabits, createHabit, completeHabit, deleteHabit as deleteHabitApi } from '../api/habitsApi.js'

export default function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [habits, setHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch only this user's habits — the JWT is attached automatically
  // by the axios client, and the backend scopes the query to req.userId.
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await fetchHabits()
        setHabits(data)
      } catch (err) {
        setError('Could not load habits. Is the backend running?')
      } finally {
        setIsLoading(false)
      }
    }

    loadHabits()
  }, [])

  const toggleToday = async (habitId) => {
    const result = await completeHabit(habitId)

    if (result.error === 'duplicate') {
      return
    }

    setHabits((prev) =>
      prev.map((habit) => (habit._id === habitId ? result.data : habit))
    )
  }

  const addHabit = async ({ name, frequency }) => {
    const newHabit = await createHabit({ name, frequency })
    setHabits((prev) => [...prev, newHabit])
  }

  const deleteHabit = async (habitId) => {
    await deleteHabitApi(habitId)
    setHabits((prev) => prev.filter((habit) => habit._id !== habitId))
  }

  return (
    <>
      <Header />

      <div className="min-h-[75vh] px-6 py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Habits</h1>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-green-800 hover:bg-green-700 text-md px-4 py-2 rounded-md"
          >
            + Add New
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <AICoach />

        {isLoading ? (
          <HabitSkeleton />
        ) : (
          <HabitList habits={habits} onToggleToday={toggleToday} onDeleteHabit={deleteHabit} />
        )}

        <AddHabitForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addHabit}
        />
      </div>

      <Footer />
    </>
  )
}
