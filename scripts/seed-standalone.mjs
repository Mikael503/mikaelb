import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = process.env.ADMIN_DATA_PATH ?? join(__dirname, "..", "data");
const file = process.env.ADMIN_DATA_FILE ?? "portfolio.json";
const storagePath = join(base, file);

try {
  mkdirSync(base, { recursive: true });
} catch {}

function readJsonFileSync(path) {
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStore(store) {
  writeFileSync(storagePath, JSON.stringify(store, null, 2), "utf-8");
  console.log("✅ Écriture réussie :", storagePath);
}

// Lire les fichiers data existants (format TypeScript, donc on les parse manuellement)
function loadProjects() {
  const p = join(__dirname, "..", "src", "data", "projects.ts");
  if (!existsSync(p)) return [];
  try {
    const raw = readFileSync(p, "utf-8");
    // Extraction simple du tableau avec regex
    const match = raw.match(/export\s+const\s+projects\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
    if (!match) return [];
    // Évaluation sécurisée via Function (accepté ici pour du seed local)
    const arr = new Function("return " + match[1])();
    return arr.map((p, i) => ({ ...p, id: p.id || `proj-${Date.now()}-${i}`, technologies: p.technologies || [] }));
  } catch {
    return [];
  }
}

function loadSkills() {
  const p2 = join(__dirname, "..", "src", "data", "skills.ts");
  if (!existsSync(p2)) return [];
  try {
    const raw = readFileSync(p2, "utf-8");
    const match = raw.match(/export\s+const\s+skills\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
    if (!match) return [];
    const arr = new Function("return " + match[1])();
    return arr.map((s, i) => ({ ...s, id: s.id || `skill-${Date.now()}-${i}` }));
  } catch {
    return [];
  }
}

function loadProcess() {
  const p3 = join(__dirname, "..", "src", "data", "process.ts");
  if (!existsSync(p3)) return [];
  try {
    const raw = readFileSync(p3, "utf-8");
    const match = raw.match(/export\s+const\s+processSteps\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
    if (!match) return [];
    const arr = new Function("return " + match[1])();
    return arr.map((s, i) => ({ ...s, id: s.id || `step-${Date.now()}-${i}` }));
  } catch {
    return [];
  }
}

// Profil de secours
const fakeProfile = {
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
  stats: { clients: 20, projects: 20, experience: 4, satisfaction: 99 },
  floatingStats: [
    { label: "4+ ans d'expérience", value: "4+", icon: "Zap" },
    { label: "20+ projets réalisés", value: "20+", icon: "FolderOpen" },
    { label: "99% de satisfaction", value: "99%", icon: "Star" },
  ],
  clients: ["Entreprise A", "Startup B", "Agence C"],
};

const existing = readJsonFileSync(storagePath);
if (existing && existing.profile?.name) {
  console.log("✅ Données déjà présentes, rien à faire.");
  process.exit(0);
}

const projects = loadProjects();
const skills = loadSkills();
const processSteps = loadProcess();

if (!projects.length && !skills.length && !processSteps.length) {
  console.log("⚠️ Aucune donnée trouvée dans les fichiers src/data/, utilisation du profil par défaut.");
}

const store = {
  profile: fakeProfile,
  projects,
  skills,
  processSteps,
  stats: [
    { id: "stat-1", label: "Clients satisfaits", value: 20, suffix: "+" },
    { id: "stat-2", label: "Projets réalisés", value: 20, suffix: "+" },
    { id: "stat-3", label: "Années d'expérience", value: 4, suffix: "+" },
    { id: "stat-4", label: "Taux de satisfaction", value: 99, suffix: "%" },
  ],
  messages: [],
  settings: {},
  activity: [],
};

writeStore(store);
console.log("✅ Données Admin initialisées dans", storagePath);
