# Mise à jour — session 4 (fonctionnalités avancées)

## Nouveautés frontend

- **Pointage avec géolocalisation obligatoire** : le dashboard stagiaire
  demande la position GPS du navigateur avant d'envoyer le pointage
  (`src/lib/geolocation.ts`). Message d'erreur clair si l'utilisateur refuse
  ou si le navigateur ne supporte pas la géolocalisation.
- **Camembert des présences** (proportions présent/retard/absent/congé) sur
  le dashboard stagiaire, à côté du graphique existant.
- **Mot de passe oublié / définition de mot de passe** : nouvelles pages
  `/mot-de-passe-oublie` et `/reset-password` (lien envoyé par email).
- **Formulaires admin** (Stagiaires, Mentors) : le champ mot de passe a été
  retiré — un message indique qu'un email d'activation sera envoyé.
- **Tâches stagiaire** : menu déroulant (à faire / en cours / terminé) à la
  place de la case à cocher, + affichage de la note du mentor si évaluée.
- **Évaluation de tâche** côté mentor (bouton "Évaluer" sur les tâches
  terminées, note/20 + commentaire).
- **Rapports** : le stagiaire téléverse maintenant un vrai fichier ; le
  mentor peut le télécharger avant de valider/rejeter.
- **Demandes de documents** : section dédiée dans Documents (stagiaire),
  nouvelles pages "Demandes de documents" (mentor : valider/rejeter ; admin :
  téléverser le fichier final une fois validé).
- **Avis de fin de stage** : page mentor pour rédiger l'avis, page stagiaire
  "Avis & Soutenance" pour le consulter (+ infos de soutenance si planifiée).
- **Publications/Annonces** : page admin pour publier (avec ciblage
  d'audience), page "Annonces" pour mentor/stagiaire.
- **Soutenances** : page admin pour planifier (date, lieu, jury, statut).

## Installation

```bash
rm -rf src
# copie le nouveau dossier src/ de ce zip à la place
npm install
npm run dev
```

## Important

Le backend DOIT être mis à jour en même temps (voir son `MISE_A_JOUR.md`) —
toutes ces fonctionnalités dépendent de nouvelles routes API.
