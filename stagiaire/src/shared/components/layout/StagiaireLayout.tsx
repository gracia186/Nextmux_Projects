import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  User,
} from 'lucide-react';

import { Sidebar, type SidebarLink } from '@/shared/components/Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function StagiaireLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  const links: SidebarLink[] = [
    {
      label: 'Dashboard',
      to: '/stagiaire',
      icon: LayoutDashboard,
    },
    {
      label: 'Mes rapports',
      to: '/stagiaire/rapports',
      icon: FileText,
    },
    {
      label: 'Profil',
      to: '/stagiaire/profile',
      icon: User,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        title="Espace Stagiaire"
        links={links}
      />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <span className="text-lg font-semibold">
            Stagiaire — {user?.prenom} {user?.nom}
          </span>

          <button
            onClick={() => logout()}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Déconnexion
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}