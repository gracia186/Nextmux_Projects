import type { User } from '@/types/common'

export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  project_id: string
  created_by?: User
  assigned_to?: User
  title: string
  description: string | null
  status: TaskStatus
  due_date: string | null
  completed_at: string | null
  created_at: string | null
}

export interface CreateTaskPayload {
  title: string
  description?: string
  assigned_to?: string
  due_date?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  assigned_to?: string
  due_date?: string
}
