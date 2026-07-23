import { api } from './api';
import type {
  User, Entreprise, Departement, Mentor, Stagiaire, Presence, Projet, Tache, Rapport,
  DocumentStagiaire, Message, Paginated, DemandeDocument, AvisStage, Publication, Soutenance,
} from '../types';

// ── Auth ───────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/login', { email, password }),
  me: () => api.get<User>('/me'),
  logout: () => api.post('/logout'),
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>) => api.put<User>('/profile', data),
  updatePassword: (current_password: string, password: string, password_confirmation: string) =>
    api.put('/profile/password', { current_password, password, password_confirmation }),
  forgotPassword: (email: string) => api.post('/forgot-password', { email }),
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/reset-password', data),
  parametresPublics: () =>
    api.get<Record<string, Array<{ id: number; cle: string; valeur: string | null; groupe: string }>>>('/parametres-publics'),
  publications: () => api.get<Publication[]>('/publications'),
};

// ── Admin ──────────────────────────────────────────────────
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),

  utilisateurs: (params?: Record<string, unknown>) => api.get<Paginated<User>>('/admin/utilisateurs', { params }),
  createUtilisateur: (data: Partial<User>) => api.post<User>('/admin/utilisateurs', data),
  updateUtilisateur: (id: number, data: Partial<User>) => api.put<User>(`/admin/utilisateurs/${id}`, data),
  deleteUtilisateur: (id: number) => api.delete(`/admin/utilisateurs/${id}`),
  renvoyerActivation: (id: number) => api.post(`/admin/utilisateurs/${id}/reset-password`),

  entreprises: (params?: Record<string, unknown>) => api.get<Paginated<Entreprise>>('/admin/entreprises', { params }),
  createEntreprise: (data: Partial<Entreprise>) => api.post<Entreprise>('/admin/entreprises', data),
  updateEntreprise: (id: number, data: Partial<Entreprise>) => api.put<Entreprise>(`/admin/entreprises/${id}`, data),
  deleteEntreprise: (id: number) => api.delete(`/admin/entreprises/${id}`),

  departements: (params?: Record<string, unknown>) => api.get<Paginated<Departement>>('/admin/departements', { params }),
  createDepartement: (data: Partial<Departement>) => api.post<Departement>('/admin/departements', data),
  updateDepartement: (id: number, data: Partial<Departement>) => api.put<Departement>(`/admin/departements/${id}`, data),
  deleteDepartement: (id: number) => api.delete(`/admin/departements/${id}`),

  stagiaires: (params?: Record<string, unknown>) => api.get<Paginated<Stagiaire>>('/admin/stagiaires', { params }),
  stagiaire: (id: number) => api.get<Stagiaire>(`/admin/stagiaires/${id}`),
  createStagiaire: (data: Record<string, unknown>) => api.post<Stagiaire>('/admin/stagiaires', data),
  updateStagiaire: (id: number, data: Partial<Stagiaire>) => api.put<Stagiaire>(`/admin/stagiaires/${id}`, data),
  deleteStagiaire: (id: number) => api.delete(`/admin/stagiaires/${id}`),

  mentors: (params?: Record<string, unknown>) => api.get<Paginated<Mentor>>('/admin/mentors', { params }),
  mentor: (id: number) => api.get<Mentor>(`/admin/mentors/${id}`),
  createMentor: (data: Record<string, unknown>) => api.post<Mentor>('/admin/mentors', data),
  updateMentor: (id: number, data: Partial<Mentor>) => api.put<Mentor>(`/admin/mentors/${id}`, data),
  deleteMentor: (id: number) => api.delete(`/admin/mentors/${id}`),
  affecterStagiaires: (mentorId: number, stagiaire_ids: number[]) =>
    api.post<Mentor>(`/admin/mentors/${mentorId}/affecter-stagiaires`, { stagiaire_ids }),
  retirerStagiaire: (mentorId: number, stagiaireId: number) =>
    api.delete(`/admin/mentors/${mentorId}/stagiaires/${stagiaireId}`),

  parametres: () => api.get<Record<string, Array<{ id: number; cle: string; valeur: string | null; groupe: string }>>>('/admin/parametres'),
  updateParametres: (parametres: Array<{ cle: string; valeur: string | null; groupe: string }>) =>
    api.put('/admin/parametres', { parametres }),

  notifications: () => api.get('/admin/notifications'),
  markNotificationRead: (id: string) => api.post(`/admin/notifications/${id}/lire`),
  markAllNotificationsRead: () => api.post('/admin/notifications/tout-lire'),

  demandesDocuments: (params?: Record<string, unknown>) => api.get<Paginated<DemandeDocument>>('/admin/demandes-documents', { params }),
  livrerDemande: (id: number, file: File) => {
    const form = new FormData();
    form.append('fichier', file);
    return api.post<DemandeDocument>(`/admin/demandes-documents/${id}/livrer`, form);
  },

  publications: (params?: Record<string, unknown>) => api.get<Paginated<Publication>>('/admin/publications', { params }),
  createPublication: (data: { titre: string; contenu: string; audience: Publication['audience'] }) =>
    api.post<Publication>('/admin/publications', data),
  deletePublication: (id: number) => api.delete(`/admin/publications/${id}`),

  soutenances: (params?: Record<string, unknown>) => api.get<Paginated<Soutenance>>('/admin/soutenances', { params }),
  createSoutenance: (data: Partial<Soutenance>) => api.post<Soutenance>('/admin/soutenances', data),
  updateSoutenance: (id: number, data: Partial<Soutenance>) => api.put<Soutenance>(`/admin/soutenances/${id}`, data),
  deleteSoutenance: (id: number) => api.delete(`/admin/soutenances/${id}`),
};

