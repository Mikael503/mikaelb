/**
 * Initialise le stockage du portfolio :
 * - Crée data/portfolio.json s'il n'existe pas (mode fallback / dev local).
 * - Si Supabase est configuré et vide, y migre les données du JSON local.
 *
 * Usage : npm run admin:seed
 */

import { seedFromExistingDataIfNeeded, currentBackend } from "@/lib/data-store";

await seedFromExistingDataIfNeeded();

if (currentBackend() === "supabase") {
  console.log("✅ Données Admin initialisées (Supabase actif, JSON local conservé en fallback)");
} else {
  console.log("✅ Données Admin initialisées dans data/portfolio.json");
}
