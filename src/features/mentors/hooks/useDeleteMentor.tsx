import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorsApi } from '../api/mentors.api';
import { MENTORS_KEY } from './useMentors';

export function useDeleteMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mentorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENTORS_KEY] });
    },
  });
}