import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Select, Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useRequestDocument } from '../hooks/useDocuments'

const schema = z.object({
  type: z.enum(['attestation', 'convention']),
  request_note: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export function RequestDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const request = useRequestDocument()
  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'attestation' },
  })

  function submit(values: FormValues) {
    request.mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Demander un document" size="sm">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <Select label="Type de document" required {...register('type')}>
          <option value="attestation">Attestation de stage</option>
          <option value="convention">Convention de stage</option>
        </Select>
        <Textarea label="Note (optionnelle)" {...register('request_note')} />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={request.isPending}>
            Envoyer la demande
          </Button>
        </div>
      </form>
    </Modal>
  )
}
