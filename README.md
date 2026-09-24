# Portfolio Mikael Bohime

Site portfolio one-page + panel admin, construit avec Next.js 16, React 19,
TypeScript strict et Tailwind CSS v4. Présente l'identité, les compétences,
les projets (Nova Studio, BizFlow, BLOOP), le processus, les statistiques et
les coordonnées de Mikael Bohime — développeur full-stack basé à Cotonou, Bénin.

Documentation complète : [`docs/01-cahier-des-charges.md`](docs/01-cahier-des-charges.md) ·
[`docs/02-architecture.md`](docs/02-architecture.md) ·
[`docs/03-design-system.md`](docs/03-design-system.md) ·
[`docs/04-guide-reproduction.md`](docs/04-guide-reproduction.md)

---

## Sections publiques (dans l'ordre)

| # | Section | ID | Contenu |
|---|---|---|---|
| 1 | Hero | `#home` | Rôle en eyebrow `DecryptedText`, titre BlurText « Je transforme vos idées en expériences web exceptionnelles. », bio, CTA « Me contacter » / « Voir mes projets » (`Magnet`), dispo + localisation, orbe WebGL 480px + Beams (desktop uniquement) |
| 2 | TechStack | — | Bandeau défilant `LogoLoop` : 12 technos (React, Next.js, TypeScript, Tailwind, Node.js, Python, PostgreSQL, MongoDB, Git, Figma, Vercel, Docker) |
| 3 | About | `#about` | `longBio` avec `ScrollReveal` + 4 infos (Nom, Localisation, Email, Disponibilité) |
| 4 | Skills | `#skills` | 5 barres animées : HTML/CSS/JS 95%, React/Next.js/Tailwind 90%, Figma/Responsive/UI-UX 85%, Git/GitHub 90%, Vercel/WordPress 85% |
| 5 | Projects | `#projects` | 3 cartes (Nova Studio, BizFlow, BLOOP) : image avec fallback, `ChromaGrid` au survol, tags, boutons démo/GitHub visibles au tactile |
| 6 | Process | `#process` | 6 étapes (Découvrir → Déployer) : 6 colonnes dès `lg` (`TiltedCard`), timeline verticale sinon |
| 7 | Stats | `#stats` | 4 compteurs exacts : 5+ clients, 5 projets, 1 an, 57% (`useCountUp` + `SpotlightCard`) |
| 8 | Contact | `#contact` | Infos (Email, WhatsApp +229 01 92 73 52 05, Localisation, Disponibilité) + formulaire validé (honeypot, bouton `Magnet`+`ClickSpark`) |
| 9 | Footer | — | Logo MB, nav, copyright |

Titres de section bicolores avec `TrueFocus` (focus au survol).
Menu mobile : `StaggeredMenu` (GSAP) avec liens numérotés + bouton Télécharger CV.

## Panel admin (`/admin`, session cookie)
Tableau de bord, Profil, Projets, Compétences, Processus, Statistiques,
Messages, Paramètres — CRUD complet. Toute modification est écrite dans
`data/portfolio.json` et visible sur le site **sans rebuild** (`force-dynamic`).

## Stack

| Catégorie | Détail |
|---|---|
| Framework | Next.js 16.3.3 (App Router, `proxy.ts`) · React 19 · TypeScript 5 strict |
| CSS | Tailwind CSS v4 (`@theme` dans `globals.css`) |
| Animations | framer-motion 13, GSAP 3 (menu), OGL 1 (orbe) |
| Icônes | lucide-react + react-icons (TechStack) |
| Validation | zod 4 (API contact) |
| Tests | Vitest 3 + Testing Library + jsdom (`npm test`, 12 tests) |
| Données | JSON local (`data/portfolio.json`, ignoré par git) |

## Données et personnalisation
- Fallback statique : `src/data/profile.ts`, `projects.ts`, `skills.ts`, `process.ts`.
- En production de contenu, tout se pilote depuis l'admin (profil, projets,
  skills, process, stats, messages, paramètres) ou en éditant ces fichiers.
- Images projets : `public/images/projects/nova-studio.jpg`, `bizflow.jpg`,
  `bloop.jpg` (≤ 1600px, qualité 80). Sans fichier : fallback dégradé + titre, jamais de bug.
- CV : `public/cv/mikael-bohime-cv.pdf` (bouton header desktop + menu mobile).
- Contact email : `CONTACT_EMAIL` + `RESEND_API_KEY` dans `.env.local`
  (modèle : `.env.example` ; hash admin via `node scripts/hash-password.mjs`).
- `data/sessions.json` et `.env.local` ne sont jamais versionnés.

## Commandes

```bash
npm install          # dépendances
npm run dev          # http://localhost:3000
npm run build && npm start
npm test             # suite Vitest
npx tsc --noEmit     # 0 erreur attendue dans src/
```

## Déploiement
Hébergeur à filesystem persistant requis (`npm run build && npm start`) —
pas de serverless éphémère (le store JSON y perdrait les écritures admin).
`AUTH_SECRET` unique en production.

## Contact
- **Email** : mikaelbohime8@gmail.com
- **WhatsApp** : +229 01 92 73 52 05
- **Localisation** : Cotonou, Bénin
- **Site** : https://mikaelbohime.dev

## Licence
MIT