// ── Mentor ─────────────────────────────────────────────────
export const mentorApi = {
  dashboard: () => api.get('/mentor/dashboard'),
  stagiaires: (params?: Record<string, unknown>) => api.get<Paginated<Stagiaire>>('/mentor/stagiaires', { params }),
  stagiaire: (id: number) => api.get<Stagiaire>(`/mentor/stagiaires/${id}`),

  presences: (params?: Record<string, unknown>) => api.get<Paginated<Presence>>('/mentor/presences', { params }),
  updatePresence: (id: number, data: Partial<Presence>) => api.put<Presence>(`/mentor/presences/${id}`, data),

  projets: (params?: Record<string, unknown>) => api.get<Paginated<Projet>>('/mentor/projets', { params }),
  createProjet: (data: Partial<Projet>) => api.post<Projet>('/mentor/projets', data),
  updateProjet: (id: number, data: Partial<Projet>) => api.put<Projet>(`/mentor/projets/${id}`, data),
  deleteProjet: (id: number) => api.delete(`/mentor/projets/${id}`),

  taches: (projetId: number) => api.get<Tache[]>(`/mentor/projets/${projetId}/taches`),
  createTache: (projetId: number, data: Partial<Tache>) => api.post<Tache>(`/mentor/projets/${projetId}/taches`, data),
  updateTache: (id: number, data: Partial<Tache>) => api.put<Tache>(`/mentor/taches/${id}`, data),
  deleteTache: (id: number) => api.delete(`/mentor/taches/${id}`),
  evaluerTache: (id: number, data: { evaluation_note: number; evaluation_commentaire?: string }) =>
    api.post<Tache>(`/mentor/taches/${id}/evaluer`, data),

  rapports: (params?: Record<string, unknown>) => api.get<Paginated<Rapport>>('/mentor/rapports', { params }),
  updateRapport: (id: number, data: { statut: 'valide' | 'rejete'; feedback?: string }) =>
    api.put<Rapport>(`/mentor/rapports/${id}`, data),

  demandesDocuments: () => api.get<DemandeDocument[]>('/mentor/demandes-documents'),
  updateDemande: (id: number, data: { statut: 'validee' | 'rejetee'; commentaire_mentor?: string }) =>
    api.put<DemandeDocument>(`/mentor/demandes-documents/${id}`, data),

  avis: () => api.get<AvisStage[]>('/mentor/avis'),
  createAvis: (data: Omit<AvisStage, 'id' | 'mentor_id' | 'created_at'>) => api.post<AvisStage>('/mentor/avis', data),

  conversations: () => api.get<Record<string, Message[]>>('/mentor/messages'),
  conversation: (userId: number) => api.get<Message[]>(`/mentor/messages/${userId}`),
  sendMessage: (receiver_id: number, contenu: string) => api.post<Message>('/mentor/messages', { receiver_id, contenu }),
};

