import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import {
  getStoreFresh,
  saveStore,
  addActivity,
  type Profile,
} from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = await getStoreFresh();
    return NextResponse.json({ profile: store.profile });
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
    const data = body as Partial<Profile>;

    const store = await getStoreFresh();
    store.profile = { ...store.profile, ...data } as Profile;
    await addActivity("profile", "Profil mis à jour");
    await saveStore(store);
    return NextResponse.json({ profile: store.profile });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
