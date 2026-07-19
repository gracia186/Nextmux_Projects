import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/DataDisplay'
import { useAcceptInvitation, useCheckInvitation } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'

const schema = z
  .object({
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

const roleLabels: Record<string, string> = { admin: 'Administrateur', mentor: 'Mentor', intern: 'Stagiaire' }

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>()
  const { data: invitation, isLoading, isError } = useCheckInvitation(token)
  const mutation = useAcceptInvitation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (isLoading) {
    return (
      <AuthShell title="Vérification de l'invitation">
        <PageSpinner />
      </AuthShell>
    )
  }

  if (isError || !invitation) {
    return (
      <AuthShell title="Lien invalide" subtitle="Ce lien d'invitation est invalide ou a expiré.">
        <p className="text-sm text-ink-700/60">Demandez à votre administrateur de vous renvoyer une invitation.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Activer votre compte" subtitle={`Bienvenue ${invitation.name} (${roleLabels[invitation.role] ?? invitation.role})`}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((v) => mutation.mutate({ ...v, token: token as string }))}
      >
        <Input label="Adresse email" value={invitation.email} disabled />
        <Input label="Mot de passe" type="password" error={errors.password?.message} {...register('password')} />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" loading={mutation.isPending} className="w-full">
          Activer mon compte
        </Button>
      </form>
    </AuthShell>
  )
}
