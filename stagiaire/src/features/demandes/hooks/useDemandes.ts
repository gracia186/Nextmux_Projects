import { useState, useEffect, useCallback } from 'react';
import { demandesApi } from '../api/demandes.api';
import { Demande, TypeDemande } from '../types/demande.types';

export function useDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDemandes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await demandesApi.getAll();
      setDemandes(data);
    } catch (err) {
      setError("Impossible de charger les demandes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const creerDemande = async (type: TypeDemande) => {
    setSubmitting(true);
    setError(null);
    try {
      const nouvelle = await demandesApi.create({ type });
      setDemandes((prev) => [...prev, nouvelle]);
      return true;
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const dejaEnvoyee = (type: TypeDemande) =>
    demandes.some((d) => d.type === type);

  return { demandes, loading, error, submitting, creerDemande, dejaEnvoyee };
}