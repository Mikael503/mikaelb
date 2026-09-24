import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import {
  getStoreFresh,
  saveStore,
  addActivity,
  type Message,
} from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = await getStoreFresh();
    return NextResponse.json({ messages: store.messages });
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
    const { id, status } = body as { id?: string; status?: Message["status"] };

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID et statut requis." },
        { status: 400 },
      );
    }

    const store = await getStoreFresh();
    const idx = store.messages.findIndex((m) => m.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
    }
    store.messages[idx] = { ...store.messages[idx], status };
    const label =
      status === "read"
        ? "lu"
        : status === "replied"
        ? "répondu"
        : status === "archived"
        ? "archivé"
        : "nouveau";
    await addActivity("message", `Message "${store.messages[idx].subject}" marqué comme ${label}`);
    await saveStore(store);
    return NextResponse.json({ message: store.messages[idx] });
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

    const store = await getStoreFresh();
    const idx = store.messages.findIndex((m) => m.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
    }
    const subject = store.messages[idx].subject;
    store.messages = store.messages.filter((m) => m.id !== id);
    await addActivity("message", `Message "${subject}" supprimé`);
    await saveStore(store);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
