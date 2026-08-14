import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Item 4: React Router protection — wrap any private page in this.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null // avoid a login-page flash while session restores

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
