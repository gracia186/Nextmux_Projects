import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';
import { RAPPORTS_KEY } from './useRapports';
import { CreateRapportDto } from '../types/rapport.types';

export function useSubmitRapport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRapportDto) =>
      rapportsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RAPPORTS_KEY] });
    },
  });
}