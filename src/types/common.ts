// Shapes mirror the backend's response envelope exactly:
// success responses: { success: true, data: T, meta?: PaginationMeta }
// error responses:   { success: false, error: { code: string, message: string } }

export type UserRole = 'admin' | 'mentor' | 'intern'
export type UserStatus = 'pending' | 'active' | 'inactive'

export interface PaginationMeta {
  total: number
  per_page?: number
  current_page: number
  last_page: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
  }
}

export interface ValidationErrorBody {
  message: string
  errors: Record<string, string[]>
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar_path: string | null
  mfa_enabled: boolean
  created_at: string | null
}

export interface MessageData {
  message: string
}

