import type { User } from '@/types/common'

export type EventAudience = 'all' | 'interns' | 'mentors'

export interface Event {
  id: string
  author?: User
  title: string
  content: string
  audience: EventAudience
  is_pinned: boolean
  published_at: string | null
  created_at: string | null
}

export interface PublishEventPayload {
  title: string
  content: string
  audience: EventAudience
  is_pinned?: boolean
}

export interface UpdateEventPayload {
  title?: string
  content?: string
  audience?: EventAudience
  is_pinned?: boolean
}
