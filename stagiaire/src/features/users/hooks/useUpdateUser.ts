// Import des hooks TanStack Query
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import de l'API et du type DTO
import { usersApi, UpdateUserDto } from '../api/users.api';
// Import de la clé de query
import { USERS_KEY } from './useUsers';

// Hook pour mettre à jour un utilisateur existant
export function useUpdateUser() {
  // Accès au client TanStack Query
  const queryClient = useQueryClient();

  return useMutation({
    // Fonction de mutation : reçoit l'ID et les données modifiées
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      usersApi.update(id, data).then((r) => r.data),
    // Après succès : invalide le cache pour rafraîchir la liste
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY],refetchType: 'all'  });
    },
  });
}