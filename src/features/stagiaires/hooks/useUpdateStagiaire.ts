import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stagiairesApi } from '../api/stagiaires.api';
import { STAGIAIRES_KEY } from './useStagiaires';
import { UpdateStagiaireDto } from '../types/stagiaire.types';

export function useUpdateStagiaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStagiaireDto }) =>
      stagiairesApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAGIAIRES_KEY] });
    },
  });
}