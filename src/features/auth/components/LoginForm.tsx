// Import du hook principal de React Hook Form
import { useForm } from 'react-hook-form';
// Import du resolver Zod pour la validation
import { zodResolver } from '@hookform/resolvers/zod';
// Import du schéma et du type des valeurs du formulaire
import { loginSchema, LoginFormValues } from '../types/auth.schema';
// Import du hook de mutation de login
import { useLogin } from '../hooks/useLogin';

// Déclaration et export du composant LoginForm
export function LoginForm() {
  // Initialisation React Hook Form avec validation Zod
  const {
    register,               // connecte les inputs au formulaire
    handleSubmit,           // valide avant d'appeler onSubmit
    formState: { errors },  // erreurs de validation par champ
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Hook de mutation : mutate pour déclencher, isPending pour l'état, error si échec API
  const { mutate, isPending, error } = useLogin();

  // Appelé après validation Zod réussie : envoie les valeurs à l'API
  const onSubmit = (values: LoginFormValues) => mutate(values);

  return (
    // Formulaire en colonne avec espacement régulier entre les groupes
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* ── Groupe champ email ── */}
      <div className="flex flex-col gap-1.5">
        {/* Label lié à l'input via htmlFor pour l'accessibilité */}
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Adresse email
        </label>
        {/* Input email avec bordure conditionnelle rouge si erreur Zod */}
        <input
          id="email"
          type="email"
          placeholder="admin@test.com"
          {...register('email')}
          style={{ height: '52px', borderRadius: '12px' }} // hauteur et coins comme défini
          className={`w-full px-4 border text-sm text-gray-900 placeholder-gray-400
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${errors.email
              ? 'border-red-400 bg-red-50'           // état erreur : fond et bordure rouges
              : 'border-gray-200 bg-white hover:border-gray-300' // état normal
            }`}
        />
        {/* Message d'erreur Zod affiché sous l'input si présent */}
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      {/* ── Groupe champ mot de passe ── */}
      <div className="flex flex-col gap-1.5">
        {/* Label associé à l'input password */}
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        {/* Input password avec masquage de la saisie */}
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          style={{ height: '52px', borderRadius: '12px' }} // même hauteur que l'email
          className={`w-full px-4 border text-sm text-gray-900 placeholder-gray-400
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${errors.password
              ? 'border-red-400 bg-red-50'           // état erreur
              : 'border-gray-200 bg-white hover:border-gray-300' // état normal
            }`}
        />
        {/* Message d'erreur Zod pour le mot de passe */}
        {errors.password && (
          <span className="text-xs text-red-500">{errors.password.message}</span>
        )}
      </div>

      {/* ── Bandeau d'erreur API : mauvais identifiants ou erreur réseau ── */}
      {/* Visible uniquement si la mutation useLogin retourne une erreur */}
      {error && (
        // Fond rouge clair avec bordure rouge pour signaler l'erreur
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          {/* Indicateur visuel rouge */}
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          {/* Message affiché à l'utilisateur */}
          <p className="text-sm text-red-600">Email ou mot de passe incorrect.</p>
        </div>
      )}

      {/* ── Bouton de soumission ── */}
      {/* Désactivé pendant isPending pour éviter les doubles soumissions */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          height: '52px',                  // hauteur identique aux inputs
          borderRadius: '12px',            // coins arrondis identiques aux inputs
          backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)', // dégradé teal → bleu nuit
          transition: 'all 0.25s',         // animation douce au survol
        }}
        className="w-full text-white text-sm font-semibold
          disabled:opacity-60 disabled:cursor-not-allowed
          hover:-translate-y-0.5"
        // hover:shadow ajouté via onMouseEnter/Leave si Tailwind ne suffit pas
        onMouseEnter={(e) => {
          // Ajout d'une ombre au survol pour l'effet de surélévation
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(90,160,150,0.35)';
        }}
        onMouseLeave={(e) => {
          // Suppression de l'ombre quand la souris quitte le bouton
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        {/* Spinner inline + texte pendant la requête, texte seul sinon */}
        {isPending ? (
          // Conteneur flex centré pour aligner spinner et texte
          <span className="flex items-center justify-center gap-2">
            {/* Petit spinner blanc pendant la connexion */}
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            {/* Texte indiquant que la connexion est en cours */}
            Connexion en cours…
          </span>
        ) : (
          // Texte normal du bouton
          'Se connecter'
        )}
      </button>

    </form>
  );
}