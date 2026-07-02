// Import de useState pour gérer l'état local de la modal et de l'utilisateur sélectionné
import { useState } from 'react';
// Import des hooks CRUD utilisateurs
import { useUsers } from '@/features/users/hooks/useUsers';
import { useCreateUser } from '@/features/users/hooks/useCreateUser';
import { useUpdateUser } from '@/features/users/hooks/useUpdateUser';
import { useDeleteUser } from '@/features/users/hooks/useDeleteUser';
// Import du type User
import { User } from '@/features/auth/types/auth.types';
// Import du type DTO de création
import { CreateUserDto } from '@/features/users/api/users.api';
// Import de useForm et zodResolver pour le formulaire de la modal
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import de zod pour le schéma de validation
import { z } from 'zod';
// Import des icônes lucide-react
import { Plus, Pencil, Trash2, X, Shield, GraduationCap, Users } from 'lucide-react';

// Schéma Zod pour la validation du formulaire utilisateur
const userSchema = z.object({
  // Prénom obligatoire
  prenom: z.string().min(1, 'Le prénom est requis'),
  // Nom obligatoire
  nom: z.string().min(1, 'Le nom est requis'),
  // Email valide obligatoire
  email: z.string().email('Email invalide'),
  // Rôle limité aux 3 valeurs possibles
  role: z.enum(['admin', 'mentor', 'stagiaire']),
  // Mot de passe minimum 6 caractères
  password: z.string().min(6, 'Minimum 6 caractères'),
});

// Type inféré depuis le schéma Zod
type UserFormValues = z.infer<typeof userSchema>;

// Correspondance rôle → libellé français affiché dans le tableau
const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  mentor: 'Mentor',
  stagiaire: 'Stagiaire',
};

// Correspondance rôle → couleurs de badge Tailwind
const roleBadgeColors: Record<string, string> = {
  // Badge bleu pour les admins
  admin: 'bg-blue-100 text-blue-700',
  // Badge vert pour les mentors
  mentor: 'bg-emerald-100 text-emerald-700',
  // Badge violet pour les stagiaires
  stagiaire: 'bg-violet-100 text-violet-700',
};

// Correspondance rôle → icône lucide-react
const roleIcons: Record<string, React.ElementType> = {
  admin: Shield,
  mentor: Users,
  stagiaire: GraduationCap,
};

