# STAMUX — Frontend

Frontend React (TypeScript + Vite) pour la plateforme de gestion des stagiaires **STAMUX**, construit pour se connecter au backend Laravel fourni (`Backend.zip`) en respectant exactement ses routes, ses rôles (`admin`, `mentor`, `intern`) et le format de réponse de l'API (`{ success, data, meta? }`).

## Stack technique

- **React 18** + **TypeScript** + **Vite**
- **React Router v6** — routage et protection par rôle
- **TanStack Query** — cache, chargement et synchronisation des données serveur
- **Zustand** (+ persist) — session d'authentification et notifications toast
- **React Hook Form** + **Zod** — formulaires et validation
- **Tailwind CSS** — mise en page et thème visuel
- **Axios** — client HTTP avec intercepteurs (token Bearer, gestion des erreurs 401/403)

## Installation

```bash
npm install
cp .env.example .env   # puis ajustez VITE_API_BASE_URL si besoin
npm run dev
```

L'application attend le backend Laravel sur `VITE_API_BASE_URL` (par défaut `http://localhost:8000/api/v1`). Assurez-vous que le CORS du backend autorise l'origine du frontend (`http://localhost:5173` en développement).

## Architecture

Le projet suit une architecture **feature-based**, chaque module métier étant autonome :

```
src/
├── components/ui/       # Composants génériques (Button, Modal, Table, etc.)
├── features/
│   ├── auth/             # Connexion, mot de passe oublié, invitation
│   ├── users/             # Gestion des comptes (admin)
│   ├── internships/       # Types liés aux stages
│   ├── attendance/        # Présences (pointage, tableau de bord, correction)
│   ├── reports/           # Rapports hebdo/mensuels (dépôt, validation)
│   ├── projects/          # Projets, affectation, évaluation
│   ├── tasks/              # Tâches liées aux projets (tableau kanban)
│   ├── documents/         # Attestations / conventions (workflow en 3 étapes)
│   ├── events/             # Annonces
│   ├── feedback/           # Avis de fin de stage
│   ├── stats/               # Statistiques et tableaux de bord par rôle
│   ├── profile/             # Profil, MFA, export RGPD
│   ├── auditLogs/           # Journal d'audit (admin)
│   └── notifications/       # Notifications (cloche dans la barre supérieure)
├── layouts/               # AppLayout, Sidebar (nav par rôle), Topbar
├── routes/                 # ProtectedRoute, RootRedirect
├── store/                   # Zustand : authStore, toastStore
├── lib/                      # axios, queryClient, cn (classnames)
└── types/                     # Types partagés (enveloppe API, User, etc.)
```

Chaque feature contient : `types/`, `api/` (appels Axios typés), `hooks/` (TanStack Query), `components/` et `pages/`.

## Rôles et navigation

- **Admin** : tableau de bord global, gestion des utilisateurs (création, invitation, affectation mentor, clôture de stage, anonymisation RGPD), statistiques, journal d'audit, et accès à tous les modules partagés.
- **Mentor** : projets (création, affectation, évaluation, tâches), validation des rapports et des documents de ses stagiaires.
- **Intern** : pointage de présence, dépôt de rapports, projets assignés, demande de documents, avis de fin de stage.

Les pages partagées (`/attendance`, `/reports`, `/projects`, `/documents`, `/events`, `/profile`) adaptent leur contenu et leurs actions selon le rôle connecté, exactement comme le fait le backend au niveau des policies.

## Notes d'intégration avec le backend

- L'authentification utilise un jeton Bearer (Sanctum) stocké via Zustand + `persist` (localStorage) et injecté automatiquement dans chaque requête.
- Toute réponse 401 réinitialise la session et redirige vers `/login`.
- Les téléversements de fichiers (rapports, documents, avatar) utilisent `multipart/form-data`; les mises à jour de rapports avec fichier utilisent le spoofing `_method=PATCH` requis par Laravel pour les requêtes multipart.
- Tous les chemins d'API (ex. `/admin/users/{id}/assign-mentor`, `/projects/{id}/evaluate/{internId}`, `/documents/{id}/mentor-validate`) correspondent exactement aux routes définies dans `routes/api.php` du backend fourni.

## Scripts

```bash
npm run dev       # serveur de développement
npm run build     # build de production (tsc + vite build)
npm run preview   # prévisualisation du build
```
