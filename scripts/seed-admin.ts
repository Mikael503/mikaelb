import { seedFromExistingDataIfNeeded } from "@/lib/data-store";

await seedFromExistingDataIfNeeded();
console.log("✅ Données Admin initialisées dans data/portfolio.json");
