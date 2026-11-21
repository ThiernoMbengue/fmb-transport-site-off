# Audit et refonte corrective — version 2.1

Audit mesuré de la version 2.0 puis corrections. Outils : Lighthouse 12 (mobile simulé 4G lent + ordinateur),
axe-core (règles WCAG 2.2 AA), contrôle automatique de 12 tailles d'écran × 10 pages, parcours réels dans un navigateur.
Les mesures sont faites en laboratoire sur un serveur local ; les chiffres en production dépendront de l'hébergeur.

## 1. Diagnostic de la version 2.0

### Critique
| # | Problème constaté | Mesure | Cause |
|---|---|---|---|
| 1 | **Débordement horizontal sur petits téléphones** | +51 px à 320 px, +12 px à 360 px, sur toutes les pages | En-tête trop large (logo + 3 boutons) ; le bouton du menu sortait de l'écran |
| 2 | **Saut de mise en page au chargement (CLS)** | 0,41 sur l'accueil, 0,23 sur la réservation (seuil « bon » : 0,10) | Bandeau de démonstration et champs du module de réservation affichés/masqués par JavaScript après le premier rendu |
| 3 | **Catalogue lent sur mobile** | LCP 5,6 s, 1,2 Mo d'images | Une seule grande taille d'image (1280 px) servie aux téléphones, 3 images prioritaires en concurrence |
| 4 | **Contrastes insuffisants** | 2,6:1 à 4,4:1 (minimum AA : 4,5:1) | Vert WhatsApp trop clair avec texte blanc ; lien du pied de page écrasant la couleur du bouton ; pastille « Disponible » |
| 5 | **Site minuscule sur écrans 2K / 4K** | Contenu de 1240 px au centre d'un écran de 3840 px | Aucune mise à l'échelle au-delà de 1440 px |

### Important
| # | Problème constaté | Détail |
|---|---|---|
| 6 | En-tête sur deux lignes sur tablette (1024 px) | « Véhicules à vendre » passait à la ligne |
| 7 | Cibles tactiles trop petites | Liens du pied de page (24 px de haut), fermeture du bandeau (15 × 24 px), liens fléchés (26 px) |
| 8 | Contenu coupé à 320–360 px | Page « Investir » (bouton long non sécable), fiche véhicule (grille de caractéristiques) |
| 9 | Bouton WhatsApp flottant recouvrant le contenu | Sur la fiche véhicule en 1024 px, il masquait « Partager » |
| 10 | Structure HTML invalide | `<dl>` des caractéristiques, ordre des titres du catalogue sur mobile, zones hors repères (landmarks) |
| 11 | Nom accessible incohérent | Le lien du logo annonçait un texte différent du texte visible |
| 12 | Textes sous 12 px | Référence, libellés de prix, sous-titre du logo (11 px) |
| 13 | Fenêtre WhatsApp bloquée = demande perdue | Aucun repli si le navigateur bloquait l'ouverture du nouvel onglet |

