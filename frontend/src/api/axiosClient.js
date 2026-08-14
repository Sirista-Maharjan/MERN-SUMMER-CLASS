import axios from 'axios'

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'habit_tracker_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const apiClient = axios.create({ baseURL: API_ROOT })

// Attach "Authorization: Bearer <token>" to every outgoing request, if
// we have one. This is what satisfies the auth-middleware requirement
// on the frontend side — protected routes just work once logged in.
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
