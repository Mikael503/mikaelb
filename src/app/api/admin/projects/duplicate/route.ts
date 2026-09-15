import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getStoreFresh, addActivity, generateId, type Project } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({}));
    const { id } = body as { id?: string };
    if (!id) {
      return NextResponse.json(
        { error: "ID du projet à dupliquer requis." },
        { status: 400 },
      );
    }

    const store = getStoreFresh();
    const src = store.projects.find((p: Project) => p.id === id);
    if (!src) {
      return NextResponse.json(
        { error: "Projet introuvable." },
        { status: 404 },
      );
    }

    const duplicate: typeof src = {
      ...src,
      id: generateId(),
      title: `${src.title} (copie)`,
      slug: `${src.slug}-copy`,
      featured: false,
      order: store.projects.length + 1,
    };
    store.projects = [...store.projects, duplicate].sort(
      (a, b) => a.order - b.order,
    );
    addActivity(store, "project", `Projet "${duplicate.title}" dupliqué`);
    return NextResponse.json({ project: duplicate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
