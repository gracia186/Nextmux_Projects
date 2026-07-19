import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUsers } from '@/features/users/hooks/useUsers'
import { useAssignInterns } from '../hooks/useProjects'
import type { ProjectIntern } from '../types'

export function AssignInternsModal({
  open,
  onClose,
  projectId,
  alreadyAssigned,
}: {
  open: boolean
  onClose: () => void
  projectId: string
  alreadyAssigned: ProjectIntern[]
}) {
  const { data } = useUsers({ role: 'intern', status: 'active' })
  const assign = useAssignInterns(projectId)
  const [selected, setSelected] = useState<string[]>([])

  const assignedIds = new Set(alreadyAssigned.map((i) => i.id))
  const available = data?.users.filter((u) => !assignedIds.has(u.id)) ?? []

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <Modal open={open} onClose={onClose} title="Affecter des stagiaires" size="sm">
      <div className="flex flex-col gap-3">
        {available.length === 0 ? (
          <p className="text-sm text-ink-700/60">Tous les stagiaires actifs sont déjà affectés.</p>
        ) : (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {available.map((u) => (
              <label key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-900/5">
                <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} />
                <span className="text-sm">{u.name}</span>
              </label>
            ))}
          </div>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            disabled={selected.length === 0}
            loading={assign.isPending}
            onClick={() =>
              assign.mutate(selected, {
                onSuccess: () => {
                  setSelected([])
                  onClose()
                },
              })
            }
          >
            Affecter
          </Button>
        </div>
      </div>
    </Modal>
  )
}
