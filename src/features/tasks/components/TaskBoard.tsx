import { useState } from 'react'
import { Card } from '@/components/ui/DataDisplay'
import { Avatar } from '@/components/ui/Elements'
import { Select } from '@/components/ui/Field'
import { ConfirmDialog } from '@/components/ui/Modal'
import { useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks'
import { taskStatusLabels } from './TaskStatusBadge'
import { useAuthStore } from '@/store/authStore'
import type { Task, TaskStatus } from '../types'

const columns: TaskStatus[] = ['todo', 'in_progress', 'done']

export function TaskBoard({ tasks, projectId, canManage }: { tasks: Task[]; projectId: string; canManage: boolean }) {
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask(projectId)
  const user = useAuthStore((s) => s.user)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function canEditStatus(task: Task) {
    if (canManage) return true
    return user?.role === 'intern' && task.assigned_to?.id === user.id
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => {
        const items = tasks.filter((t) => t.status === col)
        return (
          <div key={col} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink-800">{taskStatusLabels[col]}</h4>
              <span className="text-xs text-ink-700/40">{items.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink-950">{task.title}</p>
                    {canManage && (
                      <button
                        onClick={() => setDeletingId(task.id)}
                        className="text-ink-700/30 hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {task.description && <p className="mt-1 line-clamp-2 text-xs text-ink-700/60">{task.description}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    {task.assigned_to ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={task.assigned_to.name} src={task.assigned_to.avatar_path} size="sm" />
                        <span className="text-xs text-ink-700/60">{task.assigned_to.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-700/40">Non assignée</span>
                    )}
                    {task.due_date && (
                      <span className="text-xs text-ink-700/40">{new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                  {canEditStatus(task) && (
                    <Select
                      className="mt-3 text-xs"
                      value={task.status}
                      onChange={(e) => updateStatus.mutate({ id: task.id, status: e.target.value as TaskStatus })}
                    >
                      <option value="todo">À faire</option>
                      <option value="in_progress">En cours</option>
                      <option value="done">Terminée</option>
                    </Select>
                  )}
                </Card>
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-ink-700/15 py-6 text-center text-xs text-ink-700/40">
                  Aucune tâche
                </div>
              )}
            </div>
          </div>
        )
      })}

      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Supprimer cette tâche ?"
        description="Cette action est irréversible."
        destructive
        loading={deleteTask.isPending}
        onConfirm={() => deletingId && deleteTask.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        onClose={() => setDeletingId(null)}
      />
    </div>
  )
}
