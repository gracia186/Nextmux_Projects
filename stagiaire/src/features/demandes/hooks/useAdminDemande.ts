import { useState, useEffect, useCallback } from 'react';
import { demandesApi } from '../api/demandes.api';
import { Demande, TraiterDemandePayload } from '../types/demande.types';

// Côté admin : toutes les demandes de convention, tous stagiaires confondus
export function useAdminDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traitementEnCours, setTraitementEnCours] = useState(false);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await demandesApi.getAdminDemandes();
      setDemandes(data);
    } catch (err) {
      setError('Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const traiterDemande = async (id: string, payload: TraiterDemandePayload) => {
    setTraitementEnCours(true);
    setError(null);
    try {
      const updated = await demandesApi.traiter(id, payload);
      setDemandes((prev) => prev.map((d) => (d.id === id ? updated : d)));
      return true;
    } catch (err) {
      setError("Erreur lors du traitement de la demande.");
      return false;
    } finally {
      setTraitementEnCours(false);
    }
  };

  return { demandes, loading, error, traitementEnCours, traiterDemande };
}