import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';

export type SidebarLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  title: string;
  links: SidebarLink[];
};

export function Sidebar({ title, links }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <Menu size={22} />
      </button>

      {/* Fond sombre mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
          transform
          transition-all
          duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          flex
          flex-col
          text-white
          shadow-xl
        `}
        style={{
          backgroundImage:
            'linear-gradient(135deg,#78B3A6 0%,#6E9D96 40%,#556F7B 70%,#3E425D 100%)',
        }}
      >
        {/* En-tête */}
        <div
          className={`border-b border-white/20 ${
            collapsed ? 'py-5 flex justify-center' : 'px-6 py-5'
          } flex items-center justify-between`}
        >
          {!collapsed && (
            <h2 className="text-lg font-bold">{title}</h2>
          )}

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  ${collapsed ? 'lg:justify-center' : 'gap-3'}
                  px-3
                  py-3
                  rounded-lg
                  transition
                  ${
                    isActive
                      ? 'bg-white text-slate-800 font-semibold'
                      : 'hover:bg-white/20'
                  }
                `
                }
              >
                <Icon className="w-5 h-5 shrink-0" />

                {!collapsed && (
                  <span className="hidden lg:inline">
                    {link.label}
                  </span>
                )}

                {/* Sur mobile on affiche toujours le texte */}
                <span className="lg:hidden">
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Réduire */}
        <div className="border-t border-white/20 p-3 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/10 transition"
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
    </>
  );
}