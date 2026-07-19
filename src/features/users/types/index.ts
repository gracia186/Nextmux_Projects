import type { User, UserRole, UserStatus } from '@/types/common'

export interface CreateUserPayload {
  name: string
  email: string
  role: UserRole
  start_date?: string
  end_date?: string
  mentor_id?: string
}

export interface UpdateUserPayload {
  name?: string
  status?: UserStatus
}

export interface UserFilters {
  role?: UserRole | ''
  status?: UserStatus | ''
  search?: string
  page?: number
}

export type { User }
