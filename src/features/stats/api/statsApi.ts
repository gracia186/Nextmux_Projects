import { apiClient } from '@/lib/axios'
import type { ApiSuccess } from '@/types/common'
import type { AttendanceStats, DocumentStats, OverviewStats, ReportStats } from '../types'

export const statsApi = {
  overview: async () => {
    const { data } = await apiClient.get<ApiSuccess<OverviewStats>>('/admin/stats/overview')
    return data.data
  },
  attendance: async () => {
    const { data } = await apiClient.get<ApiSuccess<AttendanceStats>>('/admin/stats/attendance')
    return data.data
  },
  reports: async () => {
    const { data } = await apiClient.get<ApiSuccess<ReportStats>>('/admin/stats/reports')
    return data.data
  },
  documents: async () => {
    const { data } = await apiClient.get<ApiSuccess<DocumentStats>>('/admin/stats/documents')
    return data.data
  },
}
