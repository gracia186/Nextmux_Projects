import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData, PaginationMeta } from '@/types/common'
import type { Report, SubmitReportPayload, ValidateReportPayload } from '../types'

export const reportsApi = {
  submit: async (payload: SubmitReportPayload) => {
    const form = new FormData()
    form.append('type', payload.type)
    form.append('period_start', payload.period_start)
    form.append('period_end', payload.period_end)
    form.append('file', payload.file)
    const { data } = await apiClient.post<ApiSuccess<Report>>('/reports', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  list: async (page: number) => {
    const { data } = await apiClient.get<ApiSuccess<Report[]> & { meta: PaginationMeta }>('/reports', {
      params: { page },
    })
    return { reports: data.data, meta: data.meta }
  },

  pending: async () => {
    const { data } = await apiClient.get<ApiSuccess<Report[]>>('/reports/pending')
    return data.data
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<Report>>(`/reports/${id}`)
    return data.data
  },

  update: async (id: string, payload: Partial<{ period_start: string; period_end: string; file: File }>) => {
    const form = new FormData()
    if (payload.period_start) form.append('period_start', payload.period_start)
    if (payload.period_end) form.append('period_end', payload.period_end)
    if (payload.file) form.append('file', payload.file)
    form.append('_method', 'PATCH')
    const { data } = await apiClient.post<ApiSuccess<Report>>(`/reports/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  hide: async (id: string) => {
    const { data } = await apiClient.delete<ApiSuccess<MessageData>>(`/reports/${id}`)
    return data.data
  },

  validate: async (id: string, payload: ValidateReportPayload) => {
    const { data } = await apiClient.post<ApiSuccess<Report>>(`/reports/${id}/validate`, payload)
    return data.data
  },

  download: async (id: string) => {
    const { data } = await apiClient.get<ApiSuccess<{ url: string }>>(`/reports/${id}/download`)
    return data.data
  },
}
