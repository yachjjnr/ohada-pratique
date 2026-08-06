# Site SYSCOHADA Mali — v1.0

Premier rendu pour le site de référence SYSCOHADA Mali, par Ousmane Mangane.

## Pages livrées

| Page | Fichier |
|---|---|
| Accueil (avec switcher 3 thèmes) | `index.html` |
| Bibliothèque (18 cards + filtres) | `bibliotheque.html` |
| Guide individuel : Amortissements | `guide-amortissements.html` |
| Fiscalité Mali (liste 6 impôts) | `fiscalite-mali.html` |
| ITS Mali (sous-page complète) | `fiscalite-its.html` |
| Articles (liste) | `articles.html` |
| Article complet : Bilan SYSCOHADA | `article-bilan-syscohada.html` |
| Outils (calculatrice + modèles + glossaire) | `outils.html` |
| Travaillons ensemble | `travaillons-ensemble.html` |

**Assets partagés** : `styles.css` (système de design), `app.js` (thèmes, toggle niveau, calculatrice, filtres, glossaire).

## Trois marques à arbitrer

Visible en tête de la page d'accueil. Bascule en direct la palette, la typo et le ton :

1. **SyscoMali** — bleu marine `#1B2C4A` + or sable `#C9A961`, Manrope + Inter. Sobre, institutionnel, lisible.
2. **Le Comptable Malien** — vert forêt `#1F4F3F` + ocre `#B87333`, Playfair Display + Lato. Plus éditorial, plus chaleureux.
3. **OHADA Pratique** — anthracite `#1C1C1C` + orange chaud `#E25822`, Manrope + Inter. Plus moderne, plus technique.

Le choix est persisté dans le navigateur (`localStorage`) pour faciliter l'essai sur plusieurs pages.

## Fonctionnalités fonctionnelles

- ✅ Mode clair / sombre (toggle en haut à droite, persisté)
- ✅ Switcher des 3 marques sur l'accueil
- ✅ Calculatrice d'amortissement linéaire ET dégressif, avec prorata 30/360 OHADA et coefficient dégressif (1,5 / 2 / 2,5)
- ✅ Filtres bibliothèque (thème, niveau, format) + recherche texte
- ✅ Glossaire avec recherche
- ✅ TOC collante avec scroll spy sur les guides et articles
- ✅ Responsive mobile/tablette/desktop, mobile-first
- ✅ Menu mobile (burger)
- ✅ Breadcrumbs sur toutes les pages internes
- ✅ Focus styles accessibles (WCAG)

## À compléter par Ousmane

### Contenus à fournir
- [ ] **Le texte intégral des 14 guides numérotés** (placeholders dans `bibliotheque.html`)
- [ ] **Les 3 articles vulgarisés** déjà rédigés (un seul est intégré, `article-bilan-syscohada.html`)
- [ ] **Les 5 autres sous-pages de fiscalité Mali** (IRF, IS, BIC, TVA, Internationale) — la sous-page ITS sert de modèle
- [ ] **Le contenu du guide "Les 10 erreurs SYSCOHADA"** pour le lead magnet (PDF)
- [ ] **Validation des barèmes ITS et autres taux fiscaux** avec la Loi de Finances Mali en vigueur (le barème actuel est indicatif)

### Visuels et identité
- [ ] **Choix final d'une marque** parmi les 3 (SyscoMali / Le Comptable Malien / OHADA Pratique)
- [ ] **Logo définitif** (le logo actuel est un simple monogramme SVG, à remplacer)
- [ ] **Portrait d'Ousmane** pour la page "Travaillons ensemble"
- [ ] **Visuels d'articles** (couvertures, schémas) à fournir, idéalement avec contexte malien
- [ ] **Favicon** (`favicon.ico` ou `favicon.svg`)

### Configuration technique
- [ ] **Brancher le formulaire de contact** (Formspree, Netlify Forms, ou un backend custom)
- [ ] **Brancher le formulaire newsletter** (Mailchimp, Brevo, Buttondown, etc.)
- [ ] **Brancher le formulaire lead magnet** (mêmes outils, avec envoi automatique du PDF)
- [x] **Mettre les bons identifiants WhatsApp** (numéro réel `+223 92 86 97 51` configuré dans `travaillons-ensemble.html`)
- [x] **Mettre l'email réel** (`mangane.ousmane@outlook.com` configuré dans `travaillons-ensemble.html`)
- [ ] **Choisir et acheter un nom de domaine** (ex : syscomali.ml, lecomptablemalien.com, ohada-pratique.com)
- [ ] **Déployer** sur Vercel, Netlify ou GitHub Pages
- [ ] **Créer le `sitemap.xml`** et le `robots.txt`
- [ ] **Ajouter Google Analytics ou Plausible** (au choix d'Ousmane, RGPD à respecter)
- [ ] **Mentions légales** (lien dans le footer, à rédiger)

### Modèles téléchargeables à produire
- [ ] Plan comptable SYSCOHADA condensé (XLSX)
- [ ] Modèle de journal général (XLSX avec formules de contrôle)
- [ ] Modèle de balance générale (XLSX)
- [ ] Tableau d'amortissement (XLSX)

### Calculatrices supplémentaires (placeholders existants)
- [ ] Simulateur IRF
- [ ] Simulateur ITS Mali (la logique du barème est dans `app.js`, à activer)
- [ ] Simulateur IS Mali

## Stack technique

- HTML5 sémantique, pas de framework
- CSS custom properties pour gérer les 3 thèmes × clair/sombre
- JavaScript vanilla (un seul fichier `app.js`)
- Fonts via Google Fonts (Inter, Manrope, Lato, Playfair Display) — toutes chargées pour permettre le switch
- Compatible déploiement statique : Vercel, Netlify, GitHub Pages
- Schema.org / Open Graph en place sur les pages principales

## Notes d'itération

Trois directions à creuser pour la v2, selon les retours d'Ousmane :

1. **Niveau de profondeur des contenus**. Le mode "Je débute / J'approfondis" masque déjà certains passages. On peut pousser plus loin (encarts dédiés "lecture rapide", "lecture détaillée") si l'audience le demande.
2. **Recherche globale**. À ce stade, la recherche est cantonnée à la bibliothèque et au glossaire. Une recherche cross-pages (avec petit index JSON) serait raisonnable une fois les contenus stables.
3. **Espace membre / progression**. Si Ousmane veut suivre la progression de ses lecteurs (guides lus, tests réussis), c'est une couche à ajouter — mais cela suppose un backend.

---

Bonne lecture. Reviens-moi avec ce qui marche, ce qui ne marche pas, et la marque que tu veux garder — on itère à partir de là.
