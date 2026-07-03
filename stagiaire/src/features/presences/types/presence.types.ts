export type StatutPresence = 'tot' | 'a_l_heure' | 'en_retard' | 'absent';

export interface Presence {
  id: number;
  stagiaireId: number;
  date: string;           // "2026-07-02"
  heureArrivee: string | null;  // "08:45"
  heureDepart: string | null;   // "17:30"
  duree: number | null;         // en minutes
  statut: StatutPresence;
}

export interface PresenceJour {
  date: string;
  heureArrivee: string | null;
  heureDepart: string | null;
  duree: number | null;
  statut: StatutPresence;
}