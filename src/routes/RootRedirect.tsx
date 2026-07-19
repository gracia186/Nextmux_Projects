import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.user?.role)

  if (!isAuthenticated || !role) return <Navigate to="/login" replace />

  const dest = role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/intern'
  return <Navigate to={dest} replace />
}