// Déclaration et export du composant AdminUsersPage
export function AdminUsersPage() {
  // Récupération des utilisateurs via TanStack Query
  const { data, isLoading } = useUsers();
  // Mutation de création
  const { mutate: createUser } = useCreateUser();
  // Mutation de modification
  const { mutate: updateUser } = useUpdateUser();
  // Mutation de suppression
  const { mutate: deleteUser } = useDeleteUser();

  // État de visibilité de la modal (true = ouverte)
  const [modalOpen, setModalOpen] = useState(false);
  // Utilisateur en cours d'édition (null = mode création)
  const [editing, setEditing] = useState<User | null>(null);
  // ID de l'utilisateur en cours de suppression (pour confirmation)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Initialisation de React Hook Form avec validation Zod
  const {
    register,               // connecte les inputs au formulaire
    handleSubmit,           // valide avant d'appeler onSubmit
    reset,                  // réinitialise les champs de la modal
    formState: { errors },  // erreurs de validation par champ
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  // Ouvre la modal en mode création : reset des champs, editing null
  const openCreate = () => {
    setEditing(null);
    reset({ prenom: '', nom: '', email: '', role: 'stagiaire', password: '' });
    setModalOpen(true);
  };

  // Ouvre la modal en mode édition : pré-remplit les champs avec l'utilisateur sélectionné
  const openEdit = (user: User) => {
    setEditing(user);
    reset({ prenom: user.prenom, nom: user.nom, email: user.email, role: user.role, password: '' });
    setModalOpen(true);
  };

  // Ferme la modal et réinitialise l'état d'édition
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // Soumission du formulaire : création ou modification selon editing
  const onSubmit = (values: UserFormValues) => {
    if (editing) {
      // Mode édition : envoi des données modifiées avec l'ID de l'utilisateur
      updateUser({ id: editing.id, data: values });
    } else {
      // Mode création : envoi de toutes les données
      createUser(values as CreateUserDto);
    }
    // Fermeture de la modal après soumission
    closeModal();
  };

  // Confirmation de suppression : déclenche la mutation delete
  const confirmDelete = () => {
    if (deletingId !== null) {
      // Suppression de l'utilisateur par son ID
      deleteUser(deletingId);
      // Réinitialisation de l'ID de suppression
      setDeletingId(null);
    }
  };

  return (
    // Conteneur de la page avec padding
    <div className="p-8">

      {/* ── En-tête de la page ── */}
      <div className="flex items-center justify-between mb-8">
        {/* Titre et sous-titre */}
        <div>
          {/* Titre principal */}
          <h1 className="text-2xl font-bold text-dark-900">Gestion des utilisateurs</h1>
          {/* Sous-titre avec le nombre total d'utilisateurs */}
          <p className="text-sm text-dark-400 mt-1">
            {data?.meta.total ?? 0} compte{(data?.meta.total ?? 0) > 1 ? 's' : ''} enregistré{(data?.meta.total ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        {/* Bouton d'ouverture de la modal de création */}
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
        >
          {/* Icône plus */}
          <Plus className="w-4 h-4" />
          {/* Texte du bouton */}
          Nouvel utilisateur
        </button>
      </div>

      {/* ── Tableau des utilisateurs ── */}
      {/* Carte blanche avec ombre légère */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* État de chargement : affichage d'un spinner centré */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            {/* Spinner animé en couleur primary */}
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : (
          // Tableau scrollable horizontalement sur mobile
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* En-tête du tableau */}
              <thead>
                <tr className="bg-dark-50 border-b border-dark-100">
                  {/* Colonne ID */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wide">#</th>
                  {/* Colonne Nom complet */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wide">Utilisateur</th>
                  {/* Colonne Email */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wide">Email</th>
                  {/* Colonne Rôle */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wide">Rôle</th>
                  {/* Colonne Actions */}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-dark-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              {/* Corps du tableau */}
              <tbody className="divide-y divide-dark-100">
                {/* Boucle sur chaque utilisateur pour générer une ligne */}
                {data?.data.map((user) => {
                  // Récupération du composant icône correspondant au rôle
                  const RoleIcon = roleIcons[user.role];
                  return (
                    // Ligne avec hover pour indiquer l'interactivité
                    <tr key={user.id} className="hover:bg-dark-50 transition-colors">
                      {/* Cellule ID */}
                      <td className="px-6 py-4 text-dark-400 font-mono text-xs">{user.id}</td>
                      {/* Cellule Nom complet : prénom + nom en gras */}
                      <td className="px-6 py-4">
                        <span className="font-medium text-dark-900">
                          {user.prenom} {user.nom}
                        </span>
                      </td>
                      {/* Cellule Email */}
                      <td className="px-6 py-4 text-dark-500">{user.email}</td>
                      {/* Cellule Rôle : badge coloré avec icône */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleBadgeColors[user.role]}`}>
                          {/* Icône du rôle */}
                          <RoleIcon className="w-3 h-3" />
                          {/* Libellé du rôle en français */}
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      {/* Cellule Actions : boutons éditer et supprimer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Bouton d'édition : ouvre la modal en mode édition */}
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {/* Icône crayon */}
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Bouton de suppression : ouvre la confirmation */}
                          <button
                            onClick={() => setDeletingId(user.id)}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            {/* Icône poubelle */}
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal création / édition ── */}
      {/* Affichée uniquement si modalOpen est true */}
      {modalOpen && (
        // Overlay sombre plein écran, clic à l'extérieur ferme la modal
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          onClick={closeModal}
        >
          {/* Carte de la modal, stopPropagation pour éviter la fermeture au clic intérieur */}
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête de la modal : titre + bouton fermeture */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
              {/* Titre dynamique selon le mode */}
              <h2 className="text-lg font-semibold text-dark-900">
                {editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              {/* Bouton de fermeture de la modal */}
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
              >
                {/* Icône croix */}
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps de la modal : formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">

              {/* Ligne prénom + nom côte à côte */}
              <div className="grid grid-cols-2 gap-4">
                {/* Champ prénom */}
                <div className="flex flex-col gap-1.5">
                  {/* Label prénom */}
                  <label className="text-sm font-medium text-dark-700">Prénom</label>
                  {/* Input prénom avec bordure conditionnelle rouge si erreur */}
                  <input
                    {...register('prenom')}
                    placeholder="Alice"
                    className={`px-3 py-2 rounded-lg border text-sm outline-none transition
                      focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.prenom ? 'border-red-400 bg-red-50' : 'border-dark-200'}`}
                  />
                  {/* Message d'erreur Zod pour le prénom */}
                  {errors.prenom && <span className="text-xs text-red-500">{errors.prenom.message}</span>}
                </div>

                {/* Champ nom */}
                <div className="flex flex-col gap-1.5">
                  {/* Label nom */}
                  <label className="text-sm font-medium text-dark-700">Nom</label>
                  {/* Input nom */}
                  <input
                    {...register('nom')}
                    placeholder="Dupont"
                    className={`px-3 py-2 rounded-lg border text-sm outline-none transition
                      focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                      ${errors.nom ? 'border-red-400 bg-red-50' : 'border-dark-200'}`}
                  />
                  {/* Message d'erreur Zod pour le nom */}
                  {errors.nom && <span className="text-xs text-red-500">{errors.nom.message}</span>}
                </div>
              </div>

              {/* Champ email */}
              <div className="flex flex-col gap-1.5">
                {/* Label email */}
                <label className="text-sm font-medium text-dark-700">Email</label>
                {/* Input email */}
                <input
                  {...register('email')}
                  type="email"
                  placeholder="alice@exemple.com"
                  className={`px-3 py-2 rounded-lg border text-sm outline-none transition
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${errors.email ? 'border-red-400 bg-red-50' : 'border-dark-200'}`}
                />
                {/* Message d'erreur Zod pour l'email */}
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              {/* Champ rôle : select avec les 3 options */}
              <div className="flex flex-col gap-1.5">
                {/* Label rôle */}
                <label className="text-sm font-medium text-dark-700">Rôle</label>
                {/* Select rôle */}
                <select
                  {...register('role')}
                  className={`px-3 py-2 rounded-lg border text-sm outline-none transition
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${errors.role ? 'border-red-400 bg-red-50' : 'border-dark-200'}`}
                >
                  {/* Option administrateur */}
                  <option value="admin">Administrateur</option>
                  {/* Option mentor */}
                  <option value="mentor">Mentor</option>
                  {/* Option stagiaire */}
                  <option value="stagiaire">Stagiaire</option>
                </select>
                {/* Message d'erreur Zod pour le rôle */}
                {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
              </div>

              {/* Champ mot de passe */}
              <div className="flex flex-col gap-1.5">
                {/* Label dynamique selon le mode : création vs édition */}
                <label className="text-sm font-medium text-dark-700">
                  {editing ? 'Nouveau mot de passe' : 'Mot de passe'}
                </label>
                {/* Input password */}
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`px-3 py-2 rounded-lg border text-sm outline-none transition
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    ${errors.password ? 'border-red-400 bg-red-50' : 'border-dark-200'}`}
                />
                {/* Message d'erreur Zod pour le mot de passe */}
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              {/* Boutons d'action de la modal : annuler + confirmer */}
              <div className="flex justify-end gap-3 pt-2">
                {/* Bouton annuler : ferme la modal sans sauvegarder */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-dark-600 bg-dark-100 hover:bg-dark-200 transition-colors"
                >
                  Annuler
                </button>
                {/* Bouton confirmer : soumet le formulaire */}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)' }}
                >
                  {/* Texte dynamique selon le mode */}
                  {editing ? 'Enregistrer' : 'Créer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Modal de confirmation de suppression ── */}
      {/* Affichée uniquement si un ID de suppression est défini */}
      {deletingId !== null && (
        // Overlay sombre plein écran
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        >
          {/* Carte de confirmation */}
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            {/* Icône poubelle centrée en rouge */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            {/* Titre de confirmation */}
            <h3 className="text-lg font-semibold text-dark-900 text-center mb-2">
              Supprimer cet utilisateur ?
            </h3>
            {/* Message d'avertissement */}
            <p className="text-sm text-dark-400 text-center mb-6">
              Cette action est irréversible. L'utilisateur sera définitivement supprimé.
            </p>
            {/* Boutons : annuler + confirmer suppression */}
            <div className="flex gap-3">
              {/* Bouton annuler : réinitialise l'ID de suppression */}
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-dark-600 bg-dark-100 hover:bg-dark-200 transition-colors"
              >
                Annuler
              </button>
              {/* Bouton confirmer suppression : déclenche la mutation delete */}
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}