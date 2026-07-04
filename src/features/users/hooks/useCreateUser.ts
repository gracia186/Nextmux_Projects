// Import du hook useMutation et du client Query pour l'invalidation
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import de l'API et du type DTO
import { usersApi, CreateUserDto } from '../api/users.api';
// Import de la clé de query pour invalider le cache après création
import { USERS_KEY } from './useUsers';

// Hook pour créer un nouvel utilisateur
export function useCreateUser() {
  // Accès au client TanStack Query pour l'invalidation du cache
  const queryClient = useQueryClient();

  return useMutation({
    // Fonction de mutation : appel API de création
    mutationFn: (data: CreateUserDto) => usersApi.create(data).then((r) => r.data),
    // Après succès : invalide le cache users pour forcer un re-fetch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] ,refetchType: 'all' });
    },
  });
}