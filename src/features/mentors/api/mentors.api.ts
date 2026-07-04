import { apiClient } from '@/shared/lib/apiClient';
import { PaginatedResponse } from '@/shared/types/api.types';
import { Mentor, CreateMentorDto, UpdateMentorDto } from '../types/mentor.types';

export const mentorsApi = {
  getAll: (page = 1) =>
    apiClient.get<PaginatedResponse<Mentor>>('/mentors', { params: { page } }),

  getById: (id: number) =>
    apiClient.get<Mentor>(`/mentors/${id}`),

  create: (data: CreateMentorDto) =>
    apiClient.post<Mentor>('/mentors', data),

  update: (id: number, data: UpdateMentorDto) =>
    apiClient.put<Mentor>(`/mentors/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/mentors/${id}`),
};