import { useQuery } from '@tanstack/react-query';
import { mentorsApi } from '../api/mentors.api';

export const MENTORS_KEY = 'mentors';

export function useMentors(page = 1) {
  return useQuery({
    queryKey: [MENTORS_KEY, page],
    queryFn: () => mentorsApi.getAll(page).then((r) => r.data),
    staleTime: 0,
  });
}