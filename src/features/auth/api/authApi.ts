import { apiClient } from '@/lib/axios'
import type { ApiSuccess, MessageData, User } from '@/types/common'
import type {
  AcceptInvitationPayload,
  ForgotPasswordPayload,
  InvitationCheckData,
  LoginPayload,
  LoginResponseData,
  ResetPasswordPayload,
} from '../types'

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiSuccess<LoginResponseData>>('/auth/login', payload)
    return data.data
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>('/auth/logout')
    return data.data
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>('/auth/forgot-password', payload)
    return data.data
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<ApiSuccess<MessageData>>('/auth/reset-password', payload)
    return data.data
  },

  checkInvitation: async (token: string) => {
    const { data } = await apiClient.get<ApiSuccess<InvitationCheckData>>(`/auth/invitation/${token}`)
    return data.data
  },

  acceptInvitation: async (payload: AcceptInvitationPayload) => {
    const { data } = await apiClient.post<ApiSuccess<{ message: string; user: User }>>(
      '/auth/invitation/accept',
      payload
    )
    return data.data
  },
}
