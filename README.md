# Medical Toolbox

Compagnon clinique et pédagogique mobile, offline-first.

## Démarrage

```bash
npm install
npm start
```

Scannez ensuite le QR code avec Expo Go, ou utilisez `npm run android`.

## Contrôles

```bash
npm run typecheck
npm test
```

## Architecture

- `src/domain/clinical` : registre, types, moteurs de calcul et tests cliniques.
- `src/screens` : expériences applicatives.
- `src/components` : composants d’interface réutilisables.
- `src/data` : persistance SQLite locale et migrations.
- `src/state` : état applicatif des favoris et activités récentes.
- `src/theme` : design tokens partagés.

Le contenu clinique est versionné et séparé de l’interface. Un outil marqué `review_due` reste visible dans le registre, mais son calcul demeure désactivé jusqu’à validation documentaire et tests de référence.

Les calculateurs utilisent des définitions déclaratives validées par Zod. Le registre refuse ainsi les identifiants dupliqués, les options invalides et l’activation d’une fiche sans définition, source et statut validé.
