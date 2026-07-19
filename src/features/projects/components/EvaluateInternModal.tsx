import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useEvaluateIntern } from '../hooks/useProjects'
import type { ProjectIntern } from '../types'

export function EvaluateInternModal({
  open,
  onClose,
  projectId,
  intern,
}: {
  open: boolean
  onClose: () => void
  projectId: string
  intern: ProjectIntern | null
}) {
  const evaluate = useEvaluateIntern(projectId)
  const [score, setScore] = useState(intern?.evaluation_score ?? 80)
  const [comment, setComment] = useState(intern?.evaluation_comment ?? '')

  return (
    <Modal open={open} onClose={onClose} title={`Évaluer ${intern?.name ?? ''}`} size="sm">
      <div className="flex flex-col gap-4">
        <Input
          label="Score (sur 100)"
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
        <Textarea label="Commentaire" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            loading={evaluate.isPending}
            disabled={!intern}
            onClick={() =>
              intern &&
              evaluate.mutate(
                { internId: intern.id, payload: { score, comment: comment || undefined } },
                { onSuccess: onClose }
              )
            }
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  )
}
