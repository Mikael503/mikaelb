import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStoreFresh, addActivity, generateId, type ProcessStep } from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = getStoreFresh();
    return NextResponse.json({ processSteps: store.processSteps });
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
    const data = body as Partial<ProcessStep>;

    if (!data.title || !data.number) {
      return NextResponse.json(
        { error: "Titre et numéro requis." },
        { status: 400 },
      );
    }

    const store = getStoreFresh();
    const step: ProcessStep = {
      id: generateId(),
      number: data.number,
      title: data.title.trim(),
      description: data.description ?? "",
      icon: data.icon ?? "ChevronRight",
    };
    store.processSteps = [...store.processSteps, step].sort(
      (a, b) => Number(a.number) - Number(b.number),
    );
    addActivity(store, "process", `Étape "${step.title}" ajoutée`);
    return NextResponse.json({ step }, { status: 201 });
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
    const { id, ...data } = body as { id?: string } & Partial<ProcessStep>;

    if (!id) {
      return NextResponse.json({ error: "ID requis." }, { status: 400 });
    }

    const store = getStoreFresh();
    const idx = store.processSteps.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Étape introuvable." }, { status: 404 });
    }
    store.processSteps[idx] = {
      ...store.processSteps[idx],
      number: data.number ?? store.processSteps[idx].number,
      title: data.title?.trim() ?? store.processSteps[idx].title,
      description: data.description ?? store.processSteps[idx].description,
      icon: data.icon ?? store.processSteps[idx].icon,
    };
    addActivity(store, "process", `Étape "${store.processSteps[idx].title}" modifiée`);
    return NextResponse.json({ step: store.processSteps[idx] });
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
    const idx = store.processSteps.findIndex((s) => s.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Étape introuvable." }, { status: 404 });
    }
    const title = store.processSteps[idx].title;
    store.processSteps = store.processSteps.filter((s) => s.id !== id);
    addActivity(store, "process", `Étape "${title}" supprimée`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
