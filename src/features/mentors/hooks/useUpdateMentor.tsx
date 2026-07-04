import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorsApi } from '../api/mentors.api';
import { MENTORS_KEY } from './useMentors';
import { UpdateMentorDto } from '../types/mentor.types';

export function useUpdateMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMentorDto }) =>
      mentorsApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENTORS_KEY],refetchType: 'all'  });
    },
  });
}