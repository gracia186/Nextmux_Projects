import { useQuery } from '@tanstack/react-query';
import { presencesApi } from '../api/presences.api';

export const PRESENCES_KEY = 'presences';

export function usePresences(page = 1) {
  return useQuery({
    queryKey: [PRESENCES_KEY, page],
    queryFn: () => presencesApi.getMesPresences(page).then((r) => r.data),
  });
}