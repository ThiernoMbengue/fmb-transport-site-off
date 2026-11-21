# FMB Transport — site web (version 2.1)

Site vitrine et commercial de **FMB Trans-Mobilité Services** (Dakar) : réservation de chauffeur,
vente de véhicules, services, investissement. Site **statique** (aucun serveur, aucune base de données) :
rapide, peu coûteux à héberger et très difficile à pirater. Les demandes partent par WhatsApp ou e-mail.

## Mettre en ligne en 5 minutes

Le dossier **`dist/`** est le site prêt à publier.

1. Aller sur <https://app.netlify.com/drop> (compte gratuit).
2. Glisser-déposer le dossier `dist/`. Le site est en ligne, en HTTPS.
3. (Facultatif) Ajouter votre nom de domaine dans *Domain management*.

Mieux : relier le projet à GitHub + Netlify. À chaque modification, le site est reconstruit,
contrôlé puis publié automatiquement (`netlify.toml` et `.github/workflows/ci.yml` sont fournis).
Fonctionne aussi sur **Vercel** (configuration fournie dans `vercel.json` : il suffit d'importer le dépôt), Cloudflare Pages, GitHub Pages.

## Modifier le contenu (sans toucher au code)

| Je veux changer…                              | Fichier                              |
|-----------------------------------------------|--------------------------------------|
| Téléphone, e-mail, adresse, RC, NINEA         | `src/config/site.json`               |
| Les véhicules à vendre (prix, km, photos…)    | `src/data/vehicles.json`             |
| Les véhicules avec chauffeur                  | `src/data/fleet.json`                |
| Les avis clients                              | `src/data/reviews.json`              |
| Les questions fréquentes                      | `src/data/faq.json`                  |
| La liste des services                         | `src/data/services.json`             |
| Les chiffres du tableau de bord investisseur  | `src/data/dashboard.json`            |
| Les couleurs, polices, arrondis               | `src/styles/01-tokens.css`           |
| L'affichage téléphone et le mode sombre       | `src/styles/05-mobile.css`           |

Puis reconstruire : `node build.mjs` (Node 18 ou plus, **aucune installation**).

**Ajouter un véhicule** : copier un bloc dans `vehicles.json`, déposer ses photos (JPG) dans `src/images/`,
lancer `python3 tools/images.py` (optimisation WebP) puis `node build.mjs`. Sa fiche, sa carte dans le
catalogue, les filtres et le sitemap sont créés automatiquement.

## Avant la mise en ligne définitive

- [ ] Remplacer les **24 annonces d'exemple** (`"demo": true`) et leurs photos par vos vrais véhicules.
- [ ] Remplacer les **3 avis d'exemple** par de vrais avis (ou vider le fichier : un bloc « Votre avis compte » s'affiche).
- [ ] Passer `"demoMode": false` dans `site.json` (retire le bandeau jaune).
- [ ] Compléter `publicationDirector` et `host` dans `site.json` (mentions légales) ; faire relire les 3 pages légales.
- [ ] Renseigner `"siteUrl"` (ex. `https://www.votre-domaine.sn`) → active le sitemap et les URL canoniques.
- [ ] Vérifier l'accord du propriétaire pour les chiffres de la page « Investir ».

## Commandes

```bash
node build.mjs          # construit le site dans dist/
node tests/check.mjs    # contrôle qualité : liens, SEO, accessibilité, sécurité, images
npm run dev             # construit + aperçu sur http://localhost:4173
python3 tools/images.py # ré-optimise les photos de src/images/ en AVIF + WebP (nécessite Pillow ≥ 11.3)
```

Audits complets (facultatifs, après `npm install`, avec `npm run dev` lancé dans un autre terminal) :

```bash
npm run audit:responsive   # 12 tailles d'écran × 10 pages : débordements, cibles tactiles, contrastes
npm run audit:lighthouse   # performance, accessibilité, bonnes pratiques, SEO (mobile + ordinateur)
npm run e2e                # parcours réels : réservation, catalogue, favoris, galerie, contact
```

Le détail de l'audit et des corrections de la version 2.1 est dans **`AUDIT.md`**.

## Architecture