### Confort
Résultats du catalogue sous la ligne de flottaison (en-tête de page trop haut), bandeau de confiance mal réparti sur tablette,
ponctuation française isolée en début de ligne, effets de survol « collés » sur écran tactile, flou d'arrière-plan coûteux
sur mobile, calculs de mise en page répétés au chargement (animations d'apparition).

## 2. Corrections apportées

### Design et micro-interactions
- En-tête de page compact (catalogue, contact, pages légales) : les véhicules sont visibles sans défiler.
- Module de réservation : champs longs plus larges, libellés courts, 2 colonnes sur téléphone, onglets avec fondu de bord.
- Bandeau de confiance en grille régulière (4 → 2 → 1 colonnes), séparateurs toujours nets.
- Anneau de focus bicolore visible sur fond clair et sombre ; flèche des boutons animée ; pression des boutons ; FAQ à ouverture animée ; fondu entre les pages.
- Effets de survol réservés aux appareils qui ont un pointeur ; typographie française (espaces insécables) appliquée à la génération.

### Responsive
- En-tête sur une ligne de 320 px à la 4K ; menu « hamburger » jusqu'à 1080 px.
- Écrans 2K / 4K : mise à l'échelle proportionnelle de tout le site (× 1,25 à × 2).
- Cibles tactiles ≥ 44 px ; boutons longs sécables sur petit écran ; fil d'Ariane sur une ligne avec « … ».
- Colonnes de grille qui ne peuvent plus dépasser l'écran (`minmax(0, 1fr)`).

### Performance
- Images en **AVIF + repli WebP**, 4 largeurs (320 / 480 / 800 / 1280), attribut `sizes` exact par usage.
- Une seule image prioritaire par page ; les autres en chargement différé.
- CLS supprimé : bandeau et champs dans leur état final dès le HTML, polices de secours calées sur les métriques des vraies polices.
- Navigation instantanée : préchargement de la page au survol (speculation rules + repli pour Safari / Firefox).
- Icônes en sprite (une définition par page), polices réduites aux graisses utilisées, lectures de mise en page groupées.

### Expérience utilisateur
- Envoi WhatsApp : si la fenêtre est bloquée, bascule dans l'onglet courant.
- Catalogue : compteur de filtres actifs sur mobile, retour aux résultats à la fermeture du panneau.
- Bouton WhatsApp flottant masqué sur les pages qui ont déjà leur bouton WhatsApp ; barre d'action masquée sur la réservation.

### Code, SEO, accessibilité
- HTML valide (listes de définition, hiérarchie des titres, repères), contrastes AA, textes ≥ 12 px.
- Contrôles automatiques enrichis (`tests/check.mjs`) et scripts d'audit fournis (`npm run audit:responsive`, `npm run audit:lighthouse`, `npm run e2e`).

## 3. Résultats (avant → après)

| Page | Écran | Performance | Accessibilité | LCP | CLS | Poids |
|---|---|---|---|---|---|---|
| Accueil | mobile | 98 → **100** | 97 → **100** | 2,0 s → 1,9 s | 0 → 0 | 294 → 220 Ko |
| Accueil | ordinateur | 81 → **100** | 97 → **100** | 0,4 s → 0,4 s | 0,41 → **0** | 394 → 250 Ko |
| Catalogue | mobile | 73 → **99** | 94 → **100** | 5,6 s → **2,0 s** | 0,07 → **0** | 1 200 → 437 Ko |
| Catalogue | ordinateur | 100 → 100 | 96 → **100** | 0,6 s → 0,4 s | 0,03 → **0** | 1 030 → 233 Ko |
| Fiche véhicule | mobile | 99 → **100** | 90 → **100** | 2,0 s → 1,9 s | 0 → 0 | 574 → 264 Ko |
| Réservation | ordinateur | 88 → **100** | 96 → **100** | 0,4 s → 0,4 s | 0,23 → **0,01** | 162 → 122 Ko |

Bonnes pratiques et SEO : 100 sur toutes les pages, avant comme après.
Audit responsive : 20 débordements horizontaux et 93 éléments hors écran → **0 problème** sur 12 tailles × 10 pages (débordements, cibles tactiles, textes, contrastes).

## 4. Points laissés en l'état (choix assumés)

- **Feuille de style externe** (11 Ko compressés) : Lighthouse la signale comme « bloquante » (≈ 0,1 s). La mettre dans chaque page
  ferait perdre le cache entre les pages et obligerait à assouplir la politique de sécurité.
- **Nombre d'éléments de la page catalogue** (≈ 1 200) : au-dessus du seuil indicatif de Lighthouse (800), sans effet mesurable
  (temps de blocage : 10 ms). Les 25 fiches sont dans le HTML pour le référencement.
- **Prérendu complet des pages** : le préchargement au survol est vérifié ; le prérendu dépend du navigateur du visiteur
  et n'a pas pu être observé dans le navigateur de test.

## Version 2.2 — refonte de l'affichage téléphone

Méthode : captures écran par écran sur iPhone 13 simulé (390 px), en clair et en sombre, avant et après ;
audit automatique sur 320, 360, 390 et 430 px (débordements, cibles tactiles, textes coupés, contrastes WCAG) ;
comparaison pixel à pixel de l'ordinateur et de la tablette (1440, 1024, 768 et 700 px) avec la version 2.1 : 80 captures identiques.

| Page | Hauteur avant | Hauteur après | Gain |
|---|---|---|---|
| Accueil | 13 290 px (20 écrans) | 4 106 px (6,2 écrans) | −69 % |
| Catalogue | 9 385 px | 2 866 px | −69 % |
| Fiche véhicule | 5 984 px | 2 919 px | −51 % |
| Réservation | 4 046 px | 2 280 px | −44 % |
| Services | 7 021 px | 2 567 px | −63 % |
| Investir | 4 837 px | 2 263 px | −53 % |
| Contact | 3 305 px | 1 722 px | −48 % |

Défilement horizontal : 0 px partout. Console JavaScript : aucune erreur. Lighthouse mobile : 99 à 100 en performance, 100 en accessibilité.

Le mode sombre est limité au téléphone (≤ 640 px), puisque l'affichage ordinateur ne devait pas changer ; il peut être étendu
à tous les écrans en déplaçant le bloc « Mode sombre » de `05-mobile.css` hors de sa condition de largeur.

## Version 3.0 — refonte complète (architecture et direction artistique)

Référence étudiée : yoon-app.com (rendue et capturée sur ordinateur et téléphone). Retenu : une seule police,
fonds alternés blanc / gris chaud / bleu nuit, beaucoup d'air, boutons « pilule », cartes photo avec texte posé dessus,
une idée par section. Non repris : l'esthétique propre à Yoon (motifs, vert, titres en capitales).

- **Architecture** : l'accueil présente l'entreprise et oriente ; la réservation a sa page « Chauffeur privé »
  (module, formules, flotte, déroulé, FAQ) ; les services sont classés par type de client ; le contact met
  les trois moyens directs en premier.
- **Design** : nouveau système (une police, palette sobre, tailles réduites, rayons et ombres harmonisés),
  thème sombre sur tous les écrans, un seul appel à l'action final par page.
- **Vérifications** : 12 tailles d'écran × 11 pages × 2 thèmes sans défaut ; Lighthouse 100 sur toutes les pages
  testées (mobile et ordinateur) ; parcours de bout en bout verts ; aucune erreur JavaScript.
- Les transitions animées entre pages ont été retirées : elles produisaient des erreurs intermittentes dans le navigateur.
