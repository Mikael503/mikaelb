import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

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
// Chemin du fichier de stockage (mode fallback)
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

// ---------------------------------------------------------------------------
// Mode de stockage : Supabase si configuré, sinon JSON local
// ---------------------------------------------------------------------------

/** Backend actif pour les opérations du store. */
export type StoreBackend = "supabase" | "json";

/** Backend réellement utilisé pour la dernière opération (utile au debug). */
export function currentBackend(): StoreBackend {
  return isSupabaseConfigured() ? "supabase" : "json";
}

// ---------------------------------------------------------------------------
// Store JSON local (fallback) — lecture/écriture atomique
// ---------------------------------------------------------------------------

let jsonCache: Store | null = null;
let jsonCacheReady = false;

function defaultStore(): Store {
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
  return defaultStore();
}

function writeStoreToFile(store: Store): void {
  const path = storagePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(store, null, 2), "utf-8");
}

/** Retourne le store JSON local (sans toucher à Supabase). */
export function getJsonStore(): Store {
  if (!jsonCacheReady) {
    jsonCache = readStoreFromFile();
    jsonCacheReady = true;
  }
  return jsonCache!;
}

/** Écrit le store JSON local (sans toucher à Supabase). */
export function writeJsonStore(store: Store): void {
  writeStoreToFile(store);
  jsonCache = store;
  jsonCacheReady = true;
}

/**
 * Indique si le store JSON local contient des données réelles (non vides).
 * Utilisé par le script de migration JSON → Supabase.
 */
export function jsonStoreHasData(): boolean {
  const store = getJsonStore();
  return Boolean(
    store.projects.length ||
      store.skills.length ||
      store.processSteps.length ||
      store.messages.length ||
      store.activity.length ||
      (store.profile.name && store.profile.name !== fakeProfile().name),
  );
}

// ---------------------------------------------------------------------------
// Couche Supabase — mapping lignes <-> types du store
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function rowToProject(r: Row): Project {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category ?? "Autre",
    description: r.description ?? "",
    image: r.image ?? "",
    technologies: Array.isArray(r.technologies) ? r.technologies : [],
    liveUrl: r.live_url ?? undefined,
    githubUrl: r.github_url ?? undefined,
    featured: r.featured ?? false,
    order: r.sort_order ?? 0,
  };
}

function projectToRow(p: Project): Row {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    description: p.description,
    image: p.image,
    technologies: p.technologies,
    live_url: p.liveUrl ?? null,
    github_url: p.githubUrl ?? null,
    featured: p.featured,
    sort_order: p.order,
  };
}

function rowToSkill(r: Row): Skill {
  return { id: r.id, name: r.name, percentage: r.percentage ?? 50 };
}

function skillToRow(s: Skill): Row {
  return { id: s.id, name: s.name, percentage: s.percentage };
}

function rowToProcessStep(r: Row): ProcessStep {
  return {
    id: r.id,
    number: r.number ?? "",
    title: r.title,
    description: r.description ?? "",
    icon: r.icon ?? "ChevronRight",
  };
}

function processStepToRow(s: ProcessStep): Row {
  return { id: s.id, number: s.number, title: s.title, description: s.description, icon: s.icon };
}

function rowToStat(r: Row): Stat {
  return { id: r.id, label: r.label, value: r.value ?? 0, suffix: r.suffix ?? "" };
}

function statToRow(s: Stat): Row {
  return { id: s.id, label: s.label, value: s.value, suffix: s.suffix };
}

function rowToMessage(r: Row): Message {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status ?? "new",
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}

function messageToRow(m: Message): Row {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    status: m.status,
    created_at: m.createdAt,
  };
}

function rowToActivity(r: Row): Activity {
  return {
    id: r.id,
    type: r.type ?? "unknown",
    description: r.description ?? "",
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}

function activityToRow(a: Activity): Row {
  return { id: a.id, type: a.type, description: a.description, created_at: a.createdAt };
}

function rowToProfile(r: Row): Profile {
  return {
    ...fakeProfile(),
    ...r.data,
  } as Profile;
}

function profileToRow(p: Profile): Row {
  return { id: 1, data: p };
}

// ---------------------------------------------------------------------------
// Erreur backend
// ---------------------------------------------------------------------------

export class StoreError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "StoreError";
  }
}

// ---------------------------------------------------------------------------
// Store async Supabase-first avec fallback JSON
// ---------------------------------------------------------------------------

/**
 * Retourne le store complet. Sur Supabase si configuré, sinon depuis le
 * fichier JSON local. En cas d'échec Supabase, bascule sur le JSON.
 */
