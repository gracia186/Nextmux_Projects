import { apiClient } from '@/lib/axios'
import type { ApiSuccess, User } from '@/types/common'
import type { DataExportData, UpdateProfilePayload } from '../types'

export const profileApi = {
  me: async () => {
    const { data } = await apiClient.get<ApiSuccess<User>>('/me')
    return data.data
  },

  update: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.patch<ApiSuccess<User>>('/me', payload)
    return data.data
  },

  uploadAvatar: async (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await apiClient.post<ApiSuccess<User>>('/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  enableMfa: async (enabled: boolean) => {
    const { data } = await apiClient.post<ApiSuccess<User>>('/me/mfa', { mfa_enabled: enabled })
    return data.data
  },

  updateMfaSecret: async (secret: string) => {
    const { data } = await apiClient.patch<ApiSuccess<User>>('/me/mfa/secret', { mfa_secret: secret })
    return data.data
  },

  dataExport: async () => {
    const { data } = await apiClient.get<ApiSuccess<DataExportData>>('/me/data-export')
    return data.data
  },
}
