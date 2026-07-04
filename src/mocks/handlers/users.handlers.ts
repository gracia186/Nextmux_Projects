// Import des utilitaires MSW pour intercepter les requêtes HTTP
import { http, HttpResponse } from 'msw';
// Import du store utilisateurs mocké
import { usersStore } from '../data/users.mock';

// URL de base de l'API récupérée depuis les variables d'environnement Vite
const API_URL = import.meta.env.VITE_API_URL;

// Liste des handlers MSW pour les routes utilisateurs
export const usersHandlers = [

  // GET /users — récupère tous les utilisateurs
  http.get(`${API_URL}/users`, () => {
    // Récupération de tous les utilisateurs depuis le store
    const data = usersStore.getAll();
    // Retour avec structure paginée identique aux autres endpoints
    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, total: data.length, per_page: 15 },
    });
  }),

  // POST /users — crée un nouvel utilisateur
  http.post(`${API_URL}/users`, async ({ request }) => {
    // Lecture du corps de la requête
    const body = (await request.json()) as any;
    // Ajout dans le store et récupération de l'objet créé
    const nouveau = usersStore.add(body);
    // Retour 201 avec l'objet créé
    return HttpResponse.json(nouveau, { status: 201 });
  }),

  // PUT /users/:id — met à jour un utilisateur existant
  http.put(`${API_URL}/users/:id`, async ({ params, request }) => {
    // Conversion de l'ID en nombre
    const id = Number(params.id);
    // Lecture du corps de la requête
    const body = (await request.json()) as any;
    // Mise à jour dans le store
    const updated = usersStore.update(id, body);
    // Retour 404 si l'utilisateur n'existe pas
    if (!updated) {
      return HttpResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    }
    // Retour de l'utilisateur mis à jour
    return HttpResponse.json(updated);
  }),

  // DELETE /users/:id — supprime un utilisateur
  http.delete(`${API_URL}/users/:id`, ({ params }) => {
    // Conversion de l'ID en nombre
    const id = Number(params.id);
    // Suppression dans le store
    usersStore.remove(id);
    // Retour 204 sans contenu (succès sans body)
    return new HttpResponse(null, { status: 204 });
  }),
];