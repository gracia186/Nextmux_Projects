import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '../api/reportsApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { SubmitReportPayload, ValidateReportPayload } from '../types'

export function useReports(page: number) {
  return useQuery({ queryKey: ['reports', page], queryFn: () => reportsApi.list(page) })
}

export function usePendingReports() {
  return useQuery({ queryKey: ['reports', 'pending'], queryFn: reportsApi.pending })
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportsApi.get(id as string),
    enabled: Boolean(id),
  })
}

export function useSubmitReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitReportPayload) => reportsApi.submit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      notifySuccess('Rapport déposé avec succès')
    },
    onError: (error) => notifyError('Échec du dépôt', extractErrorMessage(error)),
  })
}

export function useUpdateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<{ period_start: string; period_end: string; file: File }> }) =>
      reportsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      notifySuccess('Rapport mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useHideReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reportsApi.hide(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      notifySuccess('Rapport masqué de votre historique')
    },
    onError: (error) => notifyError('Échec', extractErrorMessage(error)),
  })
}

export function useValidateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ValidateReportPayload }) => reportsApi.validate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      notifySuccess('Rapport traité avec succès')
    },
    onError: (error) => notifyError('Échec du traitement', extractErrorMessage(error)),
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: (id: string) => reportsApi.download(id),
    onSuccess: (data) => window.open(data.url, '_blank'),
    onError: (error) => notifyError('Échec du téléchargement', extractErrorMessage(error)),
  })
}
