import apiClient from './axiosClient'
import { todayISO } from '../utils/streak'

export const fetchHabits = async () => {
  const { data } = await apiClient.get('/habits')
  return data
}

export const createHabit = async ({ name, frequency }) => {
  const { data } = await apiClient.post('/habits', { name, frequency })
  return data
}

// Returns { data } on success, or { error: 'duplicate' } if the habit
// was already completed today (backend returns 409 for item 6, Week 3).
// Sends the browser's local calendar date so "today" always means the
// user's actual today, not the server's UTC day (Week 6 item 5).
export const completeHabit = async (id) => {
  try {
    const { data } = await apiClient.post(`/habits/${id}/complete`, {
      localDate: todayISO(),
    })
    return { data }
  } catch (err) {
    if (err.response?.status === 409) {
      return { error: 'duplicate' }
    }
    throw err
  }
}

export const deleteHabit = async (id) => {
  await apiClient.delete(`/habits/${id}`)
}

export const fetchHabitHistory = async (id) => {
  const { data } = await apiClient.get(`/habits/${id}/history`)
  return data
}
