import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stagiairesApi } from '../api/stagiaires.api';
import { STAGIAIRES_KEY } from './useStagiaires';
import { MENTORS_KEY } from '@/features/mentors/hooks/useMentors';

export function useAssignMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stagiaireId, mentorId }: { stagiaireId: number; mentorId: number | null }) =>
      stagiairesApi.assignMentor(stagiaireId, mentorId).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAGIAIRES_KEY] });
      queryClient.invalidateQueries({ queryKey: [MENTORS_KEY] });
    },
  });
}