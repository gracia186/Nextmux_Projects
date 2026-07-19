import type { User } from '@/types/common'

export type ProjectStatus = 'active' | 'completed' | 'archived'

export interface ProjectIntern extends User {
  evaluation_score: number | null
  evaluation_comment: string | null
  assigned_at: string | null
}

export interface Project {
  id: string
  mentor?: User
  title: string
  description: string
  objectives: string | null
  deliverables: string | null
  progress: number
  start_date: string
  end_date: string | null
  status: ProjectStatus
  tasks_count?: number
  interns: ProjectIntern[]
  created_at: string | null
}

export interface CreateProjectPayload {
  title: string
  description: string
  objectives?: string
  deliverables?: string
  start_date: string
  end_date?: string
}

export interface UpdateProjectPayload {
  title?: string
  description?: string
  objectives?: string
  deliverables?: string
  end_date?: string
}

export interface EvaluateInternPayload {
  score: number
  comment?: string
}
