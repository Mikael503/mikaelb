# 04 — Guide de reproduction pas-à-pas

Objectif : reconstruire ce portfolio à l'identique, dans l'ordre, sans rien deviner.

## Étape 1 — Prérequis
Node.js 20+, npm, Git, un compte Resend (clé API) pour le formulaire.

## Étape 2 — Scaffold
```bash
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir
cd portfolio
npm install framer-motion gsap lucide-react ogl react-icons zod
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```
Next.js 16 : le middleware s'appelle `proxy` (`proxy.ts`).

## Étape 3 — Design system d'abord
1. Copier les tokens du doc 03 §2 dans `globals.css` (`@theme inline`).
2. Charger Inter + Playfair Display via `next/font/google` (`display: swap`).
3. Créer `lib/utils.ts` (`cn`), `GlassCard`, `Logo`, `WhatsAppIcon`.

## Étape 4 — Données
1. Créer `src/data/profile.ts`, `projects.ts`, `skills.ts`, `process.ts`
   (contenus : voir doc 01 §3 et fichiers du repo).
2. Créer `src/lib/data-store.ts` (lecture/écriture `data/portfolio.json`) et
   `src/lib/public-data.ts` (`getPublicData()` + fallback statique).
3. Vider `data/portfolio.json` au premier lancement : le store se régénère
   (fonction de seed) — vérifier que le site s'affiche avec les données statiques.

## Étape 5 — Sections publiques (dans l'ordre du doc 01 §3.1)
Hero (+ `Orb`, `Beams`, `BlurText`, `DecryptedText`, `Magnet`) → `TechStack`
(`LogoLoop`) → About (+ `ScrollReveal`) → Skills → Projects (`ProjectCard`
+ `ChromaGrid`, boutons tactiles 44px) → Process (6 colonnes dès `lg`,
timeline verticale sinon) → Stats (`useCountUp`, valeurs 5+/5/1/57%) →
Contact (WhatsApp `wa.me/<chiffres>`, formulaire + honeypot) → Footer.
Titres bicolores via `TrueFocus` ; page en `force-dynamic`.

## Étape 6 — Admin + contact email
1. Routes `/admin/*` + `/api/admin/*` + `proxy.ts` (voir doc 02 §2).
2. `.env.local` d'après `.env.example` ; hash via
   `node scripts/hash-password.mjs "MotDePasse"`.
3. Tester : login → modifier un projet → vérifier sur le site public **sans rebuild**.
4. Renseigner `RESEND_API_KEY` + `CONTACT_EMAIL`, envoyer un message test.

## Étape 7 — Images et CV
Déposer `public/images/projects/nova-studio.jpg`, `bizflow.jpg`, `bloop.jpg`
(≤ 1600px, qualité 80 ; recadrer watermark éventuels) + `public/cv/*.pdf`.
Sans ces fichiers : le site reste propre (fallback dégradé + titre), sauf le
bouton CV qui pointera dans le vide — à tester.

## Étape 8 — Vérifications (checklist de fidélité)
- [ ] `npm test` : 12/12 verts · `npx tsc --noEmit` : 0 erreur dans `src/`
- [ ] 390 / 768 / 1440px : 0 scroll horizontal, 0 erreur console
- [ ] Compteurs figés sur 5+ / 5 / 1 / 57% · titres espacés (« En Chiffres »)
- [ ] Menu mobile : ouverture, liens 01–06, bouton CV, navigation + fermeture
- [ ] Formulaire vide → erreur ; message test → reçu par email
- [ ] Comparer chaque section aux captures `docs/captures/`

## Étape 9 — Déploiement
VPS/serveur persistant (`npm run build && npm start`) — **pas** de serverless
éphémère (le store JSON y perdrait les écritures admin). `AUTH_SECRET` unique
en production, compte admin frais (les `data/sessions.json` ne voyagent jamais).
