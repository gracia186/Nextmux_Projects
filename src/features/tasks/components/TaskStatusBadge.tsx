import { Badge } from '@/components/ui/DataDisplay'
import type { TaskStatus } from '../types'

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
}

const tones: Record<TaskStatus, 'neutral' | 'info' | 'success'> = {
  todo: 'neutral',
  in_progress: 'info',
  done: 'success',
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={tones[status]}>{taskStatusLabels[status]}</Badge>
}
