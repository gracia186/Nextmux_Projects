// Outlet affiche la route enfant correspondante, useNavigate non nécessaire ici
import { Outlet } from 'react-router-dom';
// Store Zustand pour récupérer l'utilisateur connecté (prénom/nom affichés dans le header)
import { useAuthStore } from '@/features/auth/store/authStore';
// Hook de déconnexion (mutation React Query)
import { useLogout } from '@/features/auth/hooks/useLogout';
// Constantes de routes centralisées (évite les chemins en dur)
import { ROUTES } from '@/shared/constants/routes';
// Composant Sidebar générique créé précédemment
import { Sidebar, type SidebarLink } from '@/shared/components/Sidebar';
// Icônes lucide-react utilisées pour chaque lien du menu admin
import { LayoutDashboard, Users, GraduationCap, UserCog, LogOut, Calendar } from 'lucide-react';

// Définition des liens de la sidebar admin, en dehors du composant pour éviter de les recréer à chaque render
const adminLinks: SidebarLink[] = [
  { to: ROUTES.admin.dashboard, label: 'Dashboard', icon: LayoutDashboard }, // lien vers le dashboard admin
  { to: ROUTES.admin.users, label: 'Utilisateurs', icon: UserCog },         // lien vers la gestion des comptes
  { to: ROUTES.admin.stagiaires, label: 'Stagiaires', icon: GraduationCap }, // lien vers la liste des stagiaires
  { to: ROUTES.admin.mentors, label: 'Mentors', icon: Users },
  { to: ROUTES.admin.evenements, label: 'Evènements', icon: Calendar },             // lien vers la liste des mentors
];

// Composant layout principal de l'espace admin
export function AdminLayout() {
  // Récupération de l'utilisateur connecté depuis le store Zustand
  const user = useAuthStore((state) => state.user);
  // Récupération de la fonction de déconnexion (mutate) depuis le hook useLogout
  const { mutate: logout } = useLogout();

  return (
    // Conteneur global : flex horizontal pour mettre sidebar + contenu côte à côte, hauteur pleine écran
    <div className="flex h-screen bg-dark-50">
      {/* Sidebar fixe à gauche, reçoit le titre du rôle et la liste des liens */}
      <Sidebar title="Admin" links={adminLinks} />

      {/* Conteneur de la zone droite : header + contenu, en colonne, prend l'espace restant */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header en haut de la zone droite : fond blanc, ombre légère, séparateur */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-dark-200 shadow-sm">
          {/* Affichage du prénom/nom de l'utilisateur connecté */}
          <span className="text-dark-700 font-medium">
            {user?.prenom} {user?.nom}
          </span>

          {/* Bouton de déconnexion, déclenche la mutation logout */}
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

        {/* Zone principale scrollable où s'affiche le contenu de la route active */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet rend le composant de la route enfant (Dashboard, StagiaireList, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}