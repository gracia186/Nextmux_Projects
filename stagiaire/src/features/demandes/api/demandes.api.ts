import { apiClient } from '@/shared/lib/apiClient';
import { Demande, CreateDemandePayload, TraiterDemandePayload } from '../types/demande.types';

export const demandesApi = {
  // Stagiaire
  getAll: async (): Promise<Demande[]> => {
    const response = await apiClient.get('/stagiaire/demandes');
    return response.data.data;
  },

  create: async (payload: CreateDemandePayload): Promise<Demande> => {
    const response = await apiClient.post('/stagiaire/demandes', payload);
    return response.data.data;
  },

  // Mentor : attestations de ses stagiaires
  getMentorDemandes: async (mentorId: number): Promise<Demande[]> => {
    const response = await apiClient.get('/mentor/demandes', { params: { mentorId } });
    return response.data.data;
  },

  // Admin : toutes les conventions
  getAdminDemandes: async (): Promise<Demande[]> => {
    const response = await apiClient.get('/admin/demandes');
    return response.data.data;
  },

  // Traitement (mentor ou admin) : accepter/rejeter + fichier joint
  traiter: async (id: string, payload: TraiterDemandePayload): Promise<Demande> => {
    const formData = new FormData();
    formData.append('statut', payload.statut);
    if (payload.commentaire) formData.append('commentaire', payload.commentaire);
    if (payload.fichier) formData.append('fichier', payload.fichier);

    const response = await apiClient.patch(`/demandes/${id}/traiter`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};