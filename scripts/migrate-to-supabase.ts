/**
 * Migration des données du store JSON local (data/portfolio.json) vers Supabase.
 *
 * Prérequis :
 *   1. Les variables SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *      sont définies dans .env (ou l'environnement).
 *   2. Le schéma supabase/schema.sql a été exécuté dans le SQL Editor Supabase.
 *
 * Idempotent : ré-exécuter ne duplique rien (upsert sur les IDs existants).
 *
 * Usage : npx tsx scripts/migrate-to-supabase.ts
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Chargement minimal de .env (pas de dépendance dotenv)
for (const line of readFileSync(".env", "utf-8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env"
  );
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Row = Record<string, unknown>;

function projectToRow(p: Row): Row {
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
    featured: p.featured ?? false,
    sort_order: p.order ?? 0,
  };
}

function messageToRow(m: Row): Row {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    status: m.status ?? "new",
    created_at: m.createdAt ?? new Date().toISOString(),
  };
}

function activityToRow(a: Row): Row {
  return {
    id: a.id,
    type: a.type,
    description: a.description,
    created_at: a.createdAt ?? new Date().toISOString(),
  };
}

async function upsert(
  table: string,
  rows: Row[],
  label: string
): Promise<void> {
  if (rows.length === 0) {
    console.log(`↷ ${label}: rien à migrer`);
    return;
  }
  const { error } = await sb.from(table).upsert(rows);
  if (error) {
    console.error(`❌ ${label}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${label}: ${rows.length} ligne(s)`);
  }
}

async function main() {
  console.log("📦 Lecture de data/portfolio.json…");
  const raw = readFileSync("data/portfolio.json", "utf-8");
  const store = JSON.parse(raw) as {
    profile: Row;
    settings: Row;
    projects: Row[];
    skills: Row[];
    processSteps: Row[];
    stats: Row[];
    messages: Row[];
    activity: Row[];
  };

  console.log("📦 Migration vers Supabase…");

  const { error: profileError } = await sb.from("profile").upsert({
    id: 1,
    data: store.profile,
  });
  if (profileError) {
    console.error("❌ profile:", profileError.message);
    process.exitCode = 1;
  } else {
    console.log(`✅ profile: 1 ligne (${store.profile.name ?? "?"})`);
  }

  const { error: settingsError } = await sb.from("settings").upsert({
    id: 1,
    data: store.settings ?? {},
  });
  if (settingsError) {
    console.error("❌ settings:", settingsError.message);
    process.exitCode = 1;
  } else {
    console.log(`✅ settings: ${Object.keys(store.settings ?? {}).length} clé(s)`);
  }

  await upsert("projects", (store.projects ?? []).map(projectToRow), "projects");
  await upsert("skills", store.skills ?? [], "skills");
  await upsert("process_steps", store.processSteps ?? [], "process_steps");
  await upsert("stats", store.stats ?? [], "stats");
  await upsert("messages", (store.messages ?? []).map(messageToRow), "messages");
  await upsert("activity", (store.activity ?? []).map(activityToRow), "activity");

  if (process.exitCode === 1) {
    console.error("❌ Migration terminée AVEC ERREURS — vérifie les messages ci-dessus.");
  } else {
    console.log("✅ Migration terminée avec succès.");
  }
}

main().catch((error) => {
  console.error("❌ Migration échouée :", error);
  process.exit(1);
});
