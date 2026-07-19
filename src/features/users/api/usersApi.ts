import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData, User, PaginationMeta } from '@/types/common'
import type { CreateUserPayload, UpdateUserPayload, UserFilters } from '../types'

export const usersApi = {
  list: async (filters: UserFilters) => {
    const { data } = await apiClient.get<ApiSuccess<User[]> & { meta: PaginationMeta }>('/admin/users', {
      params: filters,
    })
    return { users: data.data, meta: data.meta }
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<User>>(`/admin/users/${id}`)
    return data.data
  },

  create: async (payload: CreateUserPayload) => {
    const { data } = await apiClient.post<ApiSuccess<User>>('/admin/users', payload)
    return data.data
  },

  update: async (id: string, payload: UpdateUserPayload) => {
    const { data } = await apiClient.patch<ApiSuccess<User>>(`/admin/users/${id}`, payload)
    return data.data
  },

  deactivate: async (id: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/admin/users/${id}`)
    return data.data
  },

  assignMentor: async (id: string, mentorId: string) => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>(`/admin/users/${id}/assign-mentor`, {
      mentor_id: mentorId,
    })
    return data.data
  },

  terminateInternship: async (id: string, reason: string) => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>(`/admin/users/${id}/terminate`, { reason })
    return data.data
  },

  purge: async (id: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/admin/users/${id}/purge`)
    return data.data
  },

  resendInvitation: async (id: string) => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>(`/admin/users/${id}/resend-invitation`)
    return data.data
  },

  updateInternshipDates: async (internId: string, payload: { start_date: string; end_date: string }) => {
    const { data } = await apiClient.patch<ApiSuccess<unknown>>(`/admin/internships/${internId}/dates`, payload)
    return data.data
  },
}
