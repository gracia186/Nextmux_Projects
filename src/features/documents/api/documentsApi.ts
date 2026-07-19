import { apiClient } from '@/lib/axios'
import type { ApiSuccess } from '@/types/common'
import type { AdminDocument, MentorValidateDocumentPayload, RequestDocumentPayload } from '../types'

export const documentsApi = {
  request: async (payload: RequestDocumentPayload) => {
    const { data } = await apiClient.post<ApiSuccess<AdminDocument>>('/documents/request', payload)
    return data.data
  },

  list: async () => {
    const { data } = await apiClient.get<ApiSuccess<AdminDocument[]>>('/documents')
    return data.data
  },

  pendingForMentor: async () => {
    const { data } = await apiClient.get<ApiSuccess<AdminDocument[]>>('/documents/pending')
    return data.data
  },

  pendingForAdmin: async () => {
    const { data } = await apiClient.get<ApiSuccess<AdminDocument[]>>('/admin/documents/pending')
    return data.data
  },

  mentorValidate: async (id: string, payload: MentorValidateDocumentPayload) => {
    const { data } = await apiClient.post<ApiSuccess<AdminDocument>>(`/documents/${id}/mentor-validate`, payload)
    return data.data
  },

  upload: async (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<ApiSuccess<AdminDocument>>(`/documents/${id}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  reject: async (id: string, rejectionReason: string) => {
    const { data } = await apiClient.post<ApiSuccess<AdminDocument>>(`/documents/${id}/reject`, {
      rejection_reason: rejectionReason,
    })
    return data.data
  },

  download: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<{ url: string }>>(`/documents/${id}/download`)
    return data.data
  },
}
