"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash,
  Copy,
  Check,
  X,
  FolderOpen,
  Star,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

type ModalMode = "create" | "edit" | null;
type ToastType = "success" | "error" | null;

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Web App",
    description: "",
    image: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const resetForm = useCallback(
    (project?: Project) => {
      setForm({
        title: project?.title ?? "",
        slug: project?.slug ?? "",
        category: project?.category ?? "Autre",
        description: project?.description ?? "",
        image: project?.image ?? "",
        technologies: project?.technologies.join(", ") ?? "",
        liveUrl: project?.liveUrl ?? "",
        githubUrl: project?.githubUrl ?? "",
        featured: project?.featured ?? false,
        order: project?.order ?? projects.length + 1,
      });
      setEditing(project ?? null);
    },
    [projects.length, editing],
  );

  const openCreate = useCallback(() => {
    resetForm();
    setModal("create");
  }, [resetForm]);

  const openEdit = useCallback((p: Project) => {
    resetForm(p);
    setModal("edit");
  }, [resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        const techs = form.technologies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const payload = {
          ...form,
          technologies: techs,
        };
        if (editing) {
          const res = await fetch("/api/admin/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur lors de la modification.", "error");
            return;
          }
          const { project } = await res.json();
          setProjects((prev) =>
            prev.map((p) => (p.id === project.id ? project : p)),
          );
          showToast(`Projet "${project.title}" modifié.`);
        } else {
          const res = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur lors de la création.", "error");
            return;
          }
          const { project } = await res.json();
          setProjects((prev) => [...prev, project].sort((a, b) => a.order - b.order));
          showToast(`Projet "${project.title}" créé.`);
        }
        setModal(null);
        setEditing(null);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [form, editing, projects, showToast],
  );

  const handleDelete = useCallback(
    async () => {
      if (!deleteTarget) return;
      setSaving(true);
      try {
        const res = await fetch(
          `/api/admin/projects?id=${deleteTarget.id}`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur lors de la suppression.", "error");
          setSaving(false);
          return;
        }
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast(`Projet "${deleteTarget.title}" supprimé.`);
        setDeleteTarget(null);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [deleteTarget, showToast],
  );

  const handleDuplicate = useCallback(
    async (p: Project) => {
      try {
        const res = await fetch("/api/admin/projects/duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: p.id }),
        });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur lors de la duplication.", "error");
          return;
        }
        const { project } = await res.json();
        setProjects((prev) => [...prev, project].sort((a, b) => a.order - b.order));
        showToast(`Projet "${project.title}" dupliqué.`);
      } catch {
        showToast("Erreur réseau.", "error");
      }
    },
    [showToast],
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Projets</h1>
          <p className="mt-1 text-white/50">
            {projects.length} projet{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-white/8 border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un projet
        </button>
      </div>

        {projects.length === 0 ? (
          <div className="admin-card flex h-64 items-center justify-center text-center">
            <div>
              <FolderOpen className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/60 text-sm">Aucun projet pour l'instant.</p>
              <p className="mt-1 text-white/40 text-xs">
                Cliquez sur "Ajouter un projet" pour commencer.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="admin-card group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] uppercase text-white/40">
                      {p.category}
                    </span>
                    {p.featured && (
                      <Star className="h-3 w-3 text-green-500 fill-green-500/20" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                      title="Dupliquer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                      title="Modifier"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Supprimer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white text-base font-medium">{p.title}</h3>
                <p className="mt-1 text-white/50 text-sm line-clamp-2">
                  {p.description}
                </p>
                {p.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-white/5 px-2 py-0.5 text-[0.7rem] text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-3 text-[0.7rem] text-white/40">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Live
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white/60"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Modale création/édition */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="admin-card w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                {editing ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Titre
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Mon Projet"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="mon-projet"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    Catégorie
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  >
                    {["Web App", "Mobile", "Design", "API", "Autre"].map(
                      (c) => (
                        <option key={c} value={c} className="text-black">
                          {c}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    Ordre
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description du projet..."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    Image (URL)
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    Technologies (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={(e) =>
                      setForm({ ...form, technologies: e.target.value })
                    }
                    placeholder="React, Next.js, TypeScript"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    URL Live
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) =>
                      setForm({ ...form, liveUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">
                    URL GitHub
                  </label>
                  <input
                    type="url"
                    value={form.githubUrl}
                    onChange={(e) =>
                      setForm({ ...form, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-green-500 focus:ring-green-500/40"
                />
                <span className="text-white text-sm">
                  <Star className="inline h-4 w-4 text-green-500 mr-1" />
                  Projet en vedette
                </span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg px-4 py-2 text-sm text-white/60 transition hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-green-600/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {editing ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de confirmation suppression */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="admin-card w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-semibold">
              Supprimer ce projet ?
            </h3>
            <p className="mt-2 text-white/60 text-sm">
              Cette action est irréversible. Le projet{" "}
              <span className="text-white font-medium">
                "{deleteTarget.title}"
              </span>{" "}
              sera définitivement supprimé.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg px-4 py-2 text-sm text-white/60 transition hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition ${
            toast.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
