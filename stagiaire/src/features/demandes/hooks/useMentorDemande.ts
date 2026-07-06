import { useState, useEffect, useCallback } from 'react';
import { demandesApi } from '../api/demandes.api';
import { Demande, TraiterDemandePayload } from '../types/demande.types';

// Côté mentor : uniquement les demandes d'attestation de ses stagiaires
export function useMentorDemandes(mentorId: number) {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traitementEnCours, setTraitementEnCours] = useState(false);

  const fetchDemandes = useCallback(async () => {
    if (!mentorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await demandesApi.getMentorDemandes(mentorId);
      setDemandes(data);
    } catch (err) {
      setError('Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  }, [mentorId]);

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