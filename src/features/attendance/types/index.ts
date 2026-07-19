import type { User } from '@/types/common'

export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface Attendance {
  id: string
  intern?: User
  date: string
  status: AttendanceStatus
  note: string | null
  arrival_time: string | null
  departure_time: string | null
  recorded_by?: User
  created_at: string | null
}

export interface RecordAttendancePayload {
  date?: string
  status: AttendanceStatus
  note?: string
}

export interface CorrectAttendancePayload {
  status: AttendanceStatus
  note?: string
}

export interface AttendanceDashboardStats {
  [key: string]: unknown
}

export interface AttendanceDashboardData {
  attendances: Attendance[]
  stats: AttendanceDashboardStats
}
