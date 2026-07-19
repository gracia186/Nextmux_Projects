import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject, useUpdateProgress, useUnassignIntern } from '../hooks/useProjects'
import { useProjectTasks } from '@/features/tasks/hooks/useTasks'
import { Card, CardHeader, PageSpinner, EmptyState } from '@/components/ui/DataDisplay'
import { Avatar } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { ProjectStatusBadge } from '../components/ProjectCard'
import { AssignInternsModal } from '../components/AssignInternsModal'
import { EvaluateInternModal } from '../components/EvaluateInternModal'
import { CreateTaskModal } from '@/features/tasks/components/CreateTaskModal'
import { TaskBoard } from '@/features/tasks/components/TaskBoard'
import { useAuthStore } from '@/store/authStore'
import type { ProjectIntern } from '../types'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading } = useProject(id)
  const { data: tasks } = useProjectTasks(id)
  const updateProgress = useUpdateProgress(id as string)
  const unassign = useUnassignIntern(id as string)
  const role = useAuthStore((s) => s.user?.role)
  const isMentor = role === 'mentor'

  const [assignOpen, setAssignOpen] = useState(false)
  const [evaluating, setEvaluating] = useState<ProjectIntern | null>(null)
  const [taskOpen, setTaskOpen] = useState(false)
  const [unassigning, setUnassigning] = useState<string | null>(null)
  const [progressValue, setProgressValue] = useState<number | null>(null)

  if (isLoading) return <PageSpinner />
  if (!project) return <p>Projet introuvable.</p>

  const displayedProgress = progressValue ?? project.progress

  return (
    <div className="flex flex-col gap-5">
      <button onClick={() => navigate(-1)} className="w-fit text-sm text-ink-700/60 hover:text-ink-900">
        ← Retour aux projets
      </button>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{project.title}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="mt-2 max-w-2xl text-sm text-ink-700/60">{project.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.objectives && (
            <div>
              <p className="text-xs font-medium uppercase text-ink-700/40">Objectifs</p>
              <p className="mt-1 text-sm text-ink-800">{project.objectives}</p>
            </div>
          )}
          {project.deliverables && (
            <div>
              <p className="text-xs font-medium uppercase text-ink-700/40">Livrables attendus</p>
              <p className="mt-1 text-sm text-ink-800">{project.deliverables}</p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-800">Avancement</span>
            <span className="text-ink-700/60">{displayedProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/5">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${displayedProgress}%` }} />
          </div>
          {isMentor && (
            <input
              type="range"
              min={0}
              max={100}
              value={displayedProgress}
              onChange={(e) => setProgressValue(Number(e.target.value))}
              onMouseUp={() => progressValue !== null && updateProgress.mutate(progressValue)}
              onTouchEnd={() => progressValue !== null && updateProgress.mutate(progressValue)}
              className="mt-2 w-full accent-brand-600"
            />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Stagiaires affectés"
          action={
            isMentor && (
              <Button size="sm" onClick={() => setAssignOpen(true)}>
                + Affecter
              </Button>
            )
          }
        />
        {project.interns.length === 0 ? (
          <EmptyState title="Aucun stagiaire affecté" />
        ) : (
          <div className="flex flex-col gap-3">
            {project.interns.map((intern) => (
              <div key={intern.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-700/10 p-3">
                <div className="flex items-center gap-3">
                  <Avatar name={intern.name} src={intern.avatar_path} />
                  <div>
                    <p className="text-sm font-medium text-ink-950">{intern.name}</p>
                    {intern.evaluation_score !== null && (
                      <p className="text-xs text-mint-500">Évalué : {intern.evaluation_score}/100</p>
                    )}
                  </div>
                </div>
                {isMentor && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEvaluating(intern)}>
                      Évaluer
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setUnassigning(intern.id)}>
                      Retirer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Tâches"
          action={
            isMentor && (
              <Button size="sm" onClick={() => setTaskOpen(true)}>
                + Nouvelle tâche
              </Button>
            )
          }
        />
        {!tasks?.length ? (
          <EmptyState title="Aucune tâche pour ce projet" />
        ) : (
          <TaskBoard tasks={tasks} projectId={project.id} canManage={isMentor} />
        )}
      </Card>

      <AssignInternsModal open={assignOpen} onClose={() => setAssignOpen(false)} projectId={project.id} alreadyAssigned={project.interns} />
      <EvaluateInternModal open={Boolean(evaluating)} onClose={() => setEvaluating(null)} projectId={project.id} intern={evaluating} />
      <CreateTaskModal open={taskOpen} onClose={() => setTaskOpen(false)} projectId={project.id} interns={project.interns} />

      <ConfirmDialog
        open={Boolean(unassigning)}
        title="Retirer ce stagiaire du projet ?"
        loading={unassign.isPending}
        onConfirm={() => unassigning && unassign.mutate(unassigning, { onSuccess: () => setUnassigning(null) })}
        onClose={() => setUnassigning(null)}
      />
    </div>
  )
}
