// src/features/events/mocks/events.mock.ts

import type { Evenement } from '@/features/Evènements/types/Evènement.types';

export const mockEvenements: Evenement[] = [
  {
    id: '1',
    titre: 'Réunion de lancement des stages',
    description:
      "Présentation des objectifs du semestre, des mentors assignés et du planning général des stages.",
    dateDebut: '2026-07-10T09:00:00.000Z',
    dateFin: '2026-07-10T11:00:00.000Z',
    lieu: 'Salle A - ENEAM Cotonou',
    statut: 'à venir',
    creePar: '1',
  },
  {
    id: '2',
    titre: 'Atelier suivi mi-parcours',
    description:
      "Point d'étape avec chaque binôme mentor/stagiaire sur l'avancement des projets.",
    dateDebut: '2026-07-20T14:00:00.000Z',
    dateFin: '2026-07-20T15:30:00.000Z',
    lieu: 'En ligne (Google Meet)',
    statut: 'à venir',
    creePar: '1',
  },
  {
    id: '3',
    titre: 'Bilan final des stages',
    description:
      'Présentation des livrables finaux et remise des attestations de stage.',
    dateDebut: '2026-05-15T09:00:00.000Z',
    dateFin: '2026-05-15T12:00:00.000Z',
    lieu: 'Amphithéâtre B - ENEAM Cotonou',
    statut: 'terminé',
    creePar: '1',
  },
];