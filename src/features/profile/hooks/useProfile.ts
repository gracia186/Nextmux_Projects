import { useMutation, useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profileApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { UpdateProfilePayload } from '../types'

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: profileApi.me })
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileApi.update(payload),
    onSuccess: (user) => {
      setUser(user)
      notifySuccess('Profil mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useUploadAvatar() {
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (user) => {
      setUser(user)
      notifySuccess('Photo de profil mise à jour')
    },
    onError: (error) => notifyError('Échec du téléversement', extractErrorMessage(error)),
  })
}

export function useEnableMfa() {
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: (enabled: boolean) => profileApi.enableMfa(enabled),
    onSuccess: (user) => {
      setUser(user)
      notifySuccess(user.mfa_enabled ? 'Authentification à deux facteurs activée' : 'Authentification à deux facteurs désactivée')
    },
    onError: (error) => notifyError('Échec', extractErrorMessage(error)),
  })
}

export function useUpdateMfaSecret() {
  return useMutation({
    mutationFn: (secret: string) => profileApi.updateMfaSecret(secret),
    onSuccess: () => notifySuccess('Secret MFA mis à jour'),
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useDataExport() {
  return useMutation({
    mutationFn: () => profileApi.dataExport(),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'nextmux-mes-donnees.json'
      a.click()
      URL.revokeObjectURL(url)
      notifySuccess('Export téléchargé')
    },
    onError: (error) => notifyError("Échec de l'export", extractErrorMessage(error)),
  })
}
