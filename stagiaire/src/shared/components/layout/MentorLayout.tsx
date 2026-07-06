import { Outlet } from 'react-router-dom';

import { Sidebar, type SidebarLink } from '@/shared/components/Sidebar';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';

import {
  LayoutDashboard,
  Users,
  FileText,
  Workflow,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';

export function MentorLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  const links: SidebarLink[] = [
    {
      label: 'Dashboard',
      to: '/mentor',
      icon: LayoutDashboard,
    },
    {
      label: 'Mes stagiaires',
      to: '/mentor/stagiaires',
      icon: Users,
    },
    {
      label: 'Rapports',
      to: '/mentor/rapports',
      icon: FileText,
    },
    {
      label: 'Projets',
      to: '/mentor/projets',
      icon: Workflow,
    },
    {
      label: 'Voir demandes',
      to: '/mentor/demandes',
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        title="Espace Mentor"
        links={links}
      />

      {/* Contenu */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Header */}
        <header
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            border-b
            bg-white
            shadow-sm
            px-4
            py-4
            pl-16
            lg:pl-6
          "
        >
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">
              Mentor — {user?.prenom} {user?.nom}
            </h2>
          </div>

          <button
            onClick={() => logout()}
            className="
              flex
              items-center
              gap-2
              rounded-md
              px-3
              py-2
              text-sm
              font-medium
              hover:bg-red-50
              hover:text-red-600
              transition
            "
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">
              Déconnexion
            </span>
          </button>
        </header>

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}