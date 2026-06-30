import { Outlet,Link} from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function StagiaireLayout() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <div>
      <header>
        <span>Stagiaire — {user?.prenom} {user?.nom}</span>
        <button onClick={() => logout()}>Déconnexion</button>
      </header>
      <nav>
        <Link to="/stagiaire">Dashboard</Link>
        <Link to="/stagiaire/rapports">Mes rapports</Link>
        <Link to="/stagiaire/profile">Profil</Link>
        
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}