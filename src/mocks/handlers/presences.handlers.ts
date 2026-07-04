import { http, HttpResponse } from 'msw';
import { presencesStore } from '../data/presences.mock';

const API_URL = import.meta.env.VITE_API_URL;
const MOCK_STAGIAIRE_ID = 3;

export const presencesHandlers = [
  http.get(`${API_URL}/presences/mes-presences`, () => {
    const data = presencesStore.getByStagiaireId(MOCK_STAGIAIRE_ID);
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  http.get(`${API_URL}/presences/aujourd-hui`, () => {
    const data = presencesStore.getToday(MOCK_STAGIAIRE_ID);
    return HttpResponse.json(data);
  }),

  http.post(`${API_URL}/presences/arrivee`, () => {
    const presence = presencesStore.confirmerArrivee(MOCK_STAGIAIRE_ID);
    return HttpResponse.json(presence, { status: 201 });
  }),

  http.patch(`${API_URL}/presences/depart`, () => {
    const presence = presencesStore.confirmerDepart(MOCK_STAGIAIRE_ID);
    if (!presence) {
      return HttpResponse.json(
        { message: 'Aucune arrivée enregistrée aujourd\'hui' },
        { status: 400 }
      );
    }
    return HttpResponse.json(presence);
  }),
];