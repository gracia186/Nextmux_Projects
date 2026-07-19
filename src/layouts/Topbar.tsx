import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/ui/Elements'
import { NotificationBell } from '../features/notifications/components/NotificationBell'
import { useAuthStore } from '../store/authStore'
import { useLogout } from '../features/auth/hooks/useAuth'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!user) return null

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-700/10 bg-white px-4 lg:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-ink-700 hover:bg-ink-900/5 lg:hidden" aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="relative" ref={ref}>
          <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-900/5">
            <Avatar name={user.name} src={user.avatar_path} size="sm" />
            <span className="hidden text-sm font-medium text-ink-900 sm:inline">{user.name}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-ink-700/10 bg-white py-1 shadow-panel">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-ink-800 hover:bg-ink-900/5"
              >
                Mon profil
              </Link>
              <button
                onClick={() => logout.mutate()}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
