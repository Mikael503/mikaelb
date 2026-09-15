# Portfolio Mikael — Portfolio personnel de Développeur

Un site portfolio premium et responsive, construit avec Next.js, TypeScript et Tailwind CSS v4, conçu pour présenter l'identité, les compétences, les projets, le processus de travail, les statistiques et les coordonnées de Mikael Bohime — développeur full-stack basé à Cotonou, Bénin.

---

## 📋 Vue d'ensemble

Le portfolio est une landing page unique avec navigation fluide entre les sections. Il fonctionne en mode client-side pour le scroll, les animations et la navigation, avec un backend léger (Next.js API route) pour le formulaire de contact.

**Sections de la page (dans l'ordre) :**

| # | Section | Section ID | Description |
|---|---------|------------|-------------|
| 1 | **Hero** | `#home` | Titre principal avec BlurText + ShinyText, deux CTA, bande d'availability, photo de profil avec halos verts et Beams animés |
| 2 | **À propos** | `#about` | Carte glassmorphism avec biographie longue + 4 infos structurées (Nom, Localisation, Email, Disponibilité) |
| 3 | **Mon Expertise** | `#skills` | 5 barres de compétences animées au scroll (HTML/CSS/JS, React/Next.js/Tailwind, Figma/Responsive/UI-UX, Git/GitHub, Vercel/WordPress) |
| 4 | **Projets Sélectionnés** | `#projects` | Grille de 3 cartes de projets (FinTrack, ShopVista, Taskify) avec MaskedTransitions sur l'image, technologies, liens Live + GitHub |
| 5 | **Mon Processus** | `#process` | Timeline 6 étapes — horizontale sur desktop (TiltedCard avec tilt jusqu'à 16° + glow au hover), verticale sur mobile |
| 6 | **En Chiffres** | `#stats` | 4 StatCards avec compteurs animés (20+ Clients, 20+ Projets, 4+ Années, 99% Satisfaction) |
| 7 | **Contact** | `#contact` | Deux colonnes : infos (email, téléphone, localisation, disponibilité) + formulaire avec validation, honeypot, rate limiting, BorderGlow animé sur la carte |
| 8 | **Footer** | — | Logo, navigation courte, réseaux sociaux, copyright dynamique, bouton BackToTop flottant |

---

## ✨ Fonctionnalités implémentées (ce qui marche)

### Design & direction artistique

- **Palette** : fond #0a0a0a (background), accents verts `#7cb68a` / `#9dd4a8`, surfaces glassmorphism, bordures subtiles `rgba(255,255,255,0.08)`
- **Effets glass** : classe `.glass` (backdrop-filter blur 12px, fond semi-transparent, bordure fine) appliquée à toutes les cartes
- **Glow** : `.glow-accent` et `.glow-accent-strong` pour les ombres portées vertes verbondées
- **Typographie** : Inter (sans) + Playfair Display (éditorial/serif) + Geist Mono (monospace), chargées via `next/font/google` avec `display: swap`
- **Design system** : tout centralisé dans `@theme inline` de Tailwind v4 (couleurs, fonts, tokens) dans `globals.css`

### Animations (Framer Motion + composants React Bits)

Toutes les animations sont déclenchées par IntersectionObserver (révélation au scroll) et respectent `prefers-reduced-motion` :

| Animation | Fichier | Usage |
|-----------|---------|-------|
| **BlurText** | `src/components/react-bits/BlurText.tsx` | Hero — chaque mot du titre apparaît en fondu depuis le haut avec blur (par mots, direction « top ») |
| **ShinyText** | `src/components/react-bits/ShinyText.tsx` | Hero — le mot « des résultats » a un dégradé text qui se déplace en continu (keyframes `shiny`, `background-clip: text`) |
| **SplitText** | `src/components/react-bits/SplitText.tsx` | En-têtes section (À propos, Projets, Processus, Contact) — chaque caractère apparaît en cascade avec un delay de 0.03s/char |
| **FoldText** | `src/components/react-bits/FoldText.tsx` | En-têtes (Mon Expertise, En Chiffres) — repli 3D rotateX depuis le bas, origin transform bottom |
| **AnimatedContent** | `src/components/react-bits/AnimatedContent.tsx` | Enveloppe toutes les sections — fade + translation (direction configurable, distance 50px, durée 0.8s) |
| **TiltedCard** | `src/components/react-bits/TiltedCard.tsx` | Timeline Processus — tilt en 3D basé sur la position de la souris (max 16°, scale 1.07), settle 0.6s au pointerleave |
| **MaskedTransitions** | `src/components/react-bits/MaskedTransitions.tsx` | Cartes projets — clip-path reveal (direction « left », durée 0.8s) + overlay noir qui révèle |
| **Beams** | `src/components/react-bits/Beams.tsx` | Hero — canvas animé (4 rayons verts tournant, opacité 0.08, vitesse 0.15) derrière la zone photo |
| **CountUp** | `src/hooks/useCountUp.ts` | Stats — compteurs qui animent vers la valeur finale (easing cubic, 2s) une seule fois au premier intersect |
| **BackToTop** | `src/components/BackToTop.tsx` | Bouton flottant qui apparaît après 500px de scroll (Framer Motion AnimatePresence) |

### Composants réutilisables

| Composant | Fichier | Rôle |
|-----------|---------|------|
| **GlassCard** | `src/components/GlassCard.tsx` | Carte glassmorphism avec props `glow`, `hover`, `as` (div/section/article), tag moteur pré-créé en module scope (correction ESLint `static-components`) |
| **BorderGlow** | `src/components/BorderGlow.tsx` | Animation de bordure conique qui tourne (keyframes `border-glow-rotate`, `@property --border-glow-angle`), appliqué au formulaire de contact et à l'image Hero |
| **Button** | `src/components/Button.tsx` | Bouton avec variantes `primary` / `secondary` / `ghost`, icône optionnelle |
| **SkillBar** | `src/components/SkillBar.tsx` | Barre de compétence : label + pourcentage + barre animée (width: 0% → valeur au premier intersect via IntersectionObserver) |
| **StatCard** | `src/components/StatCard.tsx` | Carte statistique avec icône + compteur animé (useCountUp) + label |
| **ProjectCard** | `src/components/ProjectCard.tsx` | Carte projet : image MaskedTransitions, catégorie, titre, description, tags technos, boutons Live/GitHub au hover |
| **Header** | `src/components/Header.tsx` | Header sticky, transparent au chargement, glass au scroll (>20px), logo + nav centrée (visible ≥1024px) + hamburger mobile, active link avec glow vert |
| **MobileMenu** | `src/components/MobileMenu.tsx` | Menu plein écran animé (Framer Motion AnimatePresence), liens + bouton CV, body scroll lock |
| **Footer** | `src/components/Footer.tsx` | Logo + nav + réseaux sociaux (GitHub, LinkedIn, Twitter, Email) + copyright dynamique |
| **BackToTop** | `src/components/BackToTop.tsx` | Bouton retour en haut (apparaît après 500px, smooth scroll) |
| **SocialIcons** | `src/components/SocialIcons.tsx` | Icônes de marque SVG personnalisées (Github, LinkedIn, Twitter) — lucide-react ne les inclut plus |

### Navigateur / responsive

- **Desktop (≥1024px)** : Hero 2 colonnes (contenu / photo), About + Skills empilés, Projects grille 3 colonnes, Process timeline horizontale 6 colonnes, Stats grille 4 colonnes, Contact 2 colonnes (info / formulaire)
- **Mobile (<1024px)** : Hero 1 colonne (contenu puis photo), About + Skills empilés, Projects 1 colonne, Process timeline verticale, Stats 2×2, Contact 1 colonne
- **Navigation** : desktop = liens centrés dans le header ; mobile = hamburger → menu plein écran
- **Aucun overflow horizontal** (scrollWidth = viewport sur tous les break points testés)

### SEO

| Élément | Fichier | Détail |
|---------|---------|--------|
| `lang="fr"` | `layout.tsx` | Attribut sur `<html>` |
| Title | `layout.tsx` | `default` + `template` ("%s | Mikael Bohime") |
| Meta description | `layout.tsx` | Une ligne décrivant le profil |
| Open Graph | `layout.tsx` | `type`, `locale`, `url`, `title`, `description`, `siteName` |
| Twitter Card | `layout.tsx` | `summary_large_image`, title, description, creator `@mikaelbohime` |
| Robots | `layout.tsx` + `public/robots.txt` | Indexation autorisée, Google Bot max-image-preview large |
| JSON-LD Schema.org | `layout.tsx` | `Person` : name, jobTitle, url, email, address (PostalAddress Cotonou/Bénin), sameAs (github, linkedin, twitter) |
| Sitemap | `src/app/sitemap.ts` | Dynamique, URL `https://mikaelbohime.dev` |
| Canonical | implicite | Next.js définit le canonical depuis `metadataBase` |
| `robots.txt` | `public/robots.txt` | Allow: /, Sitemap: https://mikaelbohime.dev/sitemap.xml |

### Performance

- **Fonts** : préchargées via `next/font/google` avec `display: swap`
- **Framer Motion** : utilisé uniquement là où il apporte de la valeur (tout est client-side, pas de SSR inutile)
- **Images** : placeholders CSS (gradient + initials) dans le Hero ; les vraies images de projets sont déclarées dans `projects.ts` mais non encore déposées dans `public/images/`
- **Build** : statique pour `/`, `/sitemap.xml`, `/_not-found` ; dynamique (server-rendered on demand) pour `/api/contact`

---

## ⚙️ Stack technique

| Catégorie | Détail |
|-----------|--------|
| **Framework** | Next.js 16.3.3 (App Router) |
| **Langage** | TypeScript 5, strict mode (`strict: true` dans tsconfig) |
| **CSS** | Tailwind CSS 4 (`@tailwindcss/postcss`), `@theme inline` pour le système de design |
| **Animations** | Framer Motion 13 (`motion`, `AnimatePresence`, `motion.create` remplacé par map statique dans GlassCard) |
| **Icônes** | Lucide React 1.35 + icônes de marque SVG personnalisées (GitHub, LinkedIn, Twitter) |
| **Validation** | Zod 4 (contact API) |
| **Utilitaire classes** | `clsx` via `src/lib/utils.ts` → `cn(...)` |
| **Lint** | ESLint 9 + `eslint-config-next` 16 (`eslint.config.mjs`), règles Next.js vitals + TypeScript |
| **Dev server** | `next dev` (port par défaut : 3000) |
| **Build** | `next build` → sortie `.next/` |
| **Start** | `next start` |

---

## 🗂️ Structure du projet (100% conforme à ce qui est déployé)

```
portfolio-mikael/
├── public/
│   ├── robots.txt            # Allow: / + Sitemap URL
│   ├── file.svg              # SVG par défaut (Vercel boilerplate, non utilisé)
│   ├── globe.svg             # SVG par défaut (Vercel boilerplate, non utilisé)
│   ├── next.svg              # SVG par défaut (Vercel boilerplate, non utilisé)
│   ├── vercel.svg            # SVG par défaut (Vercel boilerplate, non utilisé)
│   ├── window.svg            # SVG par défaut (Vercel boilerplate, non utilisé)
│   └── images/               # (vide — à remplir avec profile.jpg + projets/)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout : fonts, métadonnées, JSON-LD Person, lang="fr"
│   │   ├── page.tsx          # Page principale : Header → sections → Footer → BackToTop
│   │   ├── globals.css       # @theme inline (design system), keyframes, .glass, .border-glow, focus-visible
│   │   ├── not-found.tsx     # (n'existe pas — Next.js utilise la page par défaut)
│   │   └── api/contact/
│   │       └── route.ts      # POST : validation Zod + honeypot + rate limiting + console.log (email non actif)
│   ├── components/
│   │   ├── Header.tsx        # Sticky, transparent→glass, nav centrée desktop, hamburger mobile
│   │   ├── MobileMenu.tsx    # Plein écran animé, liens + CV
│   │   ├── Footer.tsx        # Logo + nav + réseaux sociaux + copyright
│   │   ├── BackToTop.tsx     # Bouton flottant (Framer Motion)
│   │   ├── GlassCard.tsx     # Carte glass réutilisable (motionTags pré-créés, correction ESLint)
│   │   ├── Button.tsx        # variant="primary|secondary|ghost" + icône
│   │   ├── SkillBar.tsx      # Barre animée au scroll (IntersectionObserver)
│   │   ├── StatCard.tsx      # Compteur animé (useCountUp) + icône
│   │   ├── ProjectCard.tsx   # Image MaskedTransitions + contenu + liens Live/GitHub
│   │   ├── BorderGlow.tsx    # Animation de bordure conique tournante (formulaire + photo)
│   │   ├── SocialIcons.tsx   # SVG personnalisés (GitHub, LinkedIn, Twitter)
│   │   └── react-bits/
│   │       ├── AnimatedContent.tsx  # Reveal au scroll (IntersectionObserver)
│   │       ├── BlurText.tsx         # Mot par mot, blur + translation
│   │       ├── ShinyText.tsx        # Dégradé text animé (background-clip)
│   │       ├── SplitText.tsx        # Caractère par caractère, cascade
│   │       ├── FoldText.tsx         # Repli 3D rotateX
│   │       ├── Beams.tsx            # Canvas rayons verts animés
│   │       ├── MaskedTransitions.tsx # Reveal clip-path image
│   │       ├── TiltedCard.tsx       # Tilt 3D souris (useSyncExternalStore pour reduced motion)
│   ├── sections/
│   │   ├── Hero.tsx          # BlurText + ShinyText, CTA, availability, photo placeholder, Beams
│   │   ├── About.tsx         # GlassCard + info items + bouton "En savoir plus"
│   │   ├── Skills.tsx        # 5 SkillBars dans GlassCard
│   │   ├── Projects.tsx      # Grille 3 colonnes + bouton "Voir tous les projets"
│   │   ├── Process.tsx       # Timeline 6 étapes : horizontale desktop / verticale mobile
│   │   ├── Stats.tsx         # 4 StatCards avec compteurs
│   │   └── Contact.tsx       # Infos + formulaire (validation, honeypot, états loading/success/error, BorderGlow)
│   ├── data/
│   │   ├── profile.ts        # Données personnelles centralisées
│   │   ├── projects.ts       # 3 projets (FinTrack, ShopVista, Taskify)
│   │   ├── skills.ts         # 5 lignes de compétences (groupées)
│   │   └── process.ts        # 6 étapes du processus
│   ├── hooks/
│   │   ├── useScrollSpy.ts   # IntersectionObserver pour le lien actif de la nav
│   │   └── useCountUp.ts     # Compteur animé une seule fois
│   └── lib/
│       └── utils.ts          # cn(...) = clsx
├── .env.example              # CONTACT_EMAIL + RESEND_API_KEY (modèle, non utilisé)
├── .gitignore
├── eslint.config.mjs         # ESLint Next.js + TypeScript
├── next.config.ts            # Config Next.js (vide actuellement)
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts        # (géré par Tailwind v4 @theme, pas de config classique)
└── tsconfig.json             # Strict, moduleResolution: bundler, paths: @/* → ./src/*
```

---

## 🔧 Personnalisation (toutes les données centralisées)

### 1. Profil — `src/data/profile.ts`

```ts
export const profile = {
  name: "Mikael Bohime",            // nom complet (utilisé partout : Header, Footer, SEO, JSON-LD)
  firstName: "Mikael",              // prénom seulement (copyright Footer)
  initials: "MB",                   // initiales affichées dans le placeholder Hero
  role: "Développeur Logiciel",     // métier
  tagline: "...",                   // slogan (non affiché actuellement dans le Hero)
  bio: "...",                       // description courte (Hero)
  longBio: "...",                   // biographie longue (section À propos)
  photo: "/images/profile.jpg",     // chemin de la photo (non déposée — placeholder actuellement)
  location: "Cotonou, Bénin",
  email: "mikaelbohime8@gmail.com",
  phone: "+229 XX XX XX XX",
  availability: "Disponible pour de nouveaux projets",
  spotsLeft: "Plus que 3 places",
  cvUrl: "/cv/mikael-bohime-cv.pdf", // CV — servi depuis public/cv/, bouton dans le Header (desktop) et le MobileMenu
  socialLinks: {
    github: "https://github.com/mikaelbohime",
    linkedin: "https://linkedin.com/in/mikaelbohime",
    twitter: "https://twitter.com/mikaelbohime",
    email: "mailto:mikaelbohime8@gmail.com",
  },
  stats: [
    { label: "Clients Satisfaits", value: 20, suffix: "+" },
    { label: "Projets Réalisés", value: 20, suffix: "+" },
    { label: "Années d'Expérience", value: 4, suffix: "+" },
    { label: "Taux de Satisfaction", value: 99, suffix: "%" },
  ],
  floatingStats: [...],             // (données présentes mais jamais rendues — FloatingStat supprimé)
  clients: [...],                   // (données présentes mais jamais rendues — bande Hero supprimée)
};
```

Pour modifier : éditez simplement les valeurs. Tout le reste (composants, sections) s'adapte automatiquement.

### 2. Projets — `src/data/projects.ts`

Chaque projet :
```ts
{
  id: string,
  title: string,
  slug: string,
  category: string,
  description: string,
  image: string,               // chemin dans public/images/ (non déposé)
  technologies: string[],
  liveUrl?: string,            // optionnel
  githubUrl?: string,          // optionnel
  featured: boolean,           // (toujours true pour les 3 actuels)
  order: number,               // ordre d'affichage dans la grille
}
```

Pour ajouter un projet : ajoutez un objet au tableau `projects`. La grille tripe par `order` et affiche automatiquement les cartes.

### 3. Compétences — `src/data/skills.ts`

```ts
export const skills: Skill[] = [
  { name: "HTML / CSS / JavaScript", percentage: 95 },
  { name: "React / Next.js / Tailwind CSS", percentage: 90 },
  { name: "Figma / Responsive Design / UI-UX", percentage: 85 },
  { name: "Git / GitHub", percentage: 90 },
  { name: "Vercel / WordPress", percentage: 85 },
];
```

Les pourcentages sont des indicateurs visuels, pas des mesures scientifiques.

### 4. Processus — `src/data/process.ts`

```ts
export const processSteps: ProcessStep[] = [
  { number: "01", title: "Découvrir", description: "...", icon: "Search" },
  { number: "02", title: "Planifier", description: "...", icon: "Map" },
  { number: "03", title: "Concevoir", description: "...", icon: "Palette" },
  { number: "04", title: "Développer", description: "...", icon: "Code2" },
  { number: "05", title: "Tester", description: "...", icon: "Bug" },
  { number: "06", title: "Déployer", description: "...", icon: "Rocket" },
];
```

Les icônes sont mappées dans `Process.tsx` via `iconMap` (Search, Map, Palette, Code2, Bug, Rocket — tous depuis lucide-react).

### 5. Image de profil

Placez votre photo dans `public/images/profile.jpg` (recommandé : 800×800px ou 1000×1000px, format WebP/JPG).
Le Hero utilise actuellement un placeholder CSS avec les initiales « MB ».

### 6. CV

Déposez votre CV dans `public/cv/` (fichier actuel : `public/cv/mikael-bohime-cv.pdf`, remplaçable par un fichier du même nom, ou changez `profile.cvUrl`).
Le bouton « Télécharger le CV » est disponible dans le header desktop (`Header.tsx`) et dans le menu mobile (`MobileMenu.tsx`) ; il utilise l'attribut `download` pour forcer le téléchargement.

### 7. Formulaire de contact — envoi d'emails

Le formulaire valide et rate-limite les soumissions, mais l'envoi d'email est **un console.log** pour l'instant (voir `src/app/api/contact/route.ts`, ligne TODO).

Pour activer l'envoi réel :
1. Créez un fichier `.env.local` (ne jamais committer `.env.local`)
2. Ajoutez la clé de votre service (ex. Resend : `RESEND_API_KEY=re_xxxxx`)
3. Éditez `src/app/api/contact/route.ts` pour intégrer votre service (exemple Resend fourni en commentaire)

Variables d'environnement possibles (définissez dans `.env.local`, jamais dans le code) :
```
CONTACT_EMAIL=mikaelbohime8@gmail.com
RESEND_API_KEY=re_xxxxx
```

### 8. Liens sociaux

Dans `profile.ts`, modifiez `socialLinks` (GitHub, LinkedIn, Twitter, Email).
Les liens sont affichés dans le Footer et dans le menu mobile.

### 9. Métadonnées SEO

Dans `src/app/layout.tsx`, modifiez :
- `metadata.title.default` et `template`
- `metadata.description`
- `metadata.openGraph` (title, description, siteName)
- `metadata.twitter`
- Le JSON-LD Person (name, jobTitle, url, email, address, sameAs)

### 10. Nom de domaine

Dans `layout.tsx` : `metadataBase: new URL("https://mikaelbohime.dev")`.
Dans `robots.txt` : `Sitemap: https://mikaelbohime.dev/sitemap.xml`.
À mettre à jour si le domaine change.

---

## ✅ Ce qui fonctionne (vérifié)

| Fonctionnalité | État |
|----------------|------|
| TypeScript strict (`tsc --noEmit`) | ✅ 0 erreur |
| ESLint (`eslint src`) | ✅ 0 erreur, 0 warning |
| Build de production (`npm run build`) | ✅ passe — routes `/`, `/api/contact`, `/sitemap.xml` |
| Navigation desktop (liens centrés) | ✅ |
| Navigation mobile (hamburger → menu plein écran) | ✅ |
| Scroll spy (Header détecte la section active) | ✅ |
| Hero : BlurText + ShinyText « des résultats » | ✅ (le « S » de résultats n'est plus coupé grâce au padding/margin correctif dans ShinyText.tsx) |
| Beams animés derrière la photo | ✅ (canvas, 4 rayons, opacité 0.08) |
| Image Hero placeholder (initiales MB + dégradé) | ✅ |
| Section À propos : GlassCard + info items | ✅ |
| Section Compétences : 5 barres animées au scroll | ✅ |
| Section Projets : 3 cartes MaskedTransitions | ✅ (les boutons Live/GitHub apparaissent au hover, liens réels vers Vercel Demo + GitHub) |
| Section Processus : 6 étapes + TiltedCard (16° + glow) | ✅ (horizontal desktop / vertical mobile) |
| Section Stats : 4 compteurs animés (countUp, 1 activation) | ✅ |
| Formulaire de contact : validation frontend + honeypot + rate limiting + états loading/success/error | ✅ |
| API contact : validation Zod + rate limiting (5 req/min/IP, mémoire) + honeypot | ✅ |
| BorderGlow sur le formulaire de contact | ✅ (bordure conique tournante, 6s, vert #7cb68a, respecte prefers-reduced-motion) |
| Footer : logo + nav + réseaux sociaux + copyright dynamique | ✅ |
| BackToTop : bouton flottant (après 500px) | ✅ |
| SEO : lang="fr", title, description, OG, Twitter, JSON-LD Person, robots.txt, sitemap | ✅ |
| Responsive : aucun overflow horizontal (testé 320px → 1440px) | ✅ |
| Accessibilité : focus-visible (border accent), aria-labels sur boutons icon-only, structure sémantique (header/nav/main/section/footer), formulaires avec labels | ✅ |
| Respect `prefers-reduced-motion` | ✅ (animations désactivées : float, border-glow, scroll-behavior; le TiltedCard utilise useSyncExternalStore pour observer en direct) |

---

## ⚠️ Ce qui ne fonctionne PAS / ce qui est incomplet (à savoir avant de mettre en production)

### 1. Pas de photo de profil réelle

- `profile.photo = "/images/profile.jpg"` mais `public/images/` est **vide**
- Le Hero affiche un placeholder CSS : les initiales « MB » + « Votre photo ici » + un dégradé
- **Action requise** : déposer `profile.jpg` (ou un format WebP/AVIF optimisé) dans `public/images/`

### 2. Pas d'images de projets

- `projects.ts` pointe vers `/images/projects/fintrack.jpg`, `shopvista.jpg`, `taskify.jpg`
- `public/images/projects/` n'existe pas
- `ProjectCard` affiche un placeholder 🚀 + le titre, pas l'image réelle
- **Action requise** : créer `public/images/projects/` et déposer les 3 images (recommandé : WebP/AVIF, dimensions explicites dans le composant pour éviter le CLS)

### 3. CV — résolu

- `profile.cvUrl = "/cv/mikael-bohime-cv.pdf"` et le fichier est bien présent dans `public/cv/`
- Le bouton « Télécharger le CV » existe dans le header desktop (`Header.tsx`) **et** dans le menu mobile (`MobileMenu.tsx`)
- Le profil du back-office (`data/portfolio.json`) a un `cvUrl` distinct : renseignez-le dans Admin → Profil → « URL du CV » si vous voulez piloter le lien depuis l'admin

### 4. Bouton « En savoir plus sur moi » inactif

- Dans `About.tsx`, le bouton « En savoir plus sur moi » est un `<Button>` sans `onClick` ni `href` — il ne fait rien
- **Action requise** : soit le relier à une section/une page existante, soit supprimer le bouton, soit lui donner une action réelle (ex. ancrage vers une section « plus de détails »)

### 5. Bouton « Voir tous les projets » inactif

- Dans `Projects.tsx`, le bouton « Voir tous les projets » fait `window.open("#", "_blank")` — ouvre un onglet avec `about:blank`
- **Action requise** : soit le diriger vers une page de projets (si routing multi-pages prévu), soit le supprimer, soit le remplacer par un lien réel

### 6. Formulaire de contact : pas d'envoi d'email réel

- L'API `/api/contact` valide et rate-limite, mais l'envoi d'email est juste un `console.log`
- La soumission réussie affiche le message « Message envoyé avec succès ! » au frontend, mais personne ne reçoit l'email
- **Action requise** : intégrer un service email (Resend, Nodemailer, SendGrid, etc.) — la clé API doit aller dans `.env.local`, jamais dans le code ou le bundle frontend

### 7. Témoignages (section Testimonials) supprimés

- La section « What Clients Say » a été supprimée du portfolio sur demande (page, navigation, fichiers : `Testimonials.tsx`, `TestimonialCarousel.tsx`, `testimonials.ts`)
- Les données `testimonials.ts` n'existent plus et ne sont importées nulle part
- **Action requise** : aucune — la suppression est volontaire. Si tu veux les témoignages de retour, dis-le moi et je les remets

### 8. BorderGlow sur l'image Hero supprimé

- Sur demande précédente, le BorderGlow a été retiré de la photo du Hero (composant `BorderGlow.tsx` supprimé, keyframes `border-glow-rotate` retirées de `globals.css`)
- Le BorderGlow reste **uniquement sur le formulaire de contact** (Section Contact)
- Si tu veux le BorderGlow de retour sur la photo, dis-le moi

### 9. Bande « clients / marques » du Hero supprimée

- Les 5 noms (FinTrack, ShopVista, Taskify, TechLab, InnoSoft) étaient affichés en bas du Hero, maintenant supprimés
- Les données `profile.clients` existent toujours dans `profile.ts` mais ne sont plus rendues nulle part
- Si tu veux les remettre (avec de vrais logos/noms), dis-le moi

### 10. Données orphelines dans `profile.ts`

- `profile.floatingStats` : données présentes mais jamais rendues (composant `FloatingStat` supprimé)
- `profile.clients` : données présentes mais jamais rendues (bande Hero supprimée)
- **Action requise** : soit supprimer ces deux tableaux de `profile.ts` (nettoyage), soit les réutiliser si tu remets les fonctionnalités correspondantes

### 11. `.env.local` inexistant

- Le projet ne dispose pas de fichier `.env.local`
- Les variables `CONTACT_EMAIL` et `RESEND_API_KEY` sont mentionnées dans `.env.example` mais non actives
- **Action requise** : créer `.env.local` pour l'envoi d'emails (ne jamais committer ce fichier)

### 12. SVG par défaut Vercel non utilisés

- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` sont les SVG par défaut du boilerplate Create Next App
- Ils ne sont référencés nulle part dans le code actuel
- **Action requise** : soit les supprimer (nettoyage), soit les utiliser comme favicon/social preview

### 13. Favicon non configuré

- Aucun favicon n'est déclaré dans `layout.tsx` ni déposé dans `public/`
- Le navigateur utilise le favicon par défaut du navigateur
- **Action requaire** : soit ajouter un icon dans `layout.tsx` (`metadata.icon`), soit déposer `favicon.ico` / `favicon.svg` dans `public/`

### 14. Nothing is committed

- Le dépôt Git contient uniquement le commit initial « Initial commit from Create Next App »
- **Tout le travail (Header, sections, composants, animations, formulaire, SEO, …) est non commité**
- `git status` montre : modifié (`README.md`, `package.json`, `package-lock.json`, `globals.css`, `layout.tsx`, `page.tsx`) + ajouté (`public/robots.txt`, `src/app/api/`, `src/app/sitemap.ts`, `src/components/`, `src/data/`, `src/hooks/`, `src/lib/`, `src/sections/`)
- **Action requise** : faire un commit pour sauvegarder l'état actuel (le build passe et le lint est propre — c'est un bon point de sauvegarde)

### 15. Description et auteur du package.json

- `package.json` a encore la description et l'auteur par défaut de Create Next App
- **Action requise** : les mettre à jour (description : « Portfolio personnel de Mikael Bohime — Développeur full-stack »)

---

## 🚀 Commandes utiles

```bash
# Installer les dépendances
npm install

# Serveur de développement (port 3000 par défaut)
npm run dev

# Build de production
npm run build

# Serveur de production (après build)
npm start

# Vérifier le type TypeScript
npx tsc --noEmit

# Lint du projet
npm run lint
# ou
npx eslint src
```

Le serveur de développement écoute par défaut sur `http://localhost:3000`.

---

## 🧪 Tester manuellement avant mise en production

```bash
# 1. Build propre (erreur = problème bloquant)
npm run build

# 2. TypeScript strict
npx tsc --noEmit

# 3. Lint (erreur = problème bloquant, warning = à vérifier)
npx eslint src

# 4. Ouvrir le site et vérifier :
#    - Hero : titre BlurText/ShinyText, CTA, photo placeholder
#    - Navigation desktop et mobile (hamburger)
#    - Scroll spy (le lien actif change au scroll)
#    - About : GlassCard + infos
#    - Skills : 5 barres animées au scroll
#    - Projets : 3 cartes, hover (boutons Live/GitHub)
#    - Processus : 6 étapes (hover tilt + glow sur desktop)
#    - Stats : 4 compteurs (animation au premier scroll)
#    - Contact : formulaire + validation + honeypot (champ caché)
#    - Footer : logo + réseaux sociaux
#    - BackToTop : bouton après 500px de scroll
#    - BorderGlow : bordure tournante sur le formulaire
```

---

## 📬 Contact

- **Email** : mikaelbohime8@gmail.com
- **GitHub** : https://github.com/mikaelbohime
- **LinkedIn** : https://linkedin.com/in/mikaelbohime
- **Twitter** : https://twitter.com/mikaelbohime
- **Localisation** : Cotonou, Bénin
- **Site** : https://mikaelbohime.dev

---

## 📄 Licence

MIT
