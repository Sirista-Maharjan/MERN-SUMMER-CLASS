import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser } from '../api/authApi'
import { getToken, setToken, clearToken } from '../api/axiosClient'

const USER_KEY = 'habit_tracker_user'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on first load, so a page refresh
  // doesn't log the user out.
  useEffect(() => {
    const token = getToken()
    const storedUser = localStorage.getItem(USER_KEY)
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const persistSession = ({ token, user: loggedInUser }) => {
    setToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  const login = async (credentials) => {
    const result = await loginUser(credentials)
    persistSession(result)
  }

  const register = async (details) => {
    const result = await registerUser(details)
    persistSession(result)
  }

  // Item 5: logout clears the token (and cached user info).
  const logout = () => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
