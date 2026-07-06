// src/features/Evènements/mocks/evenement.handlers.ts

import { http, HttpResponse } from 'msw';
import { mockEvenements } from '@/mocks/data/evenement.mock';
import type {
  Evenement,
  CreateEvenementPayload,
  UpdateEvenementPayload,
} from '@/features/Evènements/types/Evènement.types';

let evenements: Evenement[] = [...mockEvenements];

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/evenements`;

export const evenementsHandlers = [
  // GET /evenements
  http.get(BASE_URL, ({ request }) => {
    const url = new URL(request.url);
    const adminId = url.searchParams.get('adminId');
    const creePar = url.searchParams.get('creePar');
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('perPage')) || 6;

    let resultat = evenements;
    if (adminId) {
      resultat = resultat.filter((e) => e.creePar === adminId);
    } else if (creePar) {
      resultat = resultat.filter((e) => e.creePar === creePar);
    }

    const total = resultat.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paginated = resultat.slice(start, start + perPage);

    return HttpResponse.json({
      evenements: paginated,
      meta: {
        currentPage: page,
        lastPage,
        perPage,
        total,
      },
    });
  }),

  // GET /evenements/:id
  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const evenement = evenements.find((e) => e.id === params.id);
    if (!evenement) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }
    return HttpResponse.json({ evenement });
  }),

  // POST /evenements
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

  // PATCH /evenements/:id
  http.patch(`${BASE_URL}/:id`, async ({ params, request }) => {
    const body = (await request.json()) as UpdateEvenementPayload;
    const index = evenements.findIndex((e) => e.id === params.id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }

    const currentMentorId = 'mentor-uuid-0001';
    if (evenements[index].creePar !== currentMentorId) {
      return HttpResponse.json(
        { message: 'Vous ne pouvez modifier que vos propres événements' },
        { status: 403 }
      );
    }

    evenements[index] = { ...evenements[index], ...body };
    return HttpResponse.json({ evenement: evenements[index] });
  }),

  // DELETE /evenements/:id
  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const index = evenements.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Événement introuvable' }, { status: 404 });
    }

    const currentMentorId = 'mentor-uuid-0001';
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