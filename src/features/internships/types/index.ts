import type { User } from '@/types/common'

export type InternshipStatus = 'active' | 'completed' | 'terminated'

export interface Internship {
  id: string
  intern?: User
  mentor?: User
  start_date: string
  end_date: string
  duration_days: number
  status: InternshipStatus
  termination_reason?: string | null
  created_at: string | null
}
