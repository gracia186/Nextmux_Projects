import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stagiairesApi } from '../api/stagiaires.api';
import { STAGIAIRES_KEY } from './useStagiaires';
import { CreateStagiaireDto } from '../types/stagiaire.types';

export function useCreateStagiaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStagiaireDto) =>
      stagiairesApi.create(data).then((r) => r.data),
    onSuccess: () => {
      // Invalide le cache → TanStack Query refetch automatiquement la liste
      queryClient.invalidateQueries({ queryKey: [STAGIAIRES_KEY] });
    },
  });
}