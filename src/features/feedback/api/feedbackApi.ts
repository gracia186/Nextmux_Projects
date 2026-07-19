import { apiClient } from '@/lib/axios'
import type { ApiSuccess } from '@/types/common'
import type { InternshipFeedback, SubmitFeedbackPayload } from '../types'

export const feedbackApi = {
  submit: async (payload: SubmitFeedbackPayload) => {
    const { data } = await apiClient.post<ApiSuccess<InternshipFeedback>>('/feedback', payload)
    return data.data
  },
}
