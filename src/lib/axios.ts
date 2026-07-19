import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../store/authStore'
import { notifyError } from '../store/toastStore'
import type { ApiErrorBody, ValidationErrorBody } from '../types/common'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Human-readable message extraction, used by mutations that don't want to
// roll their own error handling.
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody | ValidationErrorBody>
    const body = err.response?.data

    if (body && 'error' in body && body.error?.message) {
      return body.error.message
    }
    if (body && 'errors' in body && body.errors) {
      const firstKey = Object.keys(body.errors)[0]
      return body.errors[firstKey]?.[0] ?? body.message
    }
    if (body && 'message' in body && body.message) {
      return body.message
    }
    if (err.response?.status === 401) {
      return "Votre session a expiré, veuillez vous reconnecter."
    }
    if (err.response?.status === 403) {
      return "Vous n'êtes pas autorisé à effectuer cette action."
    }
    if (err.response?.status === 404) {
      return 'Ressource introuvable.'
    }
    if (!err.response) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    }
  }
  return "Une erreur inattendue s'est produite."
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated
      useAuthStore.getState().clearSession()
      if (wasAuthenticated) {
        notifyError('Session expirée', 'Veuillez vous reconnecter.')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