// ── Stagiaire ──────────────────────────────────────────────
export const stagiaireApi = {
  dashboard: () => api.get('/stagiaire/dashboard'),

  presences: (params?: Record<string, unknown>) => api.get<Paginated<Presence>>('/stagiaire/presences', { params }),
  checkIn: (geo: { latitude: number; longitude: number; adresse?: string; appareil?: string }) =>
    api.post<Presence>('/stagiaire/presences/pointer-arrivee', geo),
  checkOut: (geo: { latitude: number; longitude: number; adresse?: string; appareil?: string }) =>
    api.post<Presence>('/stagiaire/presences/pointer-depart', geo),

  projets: (params?: Record<string, unknown>) => api.get<Paginated<Projet>>('/stagiaire/projets', { params }),
  projet: (id: number) => api.get<Projet>(`/stagiaire/projets/${id}`),

  taches: (params?: Record<string, unknown>) => api.get<Paginated<Tache>>('/stagiaire/taches', { params }),
  updateTache: (id: number, statut: Tache['statut']) => api.put<Tache>(`/stagiaire/taches/${id}`, { statut }),

  rapports: (params?: Record<string, unknown>) => api.get<Paginated<Rapport>>('/stagiaire/rapports', { params }),
  createRapport: (data: { titre: string; contenu?: string; type?: string; fichier: File }) => {
    const form = new FormData();
    form.append('titre', data.titre);
    if (data.contenu) form.append('contenu', data.contenu);
    if (data.type) form.append('type', data.type);
    form.append('fichier', data.fichier);
    return api.post<Rapport>('/stagiaire/rapports', form);
  },
  updateRapport: (id: number, data: Partial<Rapport>) => api.put<Rapport>(`/stagiaire/rapports/${id}`, data),

  documents: () => api.get<DocumentStagiaire[]>('/stagiaire/documents'),
  uploadDocument: (file: File, type?: string) => {
    const form = new FormData();
    form.append('fichier', file);
    if (type) form.append('type', type);
    // Ne JAMAIS fixer Content-Type manuellement avec FormData : le navigateur
    // doit générer lui-même le "boundary" (sinon Laravel ne peut pas parser
    // le multipart et $request->file('fichier') est vide → 422).
    return api.post<DocumentStagiaire>('/stagiaire/documents', form);
  },
  deleteDocument: (id: number) => api.delete(`/stagiaire/documents/${id}`),

  updateCompetences: (competences: string[]) => api.put<Stagiaire>('/stagiaire/competences', { competences }),

  demandesDocuments: () => api.get<DemandeDocument[]>('/stagiaire/demandes-documents'),
  createDemandeDocument: (type: DemandeDocument['type']) => api.post<DemandeDocument>('/stagiaire/demandes-documents', { type }),

  avis: () => api.get<AvisStage[]>('/stagiaire/avis'),
  soutenance: () => api.get<Soutenance | null>('/stagiaire/soutenance'),

  conversations: () => api.get<Record<string, Message[]>>('/stagiaire/messages'),
  conversation: (userId: number) => api.get<Message[]>(`/stagiaire/messages/${userId}`),
  sendMessage: (receiver_id: number, contenu: string) => api.post<Message>('/stagiaire/messages', { receiver_id, contenu }),
};
