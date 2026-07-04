import { http, HttpResponse } from 'msw';

let mockDemandes: any[] = [];

export const demandeHandlers = [
  http.get('*/stagiaire/demandes', () => {
    return HttpResponse.json({
      success: true,
      data: mockDemandes,
      meta: {},
    });
  }),

  http.post('*/stagiaire/demandes', async ({ request }) => {
    const body = (await request.json()) as { type: string };

    const nouvelle = {
      id: crypto.randomUUID(),
      stagiaireId: 'mock-stagiaire-id',
      type: body.type,
      statut: 'en_attente',
      dateCreation: new Date().toISOString(),
    };

    mockDemandes.push(nouvelle);

    return HttpResponse.json({
      success: true,
      data: nouvelle,
      meta: {},
    });
  }),
];