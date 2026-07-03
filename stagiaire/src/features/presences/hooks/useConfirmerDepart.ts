import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presencesApi } from '../api/presences.api';
import { PRESENCES_KEY } from './usePresences';
import { PRESENCE_JOUR_KEY } from './usePresenceJour';

export function useConfirmerDepart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => presencesApi.confirmerDepart().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESENCE_JOUR_KEY] });
      queryClient.invalidateQueries({ queryKey: [PRESENCES_KEY] });
    },
  });
}