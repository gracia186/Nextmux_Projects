import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../api/attendanceApi'
import { notifyError, notifySuccess } from '@/store/toastStore'
import { extractErrorMessage } from '@/lib/axios'
import type { CorrectAttendancePayload, RecordAttendancePayload } from '../types'

export function useAttendanceHistory() {
  return useQuery({ queryKey: ['attendance', 'history'], queryFn: attendanceApi.history })
}

export function useAttendanceDashboard() {
  return useQuery({ queryKey: ['attendance', 'dashboard'], queryFn: attendanceApi.dashboard })
}

export function useInternAttendance(internId: string | undefined) {
  return useQuery({
    queryKey: ['attendance', 'intern', internId],
    queryFn: () => attendanceApi.byIntern(internId as string),
    enabled: Boolean(internId),
  })
}

export function useRecordAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecordAttendancePayload) => attendanceApi.record(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      notifySuccess('Présence enregistrée')
    },
    onError: (error) => notifyError("Échec de l'enregistrement", extractErrorMessage(error)),
  })
}

export function useRecordDeparture() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => attendanceApi.recordDeparture(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      notifySuccess('Départ enregistré')
    },
    onError: (error) => notifyError('Échec', extractErrorMessage(error)),
  })
}

export function useCorrectAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CorrectAttendancePayload }) =>
      attendanceApi.correct(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      notifySuccess('Présence corrigée')
    },
    onError: (error) => notifyError('Échec de la correction', extractErrorMessage(error)),
  })
}
