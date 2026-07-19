import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../api/documentsApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { MentorValidateDocumentPayload, RequestDocumentPayload } from '../types'

export function useDocuments() {
  return useQuery({ queryKey: ['documents'], queryFn: documentsApi.list })
}

export function usePendingDocumentsForMentor() {
  return useQuery({ queryKey: ['documents', 'pending-mentor'], queryFn: documentsApi.pendingForMentor })
}

export function usePendingDocumentsForAdmin() {
  return useQuery({ queryKey: ['documents', 'pending-admin'], queryFn: documentsApi.pendingForAdmin })
}

export function useRequestDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RequestDocumentPayload) => documentsApi.request(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      notifySuccess('Demande envoyée à votre mentor')
    },
    onError: (error) => notifyError('Échec de la demande', extractErrorMessage(error)),
  })
}

export function useMentorValidateDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MentorValidateDocumentPayload }) =>
      documentsApi.mentorValidate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      notifySuccess('Demande traitée')
    },
    onError: (error) => notifyError('Échec du traitement', extractErrorMessage(error)),
  })
}

export function useUploadDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => documentsApi.upload(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      notifySuccess('Document téléversé avec succès')
    },
    onError: (error) => notifyError('Échec du téléversement', extractErrorMessage(error)),
  })
}

export function useRejectDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => documentsApi.reject(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      notifySuccess('Demande rejetée')
    },
    onError: (error) => notifyError('Échec du rejet', extractErrorMessage(error)),
  })
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (id: string) => documentsApi.download(id),
    onSuccess: (data) => window.open(data.url, '_blank'),
    onError: (error) => notifyError('Échec du téléchargement', extractErrorMessage(error)),
  })
}
