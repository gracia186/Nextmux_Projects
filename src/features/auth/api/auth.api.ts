// On importe l'instance Axios configurée dans apiClient.ts.
// Elle contient l'URL de base, les headers, les intercepteurs, etc.
import { apiClient } from "@/shared/lib/apiClient";

// On importe les types TypeScript.
// User : représente un utilisateur connecté.
// LoginDto : représente les données envoyées lors de la connexion.
import { User, LoginDto } from "../types/auth.types";

// Objet qui regroupe toutes les requêtes liées à l'authentification.
export const authApi = {

  // -----------------------------------------------------------------
  // Récupère le cookie CSRF de Laravel Sanctum.
  // Cette requête est obligatoire avant le login lorsqu'on utilise
  // Laravel Sanctum avec une authentification par cookies.
  // -----------------------------------------------------------------
  getCsrfCookie: () =>
    apiClient.get(
      "/sanctum/csrf-cookie",

      // Ici on change temporairement la baseURL.
      // Pourquoi ?
      // Parce que le cookie CSRF n'est pas servi par /api
      // mais directement à la racine du serveur Laravel.
      {
        baseURL: import.meta.env.VITE_API_URL.replace("/api", ""),
      }
    ),

  // -----------------------------------------------------------------
  // Envoie les informations de connexion.
  // data contient généralement :
  // {
  //    email,
  //    password
  // }
  //
  // <User> indique que la réponse de l'API sera de type User.
  // -----------------------------------------------------------------
  login: (data: LoginDto) =>
    apiClient.post<User>("/login", data),

  // -----------------------------------------------------------------
  // Déconnecte l'utilisateur actuellement connecté.
  // -----------------------------------------------------------------
  logout: () =>
    apiClient.post("/logout"),

  // -----------------------------------------------------------------
  // Récupère les informations de l'utilisateur connecté.
  // Exemple :
  // {
  //   id,
  //   name,
  //   email,
  //   role
  // }
  // -----------------------------------------------------------------
  me: () =>
    apiClient.get<User>("/user"),
};