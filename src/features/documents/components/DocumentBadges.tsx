import { Badge } from '@/components/ui/DataDisplay'
import type { DocumentStatus, DocumentType } from '../types'

const statusLabels: Record<DocumentStatus, string> = {
  pending: 'En attente',
  mentor_approved: 'Validé par le mentor',
  mentor_rejected: 'Rejeté par le mentor',
  admin_rejected: 'Rejeté par l’admin',
  completed: 'Terminé',
}

const statusTones: Record<DocumentStatus, 'warning' | 'info' | 'danger' | 'success'> = {
  pending: 'warning',
  mentor_approved: 'info',
  mentor_rejected: 'danger',
  admin_rejected: 'danger',
  completed: 'success',
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return <Badge tone={statusTones[status]}>{statusLabels[status]}</Badge>
}

const typeLabels: Record<DocumentType, string> = { attestation: 'Attestation', convention: 'Convention' }

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  return <Badge tone="neutral">{typeLabels[type]}</Badge>
}
