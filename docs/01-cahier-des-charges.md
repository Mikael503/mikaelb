# 01 — Cahier des charges — Portfolio Mikael Bohime

## 1. Objectif
Site portfolio one-page de Mikael Bohime (développeur full-stack, Cotonou, Bénin) :
faire comprendre en moins de 30 secondes **qui il est, ce qu'il fait et comment le contacter**,
puis convertir le visiteur vers WhatsApp, le formulaire de contact ou le CV.

## 2. Public cible
- Clients potentiels (TPE/PME, porteurs de projet) cherchant un développeur web/mobile.
- Recruteurs et partenaires techniques.

## 3. Périmètre fonctionnel

### 3.1 Site public (one-page, 9 blocs dans l'ordre)
| # | Bloc | Contenu exigé |
|---|---|---|
| 1 | Header fixe | Logo MB, nav (Accueil, À propos, Compétences, Projets, Processus, Contact) avec section active, bouton CV ; sur mobile : menu plein écran StaggeredMenu |
| 2 | Hero (`#home`) | Rôle en eyebrow à effet décryptage, titre « Je transforme vos idées en expériences web exceptionnelles. », bio, 2 CTA (Me contacter / Voir mes projets), barre dispo + localisation, orbe WebGL 480px à droite (desktop uniquement) |
| 3 | TechStack | Bandeau défilant de 12 logos tech (React, Next.js, TypeScript, Tailwind, Node.js, Python, PostgreSQL, MongoDB, Git, Figma, Vercel, Docker) |
| 4 | About (`#about`) | `longBio` + 4 infos (Nom, Localisation, Email, Disponibilité) |
| 5 | Skills (`#skills`) | 5 barres : HTML/CSS/JS 95%, React/Next.js/Tailwind 90%, Figma/Responsive/UI-UX 85%, Git/GitHub 90%, Vercel/WordPress 85% |
| 6 | Projects (`#projects`) | 3 cartes : Nova Studio (Site Vitrine), BizFlow (SaaS), BLOOP (Jeu Mobile 2D) — image avec fallback, catégorie, description, tags technos, boutons démo/GitHub (visibles au tactile) |
| 7 | Process (`#process`) | 6 étapes (Découvrir, Planifier, Concevoir, Développer, Tester, Déployer) — 6 colonnes sur desktop large, timeline verticale sinon |
| 8 | Stats (`#stats`) | 4 compteurs exacts : 5+ clients, 5 projets, 1 an, 57% |
| 9 | Contact (`#contact`) + Footer | Infos (Email, WhatsApp +229 01 92 73 52 05, Localisation, Disponibilité) + formulaire validé (nom, email, sujet, message) avec honeypot anti-spam ; footer : logo, nav, copyright |

### 3.2 Panel admin (`/admin`, protégé par session cookie)
8 rubriques CRUD : Tableau de bord, Profil, Projets, Compétences, Processus,
Statistiques, Messages (lecture/suppression), Paramètres.
**Règle d'or :** toute modification admin est écrite dans `data/portfolio.json`
et apparaît sur le site public sans rebuild (page en `force-dynamic`).

### 3.3 Formulaire de contact
POST `/api/contact` → validation zod côté serveur → envoi email via Resend
(`RESEND_API_KEY`, destinataire `CONTACT_EMAIL`). Sans clé Resend : message d'erreur propre.

## 4. Exigences non fonctionnelles
- **Responsive :** 390px (mobile), 768px (tablette), 1440px (desktop) — 0 scroll horizontal, cibles tactiles ≥ 44px, timeline verticale sous `lg`.
- **Animations :** révélation au scroll (IntersectionObserver), `prefers-reduced-motion` respecté partout (WebGL/canvas à l'arrêt).
- **Performance :** images projets ≤ 1600px / qualité 80, aucune dépendance 3D hors `ogl` (Hero uniquement).
- **Qualité :** `tsc --noEmit` sans erreur sur `src/`, suite Vitest verte (`npm test`), 0 erreur console navigateur.
- **Sécurité :** mot de passe admin jamais en clair (hash PBKDF2), `data/sessions.json` et `.env.local` jamais versionnés, honeypot anti-spam.

## 5. Contraintes techniques
- Next.js 16 (App Router, `proxy.ts` et non `middleware.ts`), React 19, TypeScript strict, Tailwind CSS v4 (`@theme` dans `globals.css`).
- Persistance fichier JSON local (`data/portfolio.json`) — pas de base externe ; déploiement type VPS/serveur persistant (pas de serverless éphémère sans adaptation).

## 6. Hors-scope
Témoignages clients, tarifs, FAQ, timeline d'expérience, blog, multilingue, mode clair.
