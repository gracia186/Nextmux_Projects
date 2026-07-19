import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types/common'

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.user?.role)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && role && !roles.includes(role)) {
    const fallback = role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/intern'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.user?.role)

  if (isAuthenticated && role) {
    const dest = role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/intern'
    return <Navigate to={dest} replace />
  }

  return <>{children}</>
}
