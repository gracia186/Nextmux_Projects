import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projectsApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { CreateProjectPayload, EvaluateInternPayload, UpdateProjectPayload } from '../types'

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: projectsApi.list })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Projet créé avec succès')
    },
    onError: (error) => notifyError('Échec de la création', extractErrorMessage(error)),
  })
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => projectsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Projet mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useAssignInterns(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (internIds: string[]) => projectsApi.assign(id, internIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Stagiaires affectés')
    },
    onError: (error) => notifyError("Échec de l'affectation", extractErrorMessage(error)),
  })
}

export function useUnassignIntern(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (internId: string) => projectsApi.unassign(id, internId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Stagiaire retiré')
    },
    onError: (error) => notifyError('Échec du retrait', extractErrorMessage(error)),
  })
}

export function useUpdateProgress(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (progress: number) => projectsApi.updateProgress(id, progress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Avancement mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useEvaluateIntern(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ internId, payload }: { internId: string; payload: EvaluateInternPayload }) =>
      projectsApi.evaluate(id, internId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Évaluation enregistrée')
    },
    onError: (error) => notifyError("Échec de l'évaluation", extractErrorMessage(error)),
  })
}
