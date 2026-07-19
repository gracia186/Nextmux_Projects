import { apiClient } from '@/lib/axios'
import type { ApiSuccess } from '@/types/common'
import type {
  Attendance,
  AttendanceDashboardData,
  CorrectAttendancePayload,
  RecordAttendancePayload,
} from '../types'

export const attendanceApi = {
  record: async (payload: RecordAttendancePayload) => {
    const { data } = await apiClient.post<ApiSuccess<Attendance>>('/attendance', payload)
    return data.data
  },

  history: async () => {
    const { data } = await apiClient.get<ApiSuccess<Attendance[]>>('/attendance')
    return data.data
  },

  dashboard: async () => {
    const { data } = await apiClient.get<ApiSuccess<AttendanceDashboardData>>('/attendance/dashboard')
    return data.data
  },

  byIntern: async (internId: string) => {
    const { data } = await apiClient.get<ApiSuccess<Attendance[]>>(`/attendance/${internId}`)
    return data.data
  },

  recordDeparture: async (id: string) => {
    const { data } = await apiClient.patch<ApiSuccess<Attendance>>(`/attendance/${id}/departure`)
    return data.data
  },

  correct: async (id: string, payload: CorrectAttendancePayload) => {
    const { data } = await apiClient.patch<ApiSuccess<Attendance>>(`/attendance/${id}`, payload)
    return data.data
  },
}
