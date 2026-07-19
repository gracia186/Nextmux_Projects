import { useState, useRef, useEffect } from 'react'
import { useNotifications, useMarkNotificationsRead } from '../hooks/useNotifications'

function extractMessage(data: Record<string, unknown>): string {
  if (typeof data.message === 'string') return data.message
  if (typeof data.title === 'string') return data.title
  return 'Nouvelle notification'
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data } = useNotifications()
  const markRead = useMarkNotificationsRead()
  const ref = useRef<HTMLDivElement>(null)

  const notifications = data?.data ?? []
  const unreadCount = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-900/5"
        aria-label="Notifications"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 17h5l-1.4-2.8A2 2 0 0118 13.2V10a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay-500 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-ink-700/10 bg-white shadow-panel">
          <div className="flex items-center justify-between border-b border-ink-700/10 px-4 py-3">
            <p className="text-sm font-semibold text-ink-950">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={() => markRead.mutate()} className="text-xs font-medium text-brand-600 hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-700/50">Aucune notification</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-ink-700/5 px-4 py-3 last:border-0 ${!n.read_at ? 'bg-brand-50/40' : ''}`}
                >
                  <p className="text-sm text-ink-800">{extractMessage(n.data)}</p>
                  <p className="mt-1 text-xs text-ink-700/40">{new Date(n.created_at).toLocaleString('fr-FR')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