export async function getStore(): Promise<Store> {
  if (!isSupabaseConfigured()) {
    return getJsonStore();
  }
  try {
    const sb = getSupabaseAdmin();
    const [projects, skills, processSteps, stats, messages, activity, profileRows, settingsRows] =
      await Promise.all([
        sb.from("projects").select("*").order("sort_order", { ascending: true }),
        sb.from("skills").select("*").order("percentage", { ascending: true }),
        sb.from("process_steps").select("*").order("number", { ascending: true }),
        sb.from("stats").select("*"),
        sb.from("messages").select("*").order("created_at", { ascending: false }),
        sb.from("activity").select("*").order("created_at", { ascending: false }).limit(100),
        sb.from("profile").select("*").eq("id", 1).maybeSingle(),
        sb.from("settings").select("*").eq("id", 1).maybeSingle(),
      ]);

    const firstError = [projects, skills, processSteps, stats, messages, activity, profileRows, settingsRows].find(
      (r) => r.error,
    )?.error;
    if (firstError) {
      throw new StoreError("Lecture Supabase échouée", firstError);
    }

    const fallback = getJsonStore();
    return {
      profile: (profileRows.data ? rowToProfile(profileRows.data) : fallback.profile) as Profile,
      projects: (projects.data ?? []).map(rowToProject),
      skills: (skills.data ?? []).map(rowToSkill),
      processSteps: (processSteps.data ?? []).map(rowToProcessStep),
      stats: (stats.data ?? []).map(rowToStat),
      messages: (messages.data ?? []).map(rowToMessage),
      settings: (settingsRows.data?.data as Settings) ?? fallback.settings,
      activity: (activity.data ?? []).map(rowToActivity),
    };
  } catch (error) {
    console.error("[data-store] Lecture Supabase impossible, fallback JSON :", error);
    return getJsonStore();
  }
}

/** Version fraîche du store (alias de getStore — Supabase n'a pas de cache). */
export async function getStoreFresh(): Promise<Store> {
  return getStore();
}

/**
 * Persist le store complet. Sur Supabase : remplace le contenu des tables.
 * Sur JSON : écrit le fichier local. En cas d'échec Supabase, écrit le JSON.
 */
export async function saveStore(store: Store): Promise<void> {
  if (!isSupabaseConfigured()) {
    writeJsonStore(store);
    return;
  }
  try {
    const sb = getSupabaseAdmin();

    const [profileRes, settingsRes, projectsRes, skillsRes, processRes, statsRes, messagesRes, activityRes] =
      await Promise.all([
        sb.from("profile").upsert(profileToRow(store.profile)),
        sb.from("settings").upsert({ id: 1, data: store.settings }),
        sb.from("projects").upsert(store.projects.map(projectToRow)),
        sb.from("skills").upsert(store.skills.map(skillToRow)),
        sb.from("process_steps").upsert(store.processSteps.map(processStepToRow)),
        sb.from("stats").upsert(store.stats.map(statToRow)),
        sb.from("messages").upsert(store.messages.map(messageToRow)),
        sb.from("activity").upsert(store.activity.map(activityToRow)),
      ]);

    const firstError = [profileRes, settingsRes, projectsRes, skillsRes, processRes, statsRes, messagesRes, activityRes].find(
      (r) => r.error,
    )?.error;
    if (firstError) {
      throw new StoreError("Écriture Supabase échouée", firstError);
    }

    // Suppression des lignes disparues (remplacement complet)
    const tables: Array<"projects" | "skills" | "process_steps" | "stats" | "messages" | "activity"> = [
      "projects",
      "skills",
      "process_steps",
      "stats",
      "messages",
      "activity",
    ];
    const keepIds: Record<string, Set<string>> = {
      projects: new Set(store.projects.map((p) => p.id)),
      skills: new Set(store.skills.map((s) => s.id)),
      process_steps: new Set(store.processSteps.map((s) => s.id)),
      stats: new Set(store.stats.map((s) => s.id)),
      messages: new Set(store.messages.map((m) => m.id)),
      activity: new Set(store.activity.map((a) => a.id)),
    };
    await Promise.all(
      tables.map(async (table) => {
        const { data } = await sb.from(table).select("id");
        const ids = (data ?? []).map((r: Row) => r.id as string).filter((id) => !keepIds[table].has(id));
        if (ids.length) await sb.from(table).delete().in("id", ids);
      }),
    );
  } catch (error) {
    console.error("[data-store] Écriture Supabase impossible, fallback JSON :", error);
    writeJsonStore(store);
  }
}

// ---------------------------------------------------------------------------
// Opérations ciblées (utilisées par les routes admin)
// ---------------------------------------------------------------------------

export async function addActivity(type: string, description: string): Promise<void> {
  const activity: Activity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    description,
    createdAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    try {
      const { error } = await getSupabaseAdmin().from("activity").insert(activityToRow(activity));
      if (!error) return;
      console.error("[data-store] insert activité Supabase échouée, fallback JSON :", error);
    } catch (error) {
      console.error("[data-store] insert activité Supabase échouée, fallback JSON :", error);
    }
  }
  const store = getJsonStore();
  store.activity = [activity, ...store.activity].slice(0, 100);
  writeJsonStore(store);
}

/** Génère un identifiant unique. */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Seed initial (script npm:admin:seed)
// ---------------------------------------------------------------------------

/**
 * Initialise le stockage :
 * - Crée data/portfolio.json s'il n'existe pas (mode fallback / local dev).
 * - Si Supabase est configuré et que la table profile est vide, y pousse les
 *   données du JSON local (migration initiale).
 */
export async function seedFromExistingDataIfNeeded(): Promise<void> {
  if (!existsSync(storagePath())) {
    writeJsonStore(defaultStore());
  }

  if (!isSupabaseConfigured()) return;

  try {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.from("profile").select("id").eq("id", 1).maybeSingle();
    if (error) throw error;
    if (data) return; // déjà seedé

    const local = getJsonStore();
    await saveStore(local);
    console.log("✅ Données migrées vers Supabase depuis data/portfolio.json");
  } catch (error) {
    console.error("Seed Supabase impossible (le JSON local reste la source) :", error);
  }
}
