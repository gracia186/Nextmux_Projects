import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorsApi } from '../api/mentors.api';
import { MENTORS_KEY } from './useMentors';
import { CreateMentorDto } from '../types/mentor.types';

export function useCreateMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMentorDto) => mentorsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENTORS_KEY] });
    },
  });
}