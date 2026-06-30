import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../types/auth.schema';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isPending, error } = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {error && <p>Email ou mot de passe incorrect</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}