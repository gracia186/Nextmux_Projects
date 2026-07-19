import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData, PaginationMeta } from '@/types/common'
import type { Event, PublishEventPayload, UpdateEventPayload } from '../types'

export const eventsApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiSuccess<Event[]> & { meta: PaginationMeta }>('/events')
    return { events: data.data, meta: data.meta }
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<Event>>(`/events/${id}`)
    return data.data
  },

  publish: async (payload: PublishEventPayload) => {
    const { data } = await apiClient.post<ApiSuccess<Event>>('/events', payload)
    return data.data
  },

  update: async (id: string, payload: UpdateEventPayload) => {
    const { data } = await apiClient.patch<ApiSuccess<Event>>(`/events/${id}`, payload)
    return data.data
  },

  remove: async (id: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/events/${id}`)
    return data.data
  },
}
