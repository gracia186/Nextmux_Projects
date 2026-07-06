import { http, HttpResponse } from 'msw';
import { rapportsStore } from '../data/rapports.mocks';

const API_URL = import.meta.env.VITE_API_URL;

// Simule le stagiaire connecté (id: 3 dans nos mocks)
const MOCK_STAGIAIRE_ID = 3;

export const rapportsHandlers = [
  // Côté stagiaire : ses propres rapports
  http.get(`${API_URL}/rapports/mes-rapports`, () => {
    const data = rapportsStore.getByStagiaireId(MOCK_STAGIAIRE_ID);
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  // Côté mentor : uniquement les rapports des stagiaires qui lui sont assignés
  // Le mentorId est passé en query param (?mentorId=2), comme pour /stagiaires
  http.get(`${API_URL}/rapports/mentor-rapports`, ({ request }) => {
    const url = new URL(request.url);
    const mentorIdParam = url.searchParams.get('mentorId');

    if (!mentorIdParam) {
      return HttpResponse.json({ message: 'mentorId requis' }, { status: 400 });
    }

    const data = rapportsStore.getByMentorId(Number(mentorIdParam));
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

  // Évaluation d'un rapport par le mentor : statut + commentaire + note
  http.patch(`${API_URL}/rapports/:id/evaluer`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as {
      statut: 'valide' | 'rejete';
      commentaireMentor: string;
      note: number;
    };

    const updated = rapportsStore.evaluer(id, body);
    if (!updated) {
      return HttpResponse.json({ message: 'Rapport introuvable' }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/rapports/:id`, ({ params }) => {
    rapportsStore.remove(Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),
];