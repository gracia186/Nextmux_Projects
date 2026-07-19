import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { CreateUserPayload, UpdateUserPayload, UserFilters } from '../types'

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.list(filters),
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Utilisateur créé', "Une invitation a été envoyée par email.")
    },
    onError: (error) => notifyError('Échec de la création', extractErrorMessage(error)),
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Utilisateur mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Compte désactivé')
    },
    onError: (error) => notifyError('Échec de la désactivation', extractErrorMessage(error)),
  })
}

export function useAssignMentor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mentorId }: { id: string; mentorId: string }) => usersApi.assignMentor(id, mentorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Mentor affecté avec succès')
    },
    onError: (error) => notifyError("Échec de l'affectation", extractErrorMessage(error)),
  })
}

export function useTerminateInternship() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => usersApi.terminateInternship(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Stage clôturé avec succès')
    },
    onError: (error) => notifyError('Échec de la clôture', extractErrorMessage(error)),
  })
}

export function usePurgeUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.purge(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Données anonymisées avec succès')
    },
    onError: (error) => notifyError("Échec de l'anonymisation", extractErrorMessage(error)),
  })
}

export function useResendInvitation() {
  return useMutation({
    mutationFn: (id: string) => usersApi.resendInvitation(id),
    onSuccess: () => notifySuccess('Invitation renvoyée'),
    onError: (error) => notifyError("Échec de l'envoi", extractErrorMessage(error)),
  })
}

export function useUpdateInternshipDates() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ internId, payload }: { internId: string; payload: { start_date: string; end_date: string } }) =>
      usersApi.updateInternshipDates(internId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      notifySuccess('Dates du stage mises à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}
