import { useMutation } from '@tanstack/react-query'
import { feedbackApi } from '../api/feedbackApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { SubmitFeedbackPayload } from '../types'

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (payload: SubmitFeedbackPayload) => feedbackApi.submit(payload),
    onSuccess: () => notifySuccess('Merci pour votre avis !', 'Votre retour a bien été enregistré.'),
    onError: (error) => notifyError("Échec de l'envoi", extractErrorMessage(error)),
  })
}
