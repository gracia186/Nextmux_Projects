import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/eventsApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { PublishEventPayload, UpdateEventPayload } from '../types'

export function useEvents() {
  return useQuery({ queryKey: ['events'], queryFn: eventsApi.list })
}

export function usePublishEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PublishEventPayload) => eventsApi.publish(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      notifySuccess('Annonce publiée')
    },
    onError: (error) => notifyError('Échec de la publication', extractErrorMessage(error)),
  })
}

export function useUpdateEvent(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateEventPayload) => eventsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      notifySuccess('Annonce mise à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
      notifySuccess('Annonce supprimée')
    },
    onError: (error) => notifyError('Échec de la suppression', extractErrorMessage(error)),
  })
}
