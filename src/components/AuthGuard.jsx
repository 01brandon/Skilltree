// auth guard - redirects unauthenticated users to login
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthGuard({ children }) {
  var { user, loading } = useAuth()
  var location          = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    // pass current path so login can redirect back after auth
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}