```
src/
  config/site.json     Coordonnées et réglages (source unique)
  data/*.json          Contenus : véhicules, flotte, avis, FAQ, services…
  components/          Briques réutilisables (gabarit, cartes, galerie, icônes, formulaire)
  pages/               Une page = un fichier
  styles/              01-tokens (design system) → 02-base → 03-components → 04-pages
  scripts/             Un module par fonctionnalité (réservation, catalogue, favoris, galerie…)
  images/              Photos d'origine          static/  Polices et images optimisées
build.mjs              Générateur (assemble pages + CSS + JS, crée sitemap, robots, en-têtes)
tests/                 check.mjs (contrôles automatiques) · e2e.cjs · audit-responsive.cjs · audit-lighthouse.mjs (optionnels)
dist/                  ► Site prêt à publier
```

Ajouter une page : créer `src/pages/ma-page.mjs`, l'ajouter à la liste `builders` de `build.mjs`.
Ajouter une fonctionnalité : créer `src/scripts/80-ma-fonction.js` avec `FMB.register('nom', function () { … })`.

## Ce qui est en place

- **Téléphone (≤ 640 px)** : affichage type application — barre d'onglets en bas (Accueil, Véhicules, Appeler, Favoris, WhatsApp), premier écran complet (titre, réservation, services), cartes en 2 colonnes, fiche rapide et filtres en panneau qui monte du bas, 10 véhicules puis « Afficher plus », textes courts dédiés, mode clair et sombre. Feuille dédiée : `src/styles/05-mobile.css` ; textes courts via `rs(long, court)` dans `src/components/util.mjs`.
- **Design** : identité issue du logo (bleus FMB + ambre), typographies auto-hébergées, animations légères, responsive mobile / tablette / ordinateur, barre d'action fixe sur mobile.
- **Fonctionnalités** : réservation multi-services avec validation et récapitulatif en direct, catalogue avec recherche / filtres / tri / favoris / lien partageable, fiche véhicule (galerie, plein écran, rendez-vous, partage, fiche PDF), formulaire de contact WhatsApp ou e-mail, notifications, états vides, page 404.
- **Performance** : aucun framework, 1 CSS + 1 JS (≈ 11 Ko + 9 Ko compressés), images AVIF + WebP en 4 tailles avec chargement différé, préchargement des pages au survol, polices préchargées, cache longue durée. Lighthouse : 99 à 100 sur les pages testées.
- **SEO** : une vraie page par véhicule, titres et descriptions uniques, données structurées (entreprise, FAQ, fil d'Ariane, véhicule), sitemap, robots.txt, partage réseaux sociaux.
- **Sécurité** : HTTPS, en-têtes stricts (`dist/_headers` : CSP sans script en ligne, HSTS, anti-clickjacking), aucune ressource tierce, aucune donnée stockée côté serveur.
- **Accessibilité** : HTML sémantique, navigation clavier, lien d'évitement, erreurs de formulaire annoncées, contrastes AA, cibles tactiles ≥ 44 px, respect du réglage « réduire les animations ». Aucune erreur axe-core (WCAG 2.2 AA) sur les pages testées.
- **Légal** : mentions légales, confidentialité (loi sénégalaise 2008-12 + RGPD), conditions d'utilisation, crédits photos, consentement prêt à l'emploi (activé seulement si une mesure d'audience est configurée).
- **Maintenance** : contrôles automatiques, intégration continue, déploiement automatique, mode démonstration.

## Évolutions qui demandent un serveur (phase 2)

Ces points de la liste « site haut de gamme » n'ont pas de sens sur un site sans serveur ; l'architecture
est prête à les recevoir (les données sont déjà séparées en JSON, donc remplaçables par une API) :

| Besoin                                            | Solution recommandée                                    |
|---------------------------------------------------|---------------------------------------------------------|
| Tableau de bord d'administration des contenus     | CMS « headless » branché sur `src/data/` (Decap CMS, Sanity) |
| Comptes clients, espace investisseur, rôles       | Supabase (authentification + base PostgreSQL sécurisée) |
| Paiement en ligne                                 | Wave / Orange Money / PayDunya via une API              |
| Statistiques de visite                            | Plausible ou Matomo (`analytics` dans `site.json`)      |
| Suivi des erreurs                                 | Sentry (point d'entrée prévu dans `00-core.js`)         |
