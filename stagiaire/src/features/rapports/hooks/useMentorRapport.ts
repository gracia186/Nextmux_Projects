import { useQuery } from '@tanstack/react-query';
import { rapportsApi } from '../api/rapports.api';
import { RAPPORTS_KEY } from './useRapports';

// Côté mentor : uniquement les rapports des stagiaires qui lui sont assignés
export function useMentorRapports(mentorId: number, page = 1) {
  return useQuery({
    queryKey: [RAPPORTS_KEY, 'mentor-rapports', mentorId, page],
    queryFn: () => rapportsApi.getMentorRapports(mentorId, page).then((r) => r.data),
    enabled: Boolean(mentorId), // évite d'appeler l'API tant que mentorId n'est pas encore connu
  });
}