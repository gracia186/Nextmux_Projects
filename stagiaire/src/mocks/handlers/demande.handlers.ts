import { http, HttpResponse } from 'msw';
import { demandesStore } from '../data/demandes.mock';

// Stagiaire connecté simulé (id: '1' dans nos mocks, mentorId: 2 dans stagiaires.mock.ts)
const MOCK_STAGIAIRE_ID = '1';

export const demandeHandlers = [
  // Stagiaire : ses propres demandes
  http.get('*/stagiaire/demandes', () => {
    const data = demandesStore.getByStagiaireId(MOCK_STAGIAIRE_ID);
    return HttpResponse.json({ success: true, data, meta: {} });
  }),

  http.post('*/stagiaire/demandes', async ({ request }) => {
    const body = (await request.json()) as { type: 'attestation' | 'convention' };
    const nouvelle = demandesStore.add(body.type, MOCK_STAGIAIRE_ID);
    return HttpResponse.json({ success: true, data: nouvelle, meta: {} });
  }),

  // Mentor : uniquement les demandes d'attestation de ses stagiaires
  http.get('*/mentor/demandes', ({ request }) => {
    const url = new URL(request.url);
    const mentorIdParam = url.searchParams.get('mentorId');

    if (!mentorIdParam) {
      return HttpResponse.json({ message: 'mentorId requis' }, { status: 400 });
    }

    const data = demandesStore.getAttestationsByMentorId(Number(mentorIdParam));
    return HttpResponse.json({ success: true, data, meta: {} });
  }),

  // Admin : toutes les demandes de convention, tous stagiaires confondus
  http.get('*/admin/demandes', () => {
    const data = demandesStore.getConventionsPourAdmin();
    return HttpResponse.json({ success: true, data, meta: {} });
  }),

  // Traitement d'une demande (mentor pour attestation, admin pour convention)
  // multipart/form-data car un fichier de réponse peut être joint
  http.patch('*/demandes/:id/traiter', async ({ params, request }) => {
    const id = String(params.id);
    const formData = await request.formData();

    const statut = formData.get('statut') as 'approuvée' | 'rejetée';
    const commentaire = (formData.get('commentaire') as string) || undefined;
    const fichier = formData.get('fichier') as File | null;

    const updated = demandesStore.traiter(id, {
      statut,
      commentaire,
      fichierNom: fichier?.name,
    });

    if (!updated) {
      return HttpResponse.json({ message: 'Demande introuvable' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: updated, meta: {} });
  }),
];