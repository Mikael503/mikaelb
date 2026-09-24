# 02 — Architecture technique

## 1. Stack (versions installées)
| Couche | Choix |
|---|---|
| Framework | Next.js 16.3.3 (App Router) · React 19.2.8 · TypeScript 5 strict |
| Styles | Tailwind CSS v4 (tokens `@theme` dans `src/app/globals.css`) |
| Animations | framer-motion 13, GSAP 3.15 (menu mobile), OGL 1.0.11 (orbe Hero) |
| Icônes | lucide-react 1.35 (+ `react-icons` 5.7 pour la bande TechStack) |
| Validation | zod 4.4.3 (API contact) |
| Tests | Vitest 3 + Testing Library + jsdom (`npm test`, config `vitest.config.ts`) |
| Données | JSON local, aucune base externe |

> Next.js 16 : le middleware se nomme `proxy` (`proxy.ts`), pas `middleware.ts`.

## 2. Arborescence
```
src/
  app/
    page.tsx                  # page publique (force-dynamic)
    layout.tsx                # fonts Inter + Playfair Display, metadata SEO
    globals.css               # tokens @theme + keyframes + CSS LogoLoop/StaggeredMenu
    proxy.ts                  # garde admin
    admin/
      login/                  # /admin/login
      (dashboard)/            # layout + sidebar : page, profile, projects,
                              # skills, process, stats, messages, settings
    api/
      contact/route.ts        # POST formulaire → Resend
      admin/auth/login|logout|me/
      admin/profile|projects|skills|process|stats|messages|settings/
      admin/projects/duplicate/
  sections/                   # Hero, TechStack, About, Skills, Projects,
                              # Process, Stats, Contact (une par section publique)
  components/
    react-bits/               # AnimatedContent, Beams, BlurText, ChromaGrid,
                              # ClickSpark, DecryptedText, FoldText, LogoLoop,
                              # Magnet, MaskedTransitions, Orb, ScrollReveal,
                              # ShinyText, SplitText, SpotlightCard,
                              # StaggeredMenu, TiltedCard, TrueFocus (+ *.test.tsx)
    Header.tsx, Footer.tsx, Logo.tsx, WhatsAppIcon.tsx,
    GlassCard.tsx, BorderGlow.tsx, ProjectCard.tsx,
    StatCard.tsx, SkillBar.tsx, BackToTop.tsx, ...
  lib/
    data-store.ts             # lecture/écriture data/portfolio.json + types
    public-data.ts            # mapping store → types publics (getPublicData)
    auth.ts                   # hash PBKDF2 + sessions cookie (7 jours)
    utils.ts                  # cn()
  hooks/                      # useCountUp, useScrollSpy
  data/                       # profile.ts, projects.ts, skills.ts, process.ts (fallback statique)
data/
  portfolio.json              # SOURCE DE VÉRITÉ (écrit par l'admin, ignoré par git)
  sessions.json               # sessions admin (ignoré par git, jamais versionné)
public/
  images/projects/*.jpg      # visuels projets (ignorés par git, upload admin)
  cv/mikael-bohime-cv.pdf    # CV téléchargeable (idem)
```

## 3. Flux de données
```
Admin (client) → fetch PUT/POST /api/admin/* → getStoreFresh()
  → mutation store → writeStoreToFile() → data/portfolio.json
Public : page.tsx (Server Component, force-dynamic) → getPublicData()
  → getStoreFresh() lit portfolio.json (ou fallback src/data/* si absent)
  → sections
```
Conséquence : toute modification admin est visible côté public **sans rebuild**.
⚠️ Ne fonctionne que sur hébergement à filesystem persistant (pas de serverless éphémère sans adapter le store).

## 4. Auth admin
- Login : `ADMIN_EMAIL` + mot de passe vérifié contre `ADMIN_PASSWORD_HASH`
  (base64 de `{"hash","salt"}` PBKDF2 — généré par `node scripts/hash-password.mjs "MotDePasse"`).
- Session : cookie `ADMIN_SESSION_COOKIE` signé via `AUTH_SECRET` (TTL 7 jours, fichier `data/sessions.json`).
- Après `git clone`, les sessions sont vides : il faut se reconnecter.

## 5. Variables d'environnement (`.env.local`, jamais commité)
`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `ADMIN_DATA_PATH=./data`,
`ADMIN_DATA_FILE=portfolio.json`, `ADMIN_SESSION_COOKIE=admin_session`,
`CONTACT_EMAIL`, `RESEND_API_KEY` (modèle : `.env.example`).

## 6. Commandes
| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local `:3000` |
| `npm run build` / `npm start` | build + serveur prod |
| `npm test` | suite Vitest (12 tests) |
| `npx tsc --noEmit` | types (référence : 0 erreur dans `src/`) |
| `node scripts/hash-password.mjs "xxx"` | génère `ADMIN_PASSWORD_HASH` |
