import type { User } from '@/types/common'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponseData {
  user: User
  token: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface AcceptInvitationPayload {
  token: string
  password: string
  password_confirmation: string
}

export interface InvitationCheckData {
  name: string
  email: string
  role: string
}
