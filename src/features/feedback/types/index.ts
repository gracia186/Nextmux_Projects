import type { User } from '@/types/common'

export interface InternshipFeedback {
  id: string
  intern?: User
  welcome_rating: number
  mentorship_rating: number
  atmosphere_rating: number
  professional_value_rating: number
  recommendation_score: number
  comment: string | null
  is_anonymous: boolean
  created_at: string | null
}

export interface SubmitFeedbackPayload {
  welcome_rating: number
  mentorship_rating: number
  atmosphere_rating: number
  professional_value_rating: number
  recommendation_score: number
  comment?: string
  is_anonymous?: boolean
}
