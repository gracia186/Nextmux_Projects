import type { User } from '@/types/common'

export interface UpdateProfilePayload {
  name?: string
}

export interface DataExportData {
  user: User
  internships: unknown[]
  attendances: unknown[]
  reports: unknown[]
  documents: unknown[]
}
