// Import des utilitaires MSW pour intercepter les requêtes HTTP
import { http, HttpResponse } from 'msw';
// Import du store utilisateurs mocké
import { usersStore } from '../data/users.mock';

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL;

// Simule la session : on garde l'ID de l'utilisateur connecté en mémoire
let currentUserId: number | null = null;

export const authHandlers = [

  // GET /sanctum/csrf-cookie — répond juste 204, pas de vrai cookie en mock
  http.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /login — vérifie email + password et "connecte" l'utilisateur
  http.post(`${API_URL}/login`, async ({ request }) => {
    // Lecture du corps de la requête
    const body = (await request.json()) as { email: string; password: string };
    // Recherche de l'utilisateur par email dans le store
    const user = usersStore.findByEmail(body.email);

    // Si l'utilisateur n'existe pas ou le mot de passe ne correspond pas
    if (!user || user.password !== body.password) {
      return HttpResponse.json(
        { message: 'Identifiants invalides' },
        { status: 422 }
      );
    }

    // Mémorisation de l'ID de l'utilisateur connecté
    currentUserId = user.id;
    // Retour de l'utilisateur sans le mot de passe
    const { password, ...safeUser } = user;
    return HttpResponse.json(safeUser);
  }),

  // POST /logout — déconnecte l'utilisateur en effaçant la session mock
  http.post(`${API_URL}/logout`, () => {
    currentUserId = null;
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /user — retourne l'utilisateur actuellement connecté
  http.get(`${API_URL}/user`, () => {
    // Si aucun utilisateur connecté, retour 401
    if (!currentUserId) {
      return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    // Recherche de l'utilisateur par son ID (pas par email — c'est un GET, pas de body)
    const user = usersStore.findById(currentUserId);
    // Si l'utilisateur a été supprimé entre temps
    if (!user) {
      return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 });
    }
    // Retour de l'utilisateur sans le mot de passe
    const { password, ...safeUser } = user;
    return HttpResponse.json(safeUser);
  }),
];