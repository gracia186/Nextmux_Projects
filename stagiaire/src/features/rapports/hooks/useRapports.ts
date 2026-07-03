import { useQuery } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';

export const RAPPORTS_KEY = 'rapports';

export function useRapports(page = 1,MentorId?:number) {
  return useQuery({
    queryKey: [RAPPORTS_KEY, page, MentorId],
    queryFn: () => rapportsApi.getMesRapports(page, MentorId).then((r) => r.data),
  });
}