// On importe le hook useMutation de React Query.
// Il sert à effectuer des opérations qui modifient des données
// (login, création, modification, suppression...).
import { useMutation } from "@tanstack/react-query";

// On importe les fonctions permettant d'appeler l'API d'authentification.
import { authApi } from "../api/auth.api";

// On importe le store Zustand qui gère l'état de l'utilisateur connecté.
import { useAuthStore } from "../store/authStore";

// On importe le type des données envoyées au login.
import { LoginDto } from "../types/auth.types";

// Hook personnalisé permettant de gérer la connexion.
export function useLogin() {

  // On récupère uniquement la fonction setUser du store.
  // Elle servira à enregistrer l'utilisateur connecté.
  const setUser = useAuthStore((state) => state.setUser);

  // On retourne une mutation React Query.
  return useMutation({

    // Fonction exécutée lorsqu'on lance la mutation.
    mutationFn: async (credentials: LoginDto) => {

      // Avec Laravel Sanctum, on récupère d'abord le cookie CSRF.
      await authApi.getCsrfCookie();

      // Ensuite on envoie les identifiants à l'API.
      const response = await authApi.login(credentials);

      // On retourne uniquement les données de la réponse.
      return response.data;
    },

    // Cette fonction est appelée automatiquement
    // si la connexion a réussi.
    onSuccess: (user) => {

      // On enregistre l'utilisateur dans Zustand.
      // Toute l'application saura alors que l'utilisateur est connecté.
      setUser(user);
    },
  });
}