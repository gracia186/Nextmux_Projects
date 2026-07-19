export interface OverviewStats {
  active_interns: number
  completed_internships: number
  pending_reports: number
  pending_documents: number
  average_attendance_rate: number
}

export interface AttendanceStats {
  total: number
  present_rate: number
  absent_rate: number
  late_rate: number
}

export interface ReportStats {
  total: number
  pending: number
  validated: number
  rejected: number
}

export interface DocumentStats {
  total: number
  pending: number
  mentor_approved: number
  mentor_rejected: number
  admin_rejected: number
  completed: number
}
