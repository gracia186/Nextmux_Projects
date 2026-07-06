import { useQuery } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';

export const RAPPORTS_KEY = 'rapports';

// Côté stagiaire : ses propres rapports (filtré côté serveur/mock via /mes-rapports)
export function useRapports(page = 1) {
  return useQuery({
    queryKey: [RAPPORTS_KEY, 'mes-rapports', page],
    queryFn: () => rapportsApi.getMesRapports(page).then((r) => r.data),
  });
}