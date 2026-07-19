import { Badge } from '@/components/ui/DataDisplay'
import type { UserRole, UserStatus } from '@/types/common'

const roleLabels: Record<UserRole, string> = { admin: 'Administrateur', mentor: 'Mentor', intern: 'Stagiaire' }
const roleTones: Record<UserRole, 'brand' | 'info' | 'neutral'> = { admin: 'brand', mentor: 'info', intern: 'neutral' }

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge tone={roleTones[role]}>{roleLabels[role]}</Badge>
}

const statusLabels: Record<UserStatus, string> = { pending: 'En attente', active: 'Actif', inactive: 'Inactif' }
const statusTones: Record<UserStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  active: 'success',
  inactive: 'danger',
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={statusTones[status]}>{statusLabels[status]}</Badge>
}
