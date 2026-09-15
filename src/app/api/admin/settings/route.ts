import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStoreFresh, addActivity } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = getStoreFresh();
    return NextResponse.json({ settings: store.settings });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const data = body as Record<string, unknown>;

    const store = getStoreFresh();
    store.settings = { ...store.settings, ...data } as typeof store.settings;
    addActivity(store, "settings", "Paramètres mis à jour");
    return NextResponse.json({ settings: store.settings });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
