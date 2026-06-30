import { http, HttpResponse } from 'msw';
import { mentorsStore } from '../data/mentors.mock';

const API_URL = import.meta.env.VITE_API_URL;

export const mentorsHandlers = [
  http.get(`${API_URL}/mentors`, () => {
    const data = mentorsStore.getAll();
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  http.post(`${API_URL}/mentors`, async ({ request }) => {
    const body = (await request.json()) as any;
    const nouveau = mentorsStore.add(body);
    return HttpResponse.json(nouveau, { status: 201 });
  }),

  http.put(`${API_URL}/mentors/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as any;
    const updated = mentorsStore.update(id, body);
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/mentors/:id`, ({ params }) => {
    const id = Number(params.id);
    mentorsStore.remove(id);
    return new HttpResponse(null, { status: 204 });
  }),
];