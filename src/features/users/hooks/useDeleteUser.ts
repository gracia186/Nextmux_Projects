// Import des hooks TanStack Query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import de l'API
import { usersApi } from '../api/users.api';
// Import de la clé de query
import { USERS_KEY } from './useUsers';

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  // Accès au client TanStack Query
  const queryClient = useQueryClient();

  return useMutation({
    // Fonction de mutation : reçoit l'ID de l'utilisateur à supprimer
    mutationFn: (id: number) => usersApi.remove(id),
    // Après succès : invalide le cache pour retirer l'utilisateur de la liste
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] ,refetchType: 'all' });
    },
  });
}