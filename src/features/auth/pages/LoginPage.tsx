import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useLogin } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'

const schema = z.object({
  email: z.string().min(1, "L'adresse email est requise.").email("L'adresse email n'est pas valide."),
  password: z.string().min(1, 'Le mot de passe est requis.'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <AuthShell
      title="Connexion"
      subtitle="Accédez à votre espace STAMUX."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => login.mutate(v))}>
        <Input label="Adresse email" type="email" placeholder="vous@stamux.com" error={errors.email?.message} {...register('email')} />
        <Input label="Mot de passe" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" loading={login.isPending} className="mt-1 w-full">
          Se connecter
        </Button>
      </form>
    </AuthShell>
  )
}
