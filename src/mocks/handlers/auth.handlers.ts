import { http, HttpResponse } from 'msw';
import { mockUsers } from '../data/users.mock';

const API_URL = import.meta.env.VITE_API_URL;

// On garde en mémoire (très simplifié) l'utilisateur "connecté" côté mock
let currentUserId: number | null = null;

export const authHandlers = [
  // CSRF cookie — on n'a rien de réel à faire ici, juste répondre 200
  http.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_URL}/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Identifiants invalides' },
        { status: 422 }
      );
    }

    currentUserId = user.id;
    const { password, ...safeUser } = user;
    return HttpResponse.json(safeUser);
  }),

  http.post(`${API_URL}/logout`, () => {
    currentUserId = null;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/user`, () => {
    if (!currentUserId) {
      return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    const user = mockUsers.find((u) => u.id === currentUserId);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    const { password, ...safeUser } = user;
    return HttpResponse.json(safeUser);
  }),
];