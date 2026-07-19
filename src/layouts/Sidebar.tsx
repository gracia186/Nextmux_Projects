import { NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { UserRole } from '../types/common'

interface NavItem {
  to: string
  label: string
  icon: JSX.Element
}

function Icon(path: string) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = {
  dashboard: Icon('M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z'),
  users: Icon('M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 100-8'),
  projects: Icon('M9 3h6l1 3h4v2H4V6h4l1-3zM4 8h16l-1.2 11.1a2 2 0 01-2 1.9H7.2a2 2 0 01-2-1.9L4 8z'),
  attendance: Icon('M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z'),
  reports: Icon('M9 12h6m-6 4h6M9 8h1M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z'),
  documents: Icon('M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm7 0v5h5'),
  events: Icon('M8 2v3m8-3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm3 7h3m-3 4h6'),
  stats: Icon('M4 20V10m6 10V4m6 16v-7'),
  audit: Icon('M9 12l2 2 4-4M7 3h10l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7l4-4z'),
  feedback: Icon('M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z'),
  profile: Icon('M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0'),
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { to: '/admin', label: 'Tableau de bord', icon: icons.dashboard },
    { to: '/admin/users', label: 'Utilisateurs', icon: icons.users },
    { to: '/projects', label: 'Projets', icon: icons.projects },
    { to: '/attendance', label: 'Présences', icon: icons.attendance },
    { to: '/reports', label: 'Rapports', icon: icons.reports },
    { to: '/documents', label: 'Documents', icon: icons.documents },
    { to: '/events', label: 'Annonces', icon: icons.events },
    { to: '/admin/stats', label: 'Statistiques', icon: icons.stats },
    { to: '/admin/audit-logs', label: "Journal d'audit", icon: icons.audit },
    { to: '/profile', label: 'Profil', icon: icons.profile },
  ],
  mentor: [
    { to: '/mentor', label: 'Tableau de bord', icon: icons.dashboard },
    { to: '/projects', label: 'Projets', icon: icons.projects },
    { to: '/attendance', label: 'Présences', icon: icons.attendance },
    { to: '/reports', label: 'Rapports', icon: icons.reports },
    { to: '/documents', label: 'Documents', icon: icons.documents },
    { to: '/events', label: 'Annonces', icon: icons.events },
    { to: '/profile', label: 'Profil', icon: icons.profile },
  ],
  intern: [
    { to: '/intern', label: 'Tableau de bord', icon: icons.dashboard },
    { to: '/attendance', label: 'Ma présence', icon: icons.attendance },
    { to: '/reports', label: 'Rapports', icon: icons.reports },
    { to: '/projects', label: 'Projets', icon: icons.projects },
    { to: '/documents', label: 'Documents', icon: icons.documents },
    { to: '/events', label: 'Annonces', icon: icons.events },
    { to: '/feedback', label: 'Avis de stage', icon: icons.feedback },
    { to: '/profile', label: 'Profil', icon: icons.profile },
  ],
}

export function Sidebar({ role, mobileOpen, onClose }: { role: UserRole; mobileOpen: boolean; onClose: () => void }) {
  const items = navByRole[role]

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-950 text-white transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">S</span>
          STAMUX
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6 scrollbar-thin">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/mentor' || item.to === '/intern'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-600 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
