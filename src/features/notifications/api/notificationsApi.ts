import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData } from '@/types/common'
import type { NotificationsPage } from '../types'

export const notificationsApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiSuccess<NotificationsPage>>('/me/notifications')
    return data.data
  },

  markAllRead: async () => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>('/me/notifications/read')
    return data.data
  },
}
