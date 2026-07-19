import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData } from '@/types/common'
import type { CreateProjectPayload, EvaluateInternPayload, Project, UpdateProjectPayload } from '../types'

export const projectsApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiSuccess<Project[]>>('/projects')
    return data.data
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<Project>>(`/projects/${id}`)
    return data.data
  },

  create: async (payload: CreateProjectPayload) => {
    const { data } = await apiClient.post<ApiSuccess<Project>>('/projects', payload)
    return data.data
  },

  update: async (id: string, payload: UpdateProjectPayload) => {
    const { data } = await apiClient.patch<ApiSuccess<Project>>(`/projects/${id}`, payload)
    return data.data
  },

  assign: async (id: string, internIds: string[]) => {
    const { data } = await apiClient.post<ApiSuccess<Project>>(`/projects/${id}/assign`, { intern_ids: internIds })
    return data.data
  },

  unassign: async (id: string, internId: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/projects/${id}/assign/${internId}`)
    return data.data
  },

  updateProgress: async (id: string, progress: number) => {
    const { data } = await apiClient.patch<ApiSuccess<Project>>(`/projects/${id}/progress`, { progress })
    return data.data
  },

  evaluate: async (id: string, internId: string, payload: EvaluateInternPayload) => {
    const { data } = await apiClient.post<ApiSuccess<unknown>>(`/projects/${id}/evaluate/${internId}`, payload)
    return data.data
  },
}
