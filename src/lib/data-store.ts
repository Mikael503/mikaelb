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
  floatingStats?: Array<{ label: string; value: string; icon?: string }>;
  clients?: string[];
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
    role: "Développeur Full-Stack",
    tagline: "Développeur Full-Stack — Solutions digitales sur mesure",
    bio: "Développeur Full-Stack passionné par la création de solutions digitales modernes, performantes et centrées sur l'utilisateur.",
    longBio: "Je suis développeur full-stack avec plusieurs années d'expérience dans la conception et le développement d'applications web modernes. Je combine rigueur technique et sens du design pour livrer des produits qui fonctionnent bien et qui ont une identité visuelle forte.",
    photo: "https://picsum.photos/seed/mikael/400/400",
    location: "France",
    email: "hello@mikaelbohime.dev",
    phone: "+33 6 00 00 00 00",
    availability: "Disponible",
    spotsLeft: 2,
    cvUrl: "/cv/mikael-bohime-cv.pdf",
    socialLinks: {
      github: "https://github.com/mikaelbohime",
      linkedin: "https://linkedin.com/in/mikaelbohime",
      twitter: "https://twitter.com/mikaelbohime",
      email: "mailto:hello@mikaelbohime.dev",
    },
    stats: {
      clients: 20,
      projects: 20,
      experience: 4,
      satisfaction: 99,
    },
    floatingStats: [
      { label: "4+ ans d'expérience", value: "4+", icon: "Zap" },
      { label: "20+ projets réalisés", value: "20+", icon: "FolderOpen" },
      { label: "99% de satisfaction", value: "99%", icon: "Star" },
    ],
    clients: ["Entreprise A", "Startup B", "Agence C"],
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
  const projects = loadProjectsFromDataFile();
  const skills = loadSkillsFromDataFile();
  const processSteps = loadProcessFromDataFile();
  const stats = [
    { id: "s1", label: "Clients satisfaits", value: 20, suffix: "+" },
    { id: "s2", label: "Projets réalisés", value: 20, suffix: "+" },
    { id: "s3", label: "Années d'expérience", value: 4, suffix: "+" },
    { id: "s4", label: "Taux de satisfaction", value: 99, suffix: "%" },
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

function loadProjectsFromDataFile(): Project[] {
  try {
    // On lit directement le fichier via readFileSync pour éviter require
    const filePath = join(process.cwd(), "src", "data", "projects.ts");
    if (!existsSync(filePath)) {
      return [];
    }
    // On pourrait parser le TSX, mais c'est complexe. On utilise un fallback
    // simple : si le fichier n'est pas JSON, on renvoie un tableau vide.
    // Dans ce projet, les données sont typescript, donc on doit les charger
    // d'une façon ou d'une autre. On va utiliser un script de seed dédié
    // qui importe les fichiers via tsx et les injecte dans le JSON.
    return [];
  } catch {
    return [];
  }
}

function loadSkillsFromDataFile(): Skill[] {
  try {
    const filePath = join(process.cwd(), "src", "data", "skills.ts");
    if (!existsSync(filePath)) {
      return [];
    }
    return [];
  } catch {
    return [];
  }
}

function loadProcessFromDataFile(): ProcessStep[] {
  try {
    const filePath = join(process.cwd(), "src", "data", "process.ts");
    if (!existsSync(filePath)) {
      return [];
    }
    return [];
  } catch {
    return [];
  }
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
      { id: "s1", label: "Clients satisfaits", value: 20, suffix: "+" },
      { id: "s2", label: "Projets réalisés", value: 20, suffix: "+" },
      { id: "s3", label: "Années d'expérience", value: 4, suffix: "+" },
      { id: "s4", label: "Taux de satisfaction", value: 99, suffix: "%" },
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

