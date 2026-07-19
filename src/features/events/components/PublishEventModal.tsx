import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { usePublishEvent } from '../hooks/useEvents'

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  content: z.string().min(1, 'Le contenu est requis.'),
  audience: z.enum(['all', 'interns', 'mentors']),
  is_pinned: z.boolean().optional(),
})
type FormValues = z.infer<typeof schema>

export function PublishEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const publish = usePublishEvent()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { audience: 'all' } })

  function submit(values: FormValues) {
    publish.mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Publier une annonce">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <Input label="Titre" required error={errors.title?.message} {...register('title')} />
        <Textarea label="Contenu" required error={errors.content?.message} {...register('content')} rows={6} />
        <Select label="Audience" required {...register('audience')}>
          <option value="all">Tout le monde</option>
          <option value="interns">Stagiaires uniquement</option>
          <option value="mentors">Mentors uniquement</option>
        </Select>
        <label className="flex items-center gap-2 text-sm text-ink-800">
          <input type="checkbox" {...register('is_pinned')} />
          Épingler cette annonce
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={publish.isPending}>
            Publier
          </Button>
        </div>
      </form>
    </Modal>
  )
}
