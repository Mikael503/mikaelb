import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStoreFresh, addActivity, generateId, type Skill } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = getStoreFresh();
    return NextResponse.json({ skills: store.skills });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const data = body as Partial<Skill>;

    if (!data.name) {
      return NextResponse.json(
        { error: "Nom de la compétence requis." },
        { status: 400 },
      );
    }

    const store = getStoreFresh();
    const skill: Skill = {
      id: generateId(),
      name: data.name.trim(),
      percentage: Math.min(100, Math.max(0, data.percentage ?? 50)),
    };
    store.skills = [...store.skills, skill].sort((a, b) => a.percentage - b.percentage);
    addActivity(store, "skill", `Compétence "${skill.name}" ajoutée`);
    return NextResponse.json({ skill }, { status: 201 });
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
    const { id, ...data } = body as { id?: string } & Partial<Skill>;

    if (!id) {
      return NextResponse.json(
        { error: "ID requis." },
        { status: 400 },
      );
    }

    const store = getStoreFresh();
    const idx = store.skills.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Compétence introuvable." }, { status: 404 });
    }
    store.skills[idx] = {
      ...store.skills[idx],
      name: data.name?.trim() ?? store.skills[idx].name,
      percentage: data.percentage != null
        ? Math.min(100, Math.max(0, data.percentage))
        : store.skills[idx].percentage,
    };
    addActivity(store, "skill", `Compétence "${store.skills[idx].name}" modifiée`);
    return NextResponse.json({ skill: store.skills[idx] });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 });
    }

    const store = getStoreFresh();
    const idx = store.skills.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Compétence introuvable." }, { status: 404 });
    }
    const name = store.skills[idx].name;
    store.skills = store.skills.filter((s) => s.id !== id);
    addActivity(store, "skill", `Compétence "${name}" supprimée`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
