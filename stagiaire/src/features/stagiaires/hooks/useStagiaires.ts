import { useQuery } from '@tanstack/react-query';
import { stagiairesApi } from '../api/stagiaires.api';

export const STAGIAIRES_KEY = 'stagiaires';

export function useStagiaires(page = 1) {
  return useQuery({
    queryKey: [STAGIAIRES_KEY, page],
    queryFn: () => stagiairesApi.getAll(page).then((r) => r.data),
    staleTime: 0,
  });
  
}