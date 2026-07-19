import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasksApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { CreateTaskPayload, TaskStatus, UpdateTaskPayload } from '../types'

export function useProjectTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => tasksApi.byProject(projectId as string),
    enabled: Boolean(projectId),
  })
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.get(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(projectId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', 'project', projectId] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Tâche créée')
    },
    onError: (error) => notifyError('Échec de la création', extractErrorMessage(error)),
  })
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => tasksApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      notifySuccess('Tâche mise à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      notifySuccess('Statut mis à jour')
    },
    onError: (error) => notifyError('Échec de la mise à jour', extractErrorMessage(error)),
  })
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', 'project', projectId] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      notifySuccess('Tâche supprimée')
    },
    onError: (error) => notifyError('Échec de la suppression', extractErrorMessage(error)),
  })
}
