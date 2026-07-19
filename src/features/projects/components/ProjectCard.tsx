import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/DataDisplay'
import { Badge } from '@/components/ui/DataDisplay'
import { Avatar } from '@/components/ui/Elements'
import type { Project, ProjectStatus } from '../types'

const statusLabels: Record<ProjectStatus, string> = { active: 'Actif', completed: 'Terminé', archived: 'Archivé' }
const statusTones: Record<ProjectStatus, 'success' | 'neutral' | 'info'> = {
  active: 'success',
  completed: 'info',
  archived: 'neutral',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={statusTones[status]}>{statusLabels[status]}</Badge>
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="flex h-full flex-col gap-3 transition-shadow hover:shadow-panel">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink-950">{project.title}</h3>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-ink-700/60">{project.description}</p>
        <div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${project.progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-700/50">{project.progress}% complété</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.interns.slice(0, 4).map((i) => (
              <Avatar key={i.id} name={i.name} src={i.avatar_path} size="sm" />
            ))}
          </div>
          {project.tasks_count !== undefined && (
            <span className="text-xs text-ink-700/50">{project.tasks_count} tâche(s)</span>
          )}
        </div>
      </Card>
    </Link>
  )
}
