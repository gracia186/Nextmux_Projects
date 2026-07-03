import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProjet } from '../api/projets.api';
import { projetsKeys } from './useProjets';

export function useDeleteProjet() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    // string ici = l'id du projet à supprimer (argument unique passé à mutate())
    mutationFn: deleteProjet,

    onSuccess: () => {
      // Après suppression, on invalide uniquement la liste
      // (le détail n'existe plus, pas besoin de l'invalider)
      queryClient.invalidateQueries({ queryKey: projetsKeys.lists() });
    },
  });
}