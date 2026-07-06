import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';
import { EvaluerRapportDto } from '../types/rapport.types';
import { RAPPORTS_KEY } from './useRapports';

export function useEvaluerRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EvaluerRapportDto }) =>
      rapportsApi.evaluer(id, data),
    onSuccess: () => {
      // Invalide le cache mentor-rapports pour refléter le nouveau statut/note
      queryClient.invalidateQueries({ queryKey: [RAPPORTS_KEY, 'mentor-rapports'] });
    },
  });
}