"use client";

import { useState, useCallback } from "react";
import { Plus, Edit, Trash, Check, X, BarChart3, TrendingUp } from "lucide-react";

interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

type ToastType = "success" | "error" | null;

export default function StatsClient({ initialStats }: { initialStats: Stat[] }) {
  const [stats, setStats] = useState(initialStats);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState({ label: "", value: 20, suffix: "+" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetForm = useCallback((stat?: Stat) => {
    setForm({
      label: stat?.label ?? "",
      value: stat?.value ?? 20,
      suffix: stat?.suffix ?? "+",
    });
    setEditing(stat ?? null);
  }, []);

  const openCreate = useCallback(() => {
    resetForm();
    setEditing(null);
  }, [resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.label.trim() || form.value == null) {
        showToast("Label et valeur requis.", "error");
        return;
      }
      setSaving(true);
      try {
        const payload = {
          ...form,
          label: form.label.trim(),
        };
        if (editing) {
          const res = await fetch("/api/admin/stats", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { stat } = await res.json();
          setStats((prev) => prev.map((s) => (s.id === stat.id ? stat : s)));
          showToast(`Statistique "${stat.label}" modifiée.`);
        } else {
          const res = await fetch("/api/admin/stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { stat } = await res.json();
          setStats((prev) => [...prev, stat]);
          showToast(`Statistique "${stat.label}" ajoutée.`);
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
    async (id: string, label: string) => {
      if (!confirm(`Supprimer "${label}" ?`)) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/stats?id=${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur.", "error");
          return;
        }
        setStats((prev) => prev.filter((s) => s.id !== id));
        showToast(`Statistique "${label}" supprimée.`);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [showToast],
  );

  return (
    <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold">Statistiques</h1>
            <p className="mt-1 text-white/50">
              {stats.length} statistique{stats.length !== 1 ? "s" : ""}
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

        {/* Preview des cartes */}
        {stats.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.id}
                className="admin-card p-5 border-green-500/20 shadow-[0_0_0_1px_rgba(124,182,138,0.06)]"
              >
                <p className="text-white/50 text-sm">{s.label}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-green-500">
                    {s.value}
                  </span>
                  {s.suffix ? (
                    <span className="text-white/60 text-sm">{s.suffix}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {stats.length === 0 ? (
          <div className="admin-card flex h-64 items-center justify-center text-center">
            <div>
              <BarChart3 className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/60 text-sm">Aucune statistique pour l'instant.</p>
              <p className="mt-1 text-white/40 text-xs">
                Cliquez sur "Ajouter" pour commencer.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <div className="space-y-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="admin-card group flex items-center justify-between gap-4 p-4 transition hover:border-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TrendingUp className="h-5 w-5 shrink-0 text-green-500" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{stat.label}</p>
                      <p className="text-white/40 text-xs">
                        {stat.value}
                        {stat.suffix ? ` ${stat.suffix}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => resetForm(stat)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id, stat.label)}
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

      {/* Modale */}
      {(editing || form.label !== "") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            setEditing(null);
            setForm({ label: "", value: 20, suffix: "+" });
          }}
        >
          <div
            className="admin-card w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                {editing ? "Modifier la statistique" : "Nouvelle statistique"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ label: "", value: 20, suffix: "+" });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Clients satisfaits"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Valeur</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Suffixe</label>
                  <input
                    type="text"
                    value={form.suffix}
                    onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                    placeholder="+"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ label: "", value: 20, suffix: "+" });
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
    </>
  );
}
