import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Clock10Icon,
  Workflow
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
    },{
      label: 'Mes projets',
      to: '/stagiaire/projets',
      icon: Workflow,
    },
    {
      label: 'Mes présences',
      to: '/stagiaire/presences',
      icon: Clock10Icon,
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
            onClick={() => logout()} // appel de la mutation au clic
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-dark-600 hover:text-red-600 transition-colors"
          >
            {/* Icône de déconnexion */}
            <LogOut className="w-4 h-4" />
            {/* Texte du bouton */}
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