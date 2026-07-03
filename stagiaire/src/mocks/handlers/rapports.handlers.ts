import { http, HttpResponse } from 'msw';
import { rapportsStore } from '../data/rapports.mocks';

const API_URL = import.meta.env.VITE_API_URL;

// Simule le stagiaire connecté (id: 3 dans nos mocks)
const MOCK_STAGIAIRE_ID = 3;

export const rapportsHandlers = [
  http.get(`${API_URL}/rapports/mes-rapports`, () => {
    const data = rapportsStore.getByStagiaireId(MOCK_STAGIAIRE_ID);
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  http.post(`${API_URL}/rapports`, async ({ request }) => {
    const body = (await request.json()) as any;
    const nouveau = rapportsStore.add({ ...body, stagiaireId: MOCK_STAGIAIRE_ID });
    return HttpResponse.json(nouveau, { status: 201 });
  }),

  http.delete(`${API_URL}/rapports/:id`, ({ params }) => {
    rapportsStore.remove(Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),
];