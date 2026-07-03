import { StatutPresence } from '../types/presence.types';

const HEURE_OFFICIELLE = { heure: 9, minute: 0 };

export function calculerStatut(heureArrivee: string | null): StatutPresence {
  if (!heureArrivee) return 'absent';

  const [h, m] = heureArrivee.split(':').map(Number);
  const minutesArrivee = h * 60 + m;
  const minutesOfficielles = HEURE_OFFICIELLE.heure * 60 + HEURE_OFFICIELLE.minute;

  if (minutesArrivee < minutesOfficielles) return 'tot';
  if (minutesArrivee === minutesOfficielles) return 'a_l_heure';
  return 'en_retard';
}

export function calculerDuree(heureArrivee: string, heureDepart: string): number {
  const [h1, m1] = heureArrivee.split(':').map(Number);
  const [h2, m2] = heureDepart.split(':').map(Number);
  return h2 * 60 + m2 - (h1 * 60 + m1);
}

export function formatDuree(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export function heureActuelle(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function dateAujourdhui(): string {
  return new Date().toISOString().split('T')[0];
}