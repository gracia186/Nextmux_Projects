import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stagiairesApi } from '../api/stagiaires.api';
import { STAGIAIRES_KEY } from './useStagiaires';

export function useDeleteStagiaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => stagiairesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAGIAIRES_KEY],refetchType: 'all'  });
    },
  });
}