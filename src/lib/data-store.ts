import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface Profile {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  tagline: string;
  bio: string;
  longBio: string;
  photo: string;
  location: string;
  email: string;
  phone: string;
  whatsapp?: string;
  availability: string;
  spotsLeft: number;
  cvUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  stats: {
    clients: number;
    projects: number;
    experience: number;
    satisfaction: number;
  };
}

export interface Settings {
  siteName?: string;
  siteUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgTitle?: string;
  seoOgDescription?: string;
  twitterHandle?: string;
  availability?: string;
  spotsLeft?: number;
  showProjects?: boolean;
  showStats?: boolean;
}

export interface Store {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  processSteps: ProcessStep[];
  stats: Stat[];
  messages: Message[];
  settings: Settings;
  activity: Activity[];
}

// ---------------------------------------------------------------------------
// Fake profile de secours (données actuelles du portfolio)
// ---------------------------------------------------------------------------

export function fakeProfile(): Profile {
  return {
    name: "Mikael Bohime",
    firstName: "Mikael",
    initials: "MB",
    role: "Développeur Logiciel",
    tagline: "Des solutions digitales premium qui génèrent des résultats.",
    bio: "Salut, je suis Mikael... Fort d'une année d'expérience, je crée des interfaces haut de gamme qui aident les entreprises à se démarquer, à gagner en compétitivité et à atteindre leurs objectifs financiers.",
    longBio:
      "Je suis un développeur full-stack spécialisé dans la création d'expériences digitales modernes, responsives et centrées sur l'utilisateur. Passionné par le code propre et les solutions élégantes, je transforme des problèmes complexes en applications simples, belles et intuitives. Du concept au déploiement, je travaille en étroite collaboration avec mes clients pour donner vie à leurs visions.",
    photo: "/images/profile.jpg",
    location: "Cotonou, Bénin",
    email: "mikaelbohime8@gmail.com",
    phone: "+229 01 92 73 52 05",
    whatsapp: "+2290192735205",
    availability: "Disponible pour de nouveaux projets",
    spotsLeft: 3,
    cvUrl: "/cv/mikael-bohime-cv.pdf",
    socialLinks: {
      github: "https://github.com/mikaelbohime",
      linkedin: "https://linkedin.com/in/mikaelbohime",
      twitter: "https://twitter.com/mikaelbohime",
      email: "mailto:mikaelbohime8@gmail.com",
    },
    stats: {
      clients: 5,
      projects: 5,
      experience: 1,
      satisfaction: 57,
    },
  };
}

// ---------------------------------------------------------------------------
// Chemin du fichier de stockage
// ---------------------------------------------------------------------------

function storagePath(): string {
  const base = process.env.ADMIN_DATA_PATH ?? "./data";
  const file = process.env.ADMIN_DATA_FILE ?? "portfolio.json";
  try {
    mkdirSync(base, { recursive: true });
  } catch {
    // ignore
  }
  return join(base, file);
}

// ---------------------------------------------------------------------------
// Store en mémoire avec lecture/écriture atomique
// ---------------------------------------------------------------------------

let cache: Store | null = null;
let cacheReady = false;

/**
 * Indique si le fichier de persistance data/portfolio.json existe.
 * Sert de signal pour savoir si l'admin a déjà initialisé ses données.
 */
export function storeFileExists(): boolean {
  try {
    return existsSync(storagePath());
  } catch {
    return false;
  }
}

/**
 * Retourne le store en mémoire. Rapide mais peut être stale après écriture.
 * Pour les APIs admin, utiliser {@link getStoreFresh} pour une lecture à jour.
 */
export function getStore(): Store {
  if (!cacheReady) {
    cache = readStoreFromFile();
    cacheReady = true;
  }
  return cache!;
}

/**
 * Retourne une copie fraîche du store depuis le fichier JSON.
 * À utiliser dans les routes Admin après modification pour éviter le cache stale.
 */
export function getStoreFresh(): Store {
  const store = readStoreFromFile();
  // Mettre à jour le cache pour les prochains appels
  cache = store;
  cacheReady = true;
  return store;
}

export async function seedFromExistingDataIfNeeded(): Promise<void> {
  const path = storagePath();
  if (existsSync(path)) {
    return;
  }
  const existing = readStoreFromFile();
  if (existing.profile.name || existing.projects.length || existing.skills.length) {
    return;
  }

  // Seed depuis les fichiers data existants (si présents)
  const profile = fakeProfile();
  const projects: Project[] = [];
  const skills: Skill[] = [];
  const processSteps: ProcessStep[] = [];
  const stats = [
    { id: "s1", label: "Clients satisfaits", value: 5, suffix: "+" },
    { id: "s2", label: "Projets réalisés", value: 5, suffix: "" },
    { id: "s3", label: "Années d'expérience", value: 1, suffix: "" },
    { id: "s4", label: "Taux de satisfaction", value: 57, suffix: "%" },
  ];

  const store: Store = {
    profile,
    projects,
    skills,
    processSteps,
    stats,
    messages: [],
    settings: {},
    activity: [],
  };

  writeStoreToFile(store);
}

function readStoreFromFile(): Store {
  const path = storagePath();
  try {
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as Store;
    if (parsed && typeof parsed === "object" && parsed.profile) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return {
    profile: fakeProfile(),
    projects: [],
    skills: [],
    processSteps: [],
    stats: [
      { id: "s1", label: "Clients satisfaits", value: 5, suffix: "+" },
      { id: "s2", label: "Projets réalisés", value: 5, suffix: "" },
      { id: "s3", label: "Années d'expérience", value: 1, suffix: "" },
      { id: "s4", label: "Taux de satisfaction", value: 57, suffix: "%" },
    ],
    messages: [],
    settings: {},
    activity: [],
  };
}

function writeStoreToFile(store: Store): void {
  const path = storagePath();
  writeFileSync(path, JSON.stringify(store, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Activité
// ---------------------------------------------------------------------------

export function addActivity(store: Store, type: string, description: string): void {
  const activity: Activity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    description,
    createdAt: new Date().toISOString(),
  };
  store.activity = [activity, ...store.activity].slice(0, 100);
  writeStoreToFile(store);
}

// ---------------------------------------------------------------------------
// Helpers pour les routes Admin
// ---------------------------------------------------------------------------

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export { writeStoreToFile };

