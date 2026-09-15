import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStoreFresh, addActivity, generateId, type Stat } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = getStoreFresh();
    return NextResponse.json({ stats: store.stats });
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
    const data = body as Partial<Stat>;

    if (!data.label || data.value == null) {
      return NextResponse.json(
        { error: "Label et valeur requis." },
        { status: 400 },
      );
    }

    const store = getStoreFresh();
    const stat: Stat = {
      id: generateId(),
      label: data.label.trim(),
      value: data.value,
      suffix: data.suffix ?? "",
    };
    store.stats = [...store.stats, stat];
    addActivity(store, "stat", `Statistique "${stat.label}" ajoutée`);
    return NextResponse.json({ stat }, { status: 201 });
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
    const { id, ...data } = body as { id?: string } & Partial<Stat>;

    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 });
    }

    const store = getStoreFresh();
    const idx = store.stats.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Statistique introuvable." }, { status: 404 });
    }
    store.stats[idx] = {
      ...store.stats[idx],
      label: data.label?.trim() ?? store.stats[idx].label,
      value: data.value != null ? data.value : store.stats[idx].value,
      suffix: data.suffix ?? store.stats[idx].suffix,
    };
    addActivity(store, "stat", `Statistique "${store.stats[idx].label}" modifiée`);
    return NextResponse.json({ stat: store.stats[idx] });
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
    const idx = store.stats.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Statistique introuvable." }, { status: 404 });
    }
    const label = store.stats[idx].label;
    store.stats = store.stats.filter((s) => s.id !== id);
    addActivity(store, "stat", `Statistique "${label}" supprimée`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
