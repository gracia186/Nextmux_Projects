# STAMUX — Frontend (React + TypeScript + Vite)

Interface glassmorphism pour l'application de gestion de stages STAMUX,
connectée au backend Laravel via l'API REST + Sanctum.

## Design

- **Verre dépoli** : cartes en `backdrop-filter: blur()`, fond dégradé sombre (mesh gradient bleu/indigo/violet)
- **Halos "ring"** : bordure lumineuse animée au survol des cartes interactives (`.ring-hover`), focus clavier avec halo bleu (`:focus-visible`)
- **Lazy reveal** : chaque carte apparaît avec un fondu + léger décalage vertical en cascade (`.lazy-in`, délai calculé par index)
- **Skeletons shimmer** pendant le chargement des données (pas de flash de contenu vide)
- Polices **Inter** (texte) + **Lexend** (titres), palette héritée du brief (bleu #2563EB / indigo #4F46E5)
- `prefers-reduced-motion` respecté (animations désactivées automatiquement si l'utilisateur le demande)

## Installation

```bash
npm install
cp .env.example .env
# adapter VITE_API_URL si le backend ne tourne pas sur localhost:8000

npm run dev       # démarre sur http://localhost:5173
npm run build     # build de production dans dist/
```

⚠️ Le backend Laravel doit tourner et autoriser l'origine `http://localhost:5173` dans
`config/cors.php` (`FRONTEND_URL` dans son `.env`) et dans `SANCTUM_STATEFUL_DOMAINS`.

## Comptes de démonstration

Identiques à ceux créés par le seeder du backend :

| Rôle       | Email                    | Mot de passe |
|------------|--------------------------|--------------|
| Admin      | admin@stamux.local       | password     |
| Mentor     | mentor@stamux.local      | password     |
| Stagiaire  | stagiaire@stamux.local   | password     |

La page de connexion propose des raccourcis pour pré-remplir ces comptes.

## Structure

```
src/
  components/
    layout/        Sidebar, Topbar, DashboardLayout, config de navigation par rôle
    messaging/      Vue de messagerie partagée (mentor ↔ stagiaire)
    ui/             Card, Button, Badge, Modal, Skeleton, StatCard, EmptyState
    ProtectedRoute.tsx   Garde de route par rôle (admin/mentor/stagiaire)
  context/
    AuthContext.tsx  Session, login/logout, persistance du token
  lib/
    api.ts           Client axios (intercepteurs token + 401)
    endpoints.ts      Tous les appels API groupés par espace (admin/mentor/stagiaire)
  pages/
    admin/    mentor/    stagiaire/    commun/    auth/
  styles/
    tokens.css        Variables de design (couleurs, glass, ring, animations)
    layout.css        Sidebar / topbar / grille de l'app
    components.css    Boutons, cartes, tableaux, formulaires, modales
  types/index.ts      Types TypeScript miroir des modèles Laravel
```

## Points d'attention

- Le token Sanctum est stocké dans `localStorage` (`stamux_token`) ; une réponse 401
  déconnecte automatiquement et redirige vers `/login`.
- Les pages Admin > Départements/Entreprises attendent que le backend renvoie les
  compteurs (`stagiaires_count`, etc.) — déjà gérés côté Laravel via `withCount`.
- Le composant `MessagerieView` est générique : il accepte n'importe quel objet
  `{ conversations, conversation, sendMessage }`, réutilisé pour mentor et stagiaire.
- Pour ajouter un nouveau module, dupliquez le pattern d'une page liste existante
  (ex. `pages/admin/Mentors.tsx`) — chargement, recherche, tableau, modal de création.
