import { useQuery } from '@tanstack/react-query'
import { statsApi } from '../api/statsApi'

export function useOverviewStats() {
  return useQuery({ queryKey: ['stats', 'overview'], queryFn: statsApi.overview })
}

export function useAttendanceStats() {
  return useQuery({ queryKey: ['stats', 'attendance'], queryFn: statsApi.attendance })
}

export function useReportStats() {
  return useQuery({ queryKey: ['stats', 'reports'], queryFn: statsApi.reports })
}

export function useDocumentStats() {
  return useQuery({ queryKey: ['stats', 'documents'], queryFn: statsApi.documents })
}
