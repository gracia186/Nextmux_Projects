import { NavLink } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { NAV_BY_ROLE, ROLE_LABEL } from './nav.config';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const groups = NAV_BY_ROLE[user.role];
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar glass glass-strong" data-collapsed={collapsed}>
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>
        <div className="brand-text">
          <strong>STAMUX</strong>
          <span>Internship OS</span>
        </div>
        <button className="sidebar-toggle" onClick={onToggle} aria-label="Réduire la barre latérale">
          <ChevronLeft size={16} />
        </button>
      </div>

      {groups.map((group) => (
        <nav className="nav-group" key={group.label}>
          <p className="nav-group-label">{group.label}</p>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${user.role}`}
              className={({ isActive }) => clsx('nav-link', isActive && 'is-active')}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="sidebar-user-meta">
            <strong>{user.name}</strong>
            <span>{ROLE_LABEL[user.role]}</span>
          </div>
        </div>
        <button className="nav-link" onClick={logout} style={{ width: '100%' }}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
