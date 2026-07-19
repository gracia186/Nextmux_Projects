import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useCreateUser, useUsers } from '../hooks/useUsers'

const schema = z
  .object({
    name: z.string().min(1, 'Le nom est requis.'),
    email: z.string().min(1, "L'email est requis.").email("L'email n'est pas valide."),
    role: z.enum(['admin', 'mentor', 'intern']),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    mentor_id: z.string().optional(),
  })
  .refine((v) => v.role !== 'intern' || Boolean(v.start_date), {
    message: 'La date de début est requise pour un stagiaire.',
    path: ['start_date'],
  })
  .refine((v) => v.role !== 'intern' || Boolean(v.end_date), {
    message: 'La date de fin est requise pour un stagiaire.',
    path: ['end_date'],
  })

type FormValues = z.infer<typeof schema>

export function CreateUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createUser = useCreateUser()
  const { data: mentorsData } = useUsers({ role: 'mentor' })
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: 'intern' } })

  const role = watch('role')

  function submit(values: FormValues) {
    createUser.mutate(
      {
        name: values.name,
        email: values.email,
        role: values.role,
        start_date: values.role === 'intern' ? values.start_date : undefined,
        end_date: values.role === 'intern' ? values.end_date : undefined,
        mentor_id: values.role === 'intern' && values.mentor_id ? values.mentor_id : undefined,
      },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Créer un utilisateur">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
        <Input label="Nom complet" required error={errors.name?.message} {...register('name')} />
        <Input label="Adresse email" type="email" required error={errors.email?.message} {...register('email')} />
        <Select label="Rôle" required error={errors.role?.message} {...register('role')}>
          <option value="intern">Stagiaire</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Administrateur</option>
        </Select>
        {role === 'intern' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date de début" type="date" required error={errors.start_date?.message} {...register('start_date')} />
              <Input label="Date de fin" type="date" required error={errors.end_date?.message} {...register('end_date')} />
            </div>
            <Select label="Mentor (optionnel)" {...register('mentor_id')}>
              <option value="">— Aucun mentor pour l'instant —</option>
              {mentorsData?.users.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={createUser.isPending}>
            Créer et inviter
          </Button>
        </div>
      </form>
    </Modal>
  )
}
