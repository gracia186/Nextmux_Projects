// src/features/events/mocks/events.handlers.ts

import { http, HttpResponse } from 'msw';
import { mockEvenements } from '@/mocks/data/evenement.mock';
import type {
  Evenement,
  CreateEvenementPayload,
  UpdateEvenementPayload,
} from '@/features/Evènements/types/Evènement.types';
let evenements: Evenement[] = [...mockEvenements];

const BASE_URL = '/api/evenements';

export const evenementsHandlers = [
  // GET /evenements
  // - mentor : ?creePar=<sonId>  -> ses propres événements
  // - stagiaire : ?mentorId=<idDeSonMentor> -> événements de son mentor
  // - admin : aucun filtre -> tout voir
  http.get(BASE_URL, ({ request }) => {
    const url = new URL(request.url);
    const mentorId = url.searchParams.get('mentorId');
    const creePar = url.searchParams.get('creePar');

    let resultat = evenements;
    if (mentorId) {
      resultat = resultat.filter((e) => e.creePar === mentorId);
    } else if (creePar) {
      resultat = resultat.filter((e) => e.creePar === creePar);
    }

    return HttpResponse.json({ evenements: resultat });
  }),

  // GET /evenements/:id
  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const evenement = evenements.find((e) => e.id === params.id);
    if (!evenement) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }
    return HttpResponse.json({ evenement });
  }),

  // POST /evenements - le mentor connecté crée l'événement
  http.post(BASE_URL, async ({ request }) => {
    const body = (await request.json()) as CreateEvenementPayload;
    const currentMentorId = 'mentor-uuid-0001'; // à remplacer par authStore

    const nouvelEvenement: Evenement = {
      id: crypto.randomUUID(),
      ...body,
      creePar: currentMentorId,
    };

    evenements = [nouvelEvenement, ...evenements];
    return HttpResponse.json({ evenement: nouvelEvenement }, { status: 201 });
  }),

  // PATCH /evenements/:id - seul le mentor créateur peut modifier
  http.patch(`${BASE_URL}/:id`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateEvenementPayload;
    const index = evenements.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }

    const currentMentorId = 'mentor-uuid-0001'; // à remplacer par authStore
    if (evenements[index].creePar !== currentMentorId) {
      return HttpResponse.json(
        { message: 'Vous ne pouvez modifier que vos propres événements' },
        { status: 403 }
      );
    }

    evenements[index] = { ...evenements[index], ...body };
    return HttpResponse.json({ evenement: evenements[index] });
  }),

  // DELETE /evenements/:id - seul le mentor créateur peut supprimer
  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const index = evenements.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }

    const currentMentorId = 'mentor-uuid-0001'; // à remplacer par authStore
    if (evenements[index].creePar !== currentMentorId) {
      return HttpResponse.json(
        { message: 'Vous ne pouvez supprimer que vos propres événements' },
        { status: 403 }
      );
    }

    evenements = evenements.filter((e) => e.id !== params.id);
    return HttpResponse.json({ message: 'Événement supprimé' }, { status: 200 });
  }),
];