import { Presence, StatutPresence } from '@/features/presences/types/presence.types';
import { calculerStatut, calculerDuree, heureActuelle, dateAujourdhui } from '@/features/presences/lib/presence.utils';

let presences: Presence[] = [
  {
    id: 1, stagiaireId: 3, date: '2026-06-30',
    heureArrivee: '08:45', heureDepart: '17:30',
    duree: calculerDuree('08:45', '17:30'), statut: 'tot',
  },
  {
    id: 2, stagiaireId: 3, date: '2026-07-01',
    heureArrivee: '09:15', heureDepart: '17:00',
    duree: calculerDuree('09:15', '17:00'), statut: 'en_retard',
  },
  {
    id: 3, stagiaireId: 3, date: '2026-06-29',
    heureArrivee: null, heureDepart: null,
    duree: null, statut: 'absent',
  },
];

let nextId = 10;

export const presencesStore = {
  getAll: (): Presence[] =>
    [...presences].sort((a, b) => b.date.localeCompare(a.date)),

  getByStagiaireId: (stagiaireId: number): Presence[] =>
    presences
      .filter((p) => p.stagiaireId === stagiaireId)
      .sort((a, b) => b.date.localeCompare(a.date)),

  getToday: (stagiaireId: number): Presence | null =>
    presences.find((p) => p.stagiaireId === stagiaireId && p.date === dateAujourdhui()) ?? null,

  confirmerArrivee: (stagiaireId: number): Presence => {
    const heure = heureActuelle();
    const statut: StatutPresence = calculerStatut(heure);
    const today = dateAujourdhui();
    const existing = presences.find((p) => p.stagiaireId === stagiaireId && p.date === today);

    if (existing) {
      existing.heureArrivee = heure;
      existing.statut = statut;
      return existing;
    }

    const nouveau: Presence = {
      id: nextId++, stagiaireId,
      date: today, heureArrivee: heure,
      heureDepart: null, duree: null, statut,
    };
    presences.push(nouveau);
    return nouveau;
  },

  confirmerDepart: (stagiaireId: number): Presence | null => {
    const today = dateAujourdhui();
    const presence = presences.find(
      (p) => p.stagiaireId === stagiaireId && p.date === today
    );
    if (!presence || !presence.heureArrivee) return null;

    const heure = heureActuelle();
    presence.heureDepart = heure;
    presence.duree = calculerDuree(presence.heureArrivee, heure);
    return presence;
  },
};