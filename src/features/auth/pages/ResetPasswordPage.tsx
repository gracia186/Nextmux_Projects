import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useResetPassword } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'

const schema = z
  .object({
    email: z.string().min(1, 'Email requis').email(),
    password: z
      .string()
      .min(8, 'Au moins 8 caractères')
      .regex(/[a-z]/, 'Doit contenir une minuscule')
      .regex(/[A-Z]/, 'Doit contenir une majuscule')
      .regex(/[0-9]/, 'Doit contenir un chiffre'),
    password_confirmation: z.string(),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'La confirmation ne correspond pas.',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const emailFromLink = params.get('email') ?? ''
  const mutation = useResetPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: emailFromLink } })

  return (
    <AuthShell title="Réinitialiser le mot de passe" subtitle="Choisissez un nouveau mot de passe sécurisé.">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((v) => mutation.mutate({ ...v, token }))}
      >
        <Input label="Adresse email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Nouveau mot de passe" type="password" error={errors.password?.message} {...register('password')} />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" loading={mutation.isPending} className="w-full">
          Réinitialiser
        </Button>
      </form>
    </AuthShell>
  )
}
