import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useCreateProject } from '../hooks/useProjects'

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  description: z.string().min(1, 'La description est requise.'),
  objectives: z.string().optional(),
  deliverables: z.string().optional(),
  start_date: z.string().min(1, 'La date de début est requise.'),
  end_date: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createProject = useCreateProject()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function submit(values: FormValues) {
    createProject.mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Créer un projet" size="lg">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <Input label="Titre" required error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" required error={errors.description?.message} {...register('description')} />
        <Textarea label="Objectifs" error={errors.objectives?.message} {...register('objectives')} />
        <Textarea label="Livrables attendus" error={errors.deliverables?.message} {...register('deliverables')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date de début" type="date" required error={errors.start_date?.message} {...register('start_date')} />
          <Input label="Date de fin (optionnelle)" type="date" error={errors.end_date?.message} {...register('end_date')} />
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={createProject.isPending}>
            Créer le projet
          </Button>
        </div>
      </form>
    </Modal>
  )
}
