import { Badge } from '@/components/ui/DataDisplay'
import type { ReportStatus, ReportType } from '../types'

const statusLabels: Record<ReportStatus, string> = { pending: 'En attente', validated: 'Validé', rejected: 'Rejeté' }
const statusTones: Record<ReportStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  validated: 'success',
  rejected: 'danger',
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <Badge tone={statusTones[status]}>{statusLabels[status]}</Badge>
}

const typeLabels: Record<ReportType, string> = { weekly: 'Hebdomadaire', monthly: 'Mensuel' }

export function ReportTypeBadge({ type }: { type: ReportType }) {
  return <Badge tone="neutral">{typeLabels[type]}</Badge>
}
