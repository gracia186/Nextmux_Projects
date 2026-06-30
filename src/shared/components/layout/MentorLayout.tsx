// Importe Outlet pour afficher les routes enfants
// Importe Link pour naviguer entre les pages sans recharger l'application
import { Outlet, Link } from 'react-router-dom';

// Importe le store d'authentification (Zustand)
import { useAuthStore } from '@/features/auth/store/authStore';

// Importe le hook permettant de gérer la déconnexion
import { useLogout } from '@/features/auth/hooks/useLogout';

// Composant représentant le layout de l'espace Mentor
export function MentorLayout() {

  // Récupère l'utilisateur connecté depuis le store
  const user = useAuthStore((state) => state.user);

  // Récupère la fonction de déconnexion (mutate renommée en logout)
  const { mutate: logout } = useLogout();

  // Interface du layout
  return (
    <div>

      {/* En-tête de la page */}
      <header>

        {/* Affiche le prénom et le nom du mentor connecté */}
        <span>
          Mentor — {user?.prenom} {user?.nom}
        </span>

        {/* Bouton permettant de se déconnecter */}
        <button onClick={() => logout()}>
          Déconnexion
        </button>

      </header>

      {/* Barre de navigation du mentor */}
      <nav>

        {/* Lien vers le tableau de bord */}
        <Link to="/mentor">
          Dashboard
        </Link>

        {/* Lien vers la liste des stagiaires suivis */}
        <Link to="/mentor/stagiaires">
          Mes stagiaires
        </Link>

        {/* Lien vers les rapports du mentor */}
        <Link to="/mentor/rapports">
          Rapports
        </Link>

      </nav>

      {/* Zone dans laquelle les routes enfants seront affichées */}
      <main>

        {/* Affiche le composant correspondant à la route sélectionnée */}
        <Outlet />

      </main>

    </div>
  );
}