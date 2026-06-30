import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { ROUTES } from '@/shared/constants/routes';

export function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <div>
      <header>
        <span>Admin — {user?.prenom} {user?.nom}</span>
        <button onClick={() => logout()}>Déconnexion</button>
      </header>

      <nav>
        <Link to={ROUTES.admin.dashboard}>Dashboard</Link>
        <Link to={ROUTES.admin.users}>Utilisateurs</Link>
        <Link to={ROUTES.admin.stagiaires}>Stagiaires</Link>
        <Link to={ROUTES.admin.mentors}>Mentors</Link>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}