import { Outlet } from 'react-router-dom';

import { Sidebar, type SidebarLink } from '@/shared/components/Sidebar';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
 import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  WorkflowIcon
} from "lucide-react";
export function MentorLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  // Liens affichés dans la Sidebar
 

const links: SidebarLink[] = [
  {
    label: "Dashboard",
    to: "/mentor",
    icon: LayoutDashboard,
  },
  {
    label: "Mes stagiaires",
    to: "/mentor/stagiaires",
    icon: Users,
  },
  {
    to: "/mentor/rapports",
    label: "Rapports",
    icon: FileText,
  },
  {
    to: "/mentor/projets",
    label: "Projets",
    icon: WorkflowIcon,
  },
];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        title="Espace Mentor"
        links={links}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <h2 className="text-lg font-semibold">
            Mentor — {user?.prenom} {user?.nom}
          </h2>

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

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}