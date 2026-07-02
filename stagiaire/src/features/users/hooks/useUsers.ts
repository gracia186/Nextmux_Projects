// Import du hook useQuery de TanStack Query
import { useQuery } from '@tanstack/react-query';
// Import de l'API utilisateurs
import { usersApi } from '../api/users.api';

// Clé de query centralisée pour l'invalidation cohérente entre hooks
export const USERS_KEY = 'users';

// Hook pour récupérer la liste paginée des utilisateurs
export function useUsers(page = 1) {
  return useQuery({
    // Clé incluant la page pour mettre en cache chaque page séparément
    queryKey: [USERS_KEY, page],
    // Fonction de fetch : appel API puis extraction de r.data
    queryFn: () => usersApi.getAll(page).then((r) => r.data),
  });
}