import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { GlobalSearch } from './GlobalSearch';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api
      .get('/admin/notifications')
      .then((res) => setUnread((res.data.data ?? []).filter((n: { read_at: string | null }) => !n.read_at).length))
      .catch(() => setUnread(0));
  }, [user?.role]);

  return (
    <header className="topbar glass">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
      </div>

      <GlobalSearch />

      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Changer de thème" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {user?.role === 'admin' && (
          <button className="icon-btn" aria-label="Notifications" onClick={() => navigate('/admin/notifications')}>
            <Bell size={17} />
            {unread > 0 && <span className="dot" />}
          </button>
        )}
      </div>
    </header>
  );
}
