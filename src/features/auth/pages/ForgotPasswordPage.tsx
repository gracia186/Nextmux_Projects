import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useForgotPassword } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'

const schema = z.object({
  email: z.string().min(1, "L'adresse email est requise.").email("L'adresse email n'est pas valide."),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <AuthShell title="Mot de passe oublié" subtitle="Recevez un lien de réinitialisation par email.">
      {mutation.isSuccess ? (
        <div className="rounded-xl bg-mint-500/10 p-4 text-sm text-mint-500">
          Si un compte existe avec cette adresse, un email de réinitialisation a été envoyé.
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <Input label="Adresse email" type="email" placeholder="vous@nextmux.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" loading={mutation.isPending} className="w-full">
            Envoyer le lien
          </Button>
        </form>
      )}
      <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand-600 hover:underline">
        ← Retour à la connexion
      </Link>
    </AuthShell>
  )
}
