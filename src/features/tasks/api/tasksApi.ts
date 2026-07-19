import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData } from '@/types/common'
import type { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from '../types'

export const tasksApi = {
  byProject: async (projectId: string) => {
    const { data } = await apiClient.get<ApiSuccess<Task[]>>(`/projects/${projectId}/tasks`)
    return data.data
  },

  create: async (projectId: string, payload: CreateTaskPayload) => {
    const { data } = await apiClient.post<ApiSuccess<Task>>(`/projects/${projectId}/tasks`, payload)
    return data.data
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<Task>>(`/tasks/${id}`)
    return data.data
  },

  update: async (id: string, payload: UpdateTaskPayload) => {
    const { data } = await apiClient.patch<ApiSuccess<Task>>(`/tasks/${id}`, payload)
    return data.data
  },

  updateStatus: async (id: string, status: TaskStatus) => {
    const { data } = await apiClient.patch<ApiSuccess<Task>>(`/tasks/${id}/status`, { status })
    return data.data
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/tasks/${id}`)
    return data.data
  },
}
