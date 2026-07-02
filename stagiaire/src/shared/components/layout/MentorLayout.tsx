import { Outlet } from 'react-router-dom';

import { Sidebar, type SidebarLink } from '@/shared/components/Sidebar';

import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
 import {
  LayoutDashboard,
  Users,
  FileText,
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
            onClick={() => logout()}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
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