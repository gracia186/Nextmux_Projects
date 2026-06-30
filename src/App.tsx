import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AppRouter } from './app/router';

function App() {
  useCurrentUser(); // vérifie la session au chargement de l'app
  return <AppRouter />;
}

export default App;