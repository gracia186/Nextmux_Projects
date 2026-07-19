import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/store/authStore'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { LoginPayload, ForgotPasswordPayload, ResetPasswordPayload, AcceptInvitationPayload } from '../types'

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setSession(data.user, data.token)
      notifySuccess('Bienvenue', `Connecté en tant que ${data.user.name}`)
      const dest = data.user.role === 'admin' ? '/admin' : data.user.role === 'mentor' ? '/mentor' : '/intern'
      navigate(dest, { replace: true })
    },
    onError: (error) => notifyError('Connexion impossible', extractErrorMessage(error)),
  })
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearSession()
      navigate('/login', { replace: true })
    },
    onError: () => {
      // Even if the server call fails, clear the local session so the user isn't stuck.
      clearSession()
      navigate('/login', { replace: true })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
    onSuccess: () => notifySuccess('Email envoyé', 'Vérifiez votre boîte de réception.'),
    onError: (error) => notifyError('Échec de la demande', extractErrorMessage(error)),
  })
}

export function useResetPassword() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onSuccess: () => {
      notifySuccess('Mot de passe réinitialisé', 'Vous pouvez maintenant vous connecter.')
      navigate('/login', { replace: true })
    },
    onError: (error) => notifyError('Échec de la réinitialisation', extractErrorMessage(error)),
  })
}

export function useCheckInvitation(token: string | undefined) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => authApi.checkInvitation(token as string),
    enabled: Boolean(token),
    retry: false,
  })
}

export function useAcceptInvitation() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) => authApi.acceptInvitation(payload),
    onSuccess: () => {
      notifySuccess('Compte activé', 'Vous pouvez maintenant vous connecter.')
      navigate('/login', { replace: true })
    },
    onError: (error) => notifyError('Échec de l’activation', extractErrorMessage(error)),
  })
}
