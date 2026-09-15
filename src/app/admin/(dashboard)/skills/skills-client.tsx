"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, Edit, Trash, GripVertical, BarChart3, Check, X } from "lucide-react";
import { MB } from "@/components/ui/icons";

interface Skill {
  id: string;
  name: string;
  percentage: number;
}

type ToastType = "success" | "error" | null;

export default function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: "", percentage: 50 });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    setForm({ name: editing?.name ?? "", percentage: editing?.percentage ?? 50 });
  }, [editing?.id]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm({ name: "", percentage: 50 });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name.trim()) {
        showToast("Le nom est requis.", "error");
        return;
      }
      setSaving(true);
      try {
        const payload = { ...form, name: form.name.trim() };
        if (editing) {
          const res = await fetch("/api/admin/skills", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { skill } = await res.json();
          setSkills((prev) => prev.map((s) => (s.id === skill.id ? skill : s)));
          showToast(`Compétence "${skill.name}" modifiée.`);
        } else {
          const res = await fetch("/api/admin/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { skill } = await res.json();
          setSkills((prev) => [...prev, skill].sort((a, b) => a.percentage - b.percentage));
          showToast(`Compétence "${skill.name}" ajoutée.`);
        }
        setEditing(null);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [form, editing, showToast],
  );

  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (!confirm(`Supprimer "${name}" ?`)) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur.", "error");
          return;
        }
        setSkills((prev) => prev.filter((s) => s.id !== id));
        showToast(`Compétence "${name}" supprimée.`);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [showToast],
  );

  const handlePercentageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, percentage: Math.min(100, Math.max(0, Number(e.target.value))) });
  }, [form]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar */}
      <aside className="admin-sidebar flex h-[calc(100vh-57px)] shrink-0 flex-col border-r border-[var(--admin-border)] bg-black/40 p-4">
        <div className="mb-6 flex items-center gap-2">
          <MB className="h-5 w-5 text-green-500" />
          <span className="text-white text-sm font-semibold">Mikael Bohime</span>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { href: "/admin", label: "Tableau de bord", icon: "🏠" },
            { href: "/admin/projects", label: "Projets", icon: "📁" },
            { href: "/admin/profile", label: "Profil", icon: "👤" },
            { href: "/admin/skills", label: "Compétences", icon: "⚡", active: true },
            { href: "/admin/process", label: "Processus", icon: "⚙" },
            { href: "/admin/stats", label: "Statistiques", icon: "📊" },
            { href: "/admin/messages", label: "Messages", icon: "✉" },
            { href: "/admin/settings", label: "Paramètres", icon: "⚙" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                item.href === "/admin/skills"
                  ? "bg-white/5 text-white font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto">
          <a
            href="/admin/login?logout=1"
            className="admin-sidebar-link flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex flex-1 flex-col px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold">Compétences</h1>
            <p className="mt-1 text-white/50">
              {skills.length} compétence{skills.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-white/8 border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="admin-card flex h-64 items-center justify-center text-center">
            <div>
              <BarChart3 className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/60 text-sm">Aucune compétence pour l'instant.</p>
              <p className="mt-1 text-white/40 text-xs">
                Cliquez sur "Ajouter" pour commencer.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <div className="space-y-3">
              {skills
                .slice()
                .sort((a, b) => b.percentage - a.percentage)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="admin-card group relative flex items-center gap-4 p-4 transition hover:border-white/10"
                  >
                    <button
                      onClick={() => setEditing(skill)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/30 transition hover:bg-white/5 hover:text-white/60 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">
                          {skill.name}
                        </span>
                        {editing?.id === skill.id ? (
                          <span className="text-[0.65rem] uppercase text-green-400">
                            Modifier
                          </span>
                        ) : null}
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-white/40">
                        <span>{skill.percentage}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => setEditing(skill)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modale édition/ajout */}
      {(editing || form.name !== "") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            setEditing(null);
            setForm({ name: "", percentage: 50 });
          }}
        >
          <div
            className="admin-card w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                {editing ? "Modifier la compétence" : "Nouvelle compétence"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", percentage: 50 });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="JavaScript / TypeScript"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Maîtrise (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.percentage}
                    onChange={handlePercentageChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-green-500"
                  />
                  <span className="shrink-0 text-center text-sm text-white/70">
                    {form.percentage}%
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.percentage}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(0, Number(e.target.value)));
                    setForm({ ...form, percentage: v });
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white text-center focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", percentage: 50 });
                  }}
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
                  {editing ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}
