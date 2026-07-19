import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useCreateTask } from '../hooks/useTasks'
import type { ProjectIntern } from '@/features/projects/types'

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateTaskModal({
  open,
  onClose,
  projectId,
  interns,
}: {
  open: boolean
  onClose: () => void
  projectId: string
  interns: ProjectIntern[]
}) {
  const createTask = useCreateTask(projectId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function submit(values: FormValues) {
    createTask.mutate(
      { ...values, assigned_to: values.assigned_to || undefined },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Créer une tâche">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <Input label="Titre" required error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} />
        <Select label="Assigner à" {...register('assigned_to')}>
          <option value="">— Non assignée —</option>
          {interns.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </Select>
        <Input label="Échéance" type="date" error={errors.due_date?.message} {...register('due_date')} />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={createTask.isPending}>
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
