import { http, HttpResponse } from 'msw';
import { stagiairesStore } from '../data/stagiaires.mock';

const API_URL = import.meta.env.VITE_API_URL;

export const stagiairesHandlers = [
  http.get(`${API_URL}/stagiaires`, () => {
    const data = stagiairesStore.getAll();
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  http.post(`${API_URL}/stagiaires`, async ({ request }) => {
    const body = (await request.json()) as any;
    const nouveau = stagiairesStore.add(body);
    return HttpResponse.json(nouveau, { status: 201 });
  }),

  http.put(`${API_URL}/stagiaires/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as any;
    const updated = stagiairesStore.update(id, body);
    if (!updated) {
      return HttpResponse.json({ message: 'Stagiaire introuvable' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/stagiaires/:id`, ({ params }) => {
    const id = Number(params.id);
    stagiairesStore.remove(id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(`${API_URL}/stagiaires/:id/assign-mentor`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { mentorId: number | null };
    const updated = stagiairesStore.update(id, { mentorId: body.mentorId });
    return HttpResponse.json(updated);
  }),
];