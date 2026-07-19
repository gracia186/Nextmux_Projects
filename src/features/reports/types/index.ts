import type { User } from '@/types/common'

export type ReportType = 'weekly' | 'monthly'
export type ReportStatus = 'pending' | 'validated' | 'rejected'

export interface Report {
  id: string
  intern?: User
  type: ReportType
  period_start: string
  period_end: string
  file_name: string | null
  file_size: number | null
  status: ReportStatus
  mentor_comment: string | null
  validated_by?: User
  validated_at: string | null
  created_at: string | null
}

export interface SubmitReportPayload {
  type: ReportType
  period_start: string
  period_end: string
  file: File
}

export interface ValidateReportPayload {
  status: 'validated' | 'rejected'
  mentor_comment?: string
}
