import { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Import des composants Lucide
import {
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from 'lucide-react';

// ==========================
// Type d'un lien
// ==========================
export type SidebarLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

// ==========================
// Props
// ==========================
type SidebarProps = {
  title: string;
  links: SidebarLink[];
};

// ==========================
// Composant Sidebar
// ==========================
export function Sidebar({ title, links }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        ${
          collapsed ? 'w-20' : 'w-64'
        }
        h-screen
        flex
        flex-col
        text-dark-100
        backdrop-blur-sm
        transition-all
        duration-300
      `}
      style={{
        backgroundImage:
          'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
      }}
    >
      {/* ==========================
          Titre
      ========================== */}
      <div
        className={`border-b border-dark-700 ${
          collapsed ? 'py-5 flex justify-center' : 'px-6 py-5'
        }`}
      >
        {!collapsed && (
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        )}
      </div>

      {/* ==========================
          Navigation
      ========================== */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `
                flex
                items-center
                ${
                  collapsed
                    ? 'justify-center'
                    : 'gap-3'
                }
                px-3
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-colors
                ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-200 hover:bg-dark-800 hover:text-white'
                }
              `
              }
            >
              <Icon className="w-5 h-5 shrink-0" />

              {!collapsed && (
                <span>{link.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ==========================
          Bouton réduire
      ========================== */}
      <div className="p-3 border-t border-dark-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}

          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
