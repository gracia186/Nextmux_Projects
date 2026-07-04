import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';
import { RAPPORTS_KEY } from './useRapports';

export function useDeleteRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rapportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RAPPORTS_KEY] });
    },
  });
}