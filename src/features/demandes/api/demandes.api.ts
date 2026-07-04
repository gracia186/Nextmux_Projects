import { apiClient } from '@/shared/lib/apiClient';
import { Demande, CreateDemandePayload } from '../types/demande.types';

export const demandesApi = {
  getAll: async (): Promise<Demande[]> => {
    const response = await apiClient.get('/stagiaire/demandes');
    return response.data.data; // en cohérence avec ton enveloppe { success, data, meta }
  },

  create: async (payload: CreateDemandePayload): Promise<Demande> => {
    const response = await apiClient.post('/stagiaire/demandes', payload);
    return response.data.data;
  },
};