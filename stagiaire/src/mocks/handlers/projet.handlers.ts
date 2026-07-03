import { http, HttpResponse } from 'msw';
import { projetsStore } from '../data/projets.mock';

const API_URL = import.meta.env.VITE_API_URL;

export const projetsHandlers = [
  http.get(`${API_URL}/projets`, ({ request }) => {
    const url = new URL(request.url);
    const mentorIdParam = url.searchParams.get('mentorId');
    const stagiaireIdParam = url.searchParams.get('stagiaireId');

    let data = projetsStore.getAll();

    if (mentorIdParam) {
      data = data.filter((p) => p.mentorId === mentorIdParam);
    }

    if (stagiaireIdParam) {
      data = data.filter((p) => p.stagiaireIds.includes(stagiaireIdParam));
    }

    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  http.get(`${API_URL}/projets/:id`, ({ params }) => {
    const projet = projetsStore.getById(String(params.id));
    if (!projet) {
      return HttpResponse.json({ message: 'Projet introuvable' }, { status: 404 });
    }
    return HttpResponse.json(projet);
  }),

  http.post(`${API_URL}/projets`, async ({ request }) => {
    const body = (await request.json()) as any;
    const nouveau = projetsStore.add(body);
    return HttpResponse.json(nouveau, { status: 201 });
  }),

  http.put(`${API_URL}/projets/:id`, async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as any;
    const updated = projetsStore.update(id, body);
    if (!updated) {
      return HttpResponse.json({ message: 'Projet introuvable' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/projets/:id`, ({ params }) => {
    const id = String(params.id);
    projetsStore.remove(id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API_URL}/projets/:id/assign-stagiaires`, async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as { stagiaireIds: string[] };
    const updated = projetsStore.assignStagiaires(id, body.stagiaireIds);
    if (!updated) {
      return HttpResponse.json({ message: 'Projet introuvable' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.patch(`${API_URL}/projets/:id/statut`, async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as { statut: string };
    const updated = projetsStore.updateStatut(id, body.statut as any);
    if (!updated) {
      return HttpResponse.json({ message: 'Projet introuvable' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];