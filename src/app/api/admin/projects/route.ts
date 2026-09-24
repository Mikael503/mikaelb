import { NextResponse } from "next/server";
import { getSessionFromRequest, getCookieFromRequest } from "@/lib/auth";
import {
  getStoreFresh,
  saveStore,
  addActivity,
  generateId,
  type Project,
} from "@/lib/data-store";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const store = await getStoreFresh();
    return NextResponse.json({ projects: store.projects });
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
    const data = body as Partial<Project>;

    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: "Titre et slug requis." },
        { status: 400 },
      );
    }

    const store = await getStoreFresh();
    const project: Project = {
      id: generateId(),
      title: data.title,
      slug: data.slug,
      category: data.category ?? "Autre",
      description: data.description ?? "",
      image: data.image ?? "",
      technologies: Array.isArray(data.technologies)
        ? data.technologies.map(String)
        : [],
      liveUrl: data.liveUrl ?? undefined,
      githubUrl: data.githubUrl ?? undefined,
      featured: !!data.featured,
      order: (data.order ?? store.projects.length) + 1,
    };
    store.projects = [...store.projects, project].sort(
      (a, b) => a.order - b.order,
    );
    await addActivity("project", `Projet "${project.title}" ajouté`);
    await saveStore(store);
    return NextResponse.json({ project }, { status: 201 });
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
    const { id, ...data } = body as { id?: string } & Partial<Project>;

    if (!id) {
      return NextResponse.json(
        { error: "ID du projet requis." },
        { status: 400 },
      );
    }

    const store = await getStoreFresh();
    const idx = store.projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Projet introuvable." },
        { status: 404 },
      );
    }
    store.projects[idx] = {
      ...store.projects[idx],
      ...data,
      id,
      technologies: Array.isArray(data.technologies)
        ? data.technologies.map(String)
        : store.projects[idx].technologies,
    };
    await addActivity("project", `Projet "${store.projects[idx].title}" modifié`);
    await saveStore(store);
    return NextResponse.json({
      project: store.projects[idx],
    });
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
      return NextResponse.json(
        { error: "ID du projet requis." },
        { status: 400 },
      );
    }

    const store = await getStoreFresh();
    const idx = store.projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Projet introuvable." },
        { status: 404 },
      );
    }
    const title = store.projects[idx].title;
    store.projects = store.projects.filter((p) => p.id !== id);
    await addActivity("project", `Projet "${title}" supprimé`);
    await saveStore(store);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
