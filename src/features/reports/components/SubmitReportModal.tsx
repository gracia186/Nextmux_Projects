import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/Elements'
import { Button } from '@/components/ui/Button'
import { useSubmitReport } from '../hooks/useReports'

const schema = z.object({
  type: z.enum(['weekly', 'monthly']),
  period_start: z.string().min(1, 'La date de début est requise.'),
  period_end: z.string().min(1, 'La date de fin est requise.'),
  file: z.instanceof(File, { message: 'Le fichier du rapport est requis.' }),
})

type FormValues = z.infer<typeof schema>

export function SubmitReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const submit = useSubmitReport()
  const [fileName, setFileName] = useState<string>()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { type: 'weekly' } })

  function onSubmit(values: FormValues) {
    submit.mutate(values, {
      onSuccess: () => {
        reset()
        setFileName(undefined)
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Déposer un rapport">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Select label="Type de rapport" required {...register('type')}>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Début de période" type="date" required error={errors.period_start?.message} {...register('period_start')} />
          <Input label="Fin de période" type="date" required error={errors.period_end?.message} {...register('period_end')} />
        </div>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <FileInput
              label="Fichier (PDF, JPG, PNG — 10 Mo max)"
              accept=".pdf,.jpg,.jpeg,.png"
              fileName={fileName}
              error={errors.file?.message as string | undefined}
              onFileSelected={(f) => {
                field.onChange(f)
                setFileName(f?.name)
              }}
            />
          )}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={submit.isPending}>
            Déposer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
