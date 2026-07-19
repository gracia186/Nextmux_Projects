import { Badge } from '@/components/ui/DataDisplay'
import type { AttendanceStatus } from '../types'

const labels: Record<AttendanceStatus, string> = { present: 'Présent', absent: 'Absent', late: 'En retard' }
const tones: Record<AttendanceStatus, 'success' | 'danger' | 'warning'> = {
  present: 'success',
  absent: 'danger',
  late: 'warning',
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>
}
