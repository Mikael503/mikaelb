"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash,
  GripVertical,
  Check,
  X,
  Cpu,
  Scissors,
  Palette,
  Code,
  Bug,
  Rocket,
  ChevronRight,
  Settings,
  Layout,
  Zap,
  Sparkles,
} from "lucide-react";

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

const ICON_LIST = [
  { name: "ChevronRight", icon: ChevronRight, label: "Flèche" },
  { name: "Cpu", icon: Cpu, label: "Processeur" },
  { name: "Scissors", icon: Scissors, label: "Ciseaux" },
  { name: "Palette", icon: Palette, label: "Palette" },
  { name: "Code", icon: Code, label: "Code" },
  { name: "Bug", icon: Bug, label: "Bug" },
  { name: "Rocket", icon: Rocket, label: "Rocket" },
  { name: "Settings", icon: Settings, label: "Réglages" },
  { name: "Layout", icon: Layout, label: "Layout" },
  { name: "Zap", icon: Zap, label: "Éclair" },
  { name: "Sparkles", icon: Sparkles, label: "Étoiles" },
];

type ToastType = "success" | "error" | null;

export default function ProcessClient({ initialSteps }: { initialSteps: ProcessStep[] }) {
  const [steps, setSteps] = useState(initialSteps);
  const [editing, setEditing] = useState<ProcessStep | null>(null);
  const [form, setForm] = useState({ number: "01", title: "", description: "", icon: "ChevronRight" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetForm = useCallback((step?: ProcessStep) => {
    setForm({
      number: step?.number ?? String(steps.length + 1).padStart(2, "0"),
      title: step?.title ?? "",
      description: step?.description ?? "",
      icon: step?.icon ?? "ChevronRight",
    });
    setEditing(step ?? null);
  }, [steps.length]);

  const openCreate = useCallback(() => {
    resetForm();
    setEditing(null);
  }, [resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.title.trim() || !form.number) {
        showToast("Titre et numéro requis.", "error");
        return;
      }
      setSaving(true);
      try {
        const payload = {
          ...form,
          title: form.title.trim(),
        };
        if (editing) {
          const res = await fetch("/api/admin/process", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editing.id, ...payload }),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { step } = await res.json();
          setSteps((prev) => prev.map((s) => (s.id === step.id ? step : s)));
          showToast(`Étape "${step.title}" modifiée.`);
        } else {
          const res = await fetch("/api/admin/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json();
            showToast(data.error ?? "Erreur.", "error");
            return;
          }
          const { step } = await res.json();
          setSteps((prev) => [...prev, step].sort((a, b) => Number(a.number) - Number(b.number)));
          showToast(`Étape "${step.title}" ajoutée.`);
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
    async (id: string, title: string) => {
      if (!confirm(`Supprimer "${title}" ?`)) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/process?id=${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur.", "error");
          return;
        }
        setSteps((prev) => prev.filter((s) => s.id !== id));
        showToast(`Étape "${title}" supprimée.`);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [showToast],
  );

  const renderIcon = (iconName: string) => {
    const found = ICON_LIST.find((i) => i.name === iconName);
    if (!found) return null;
    const Comp = found.icon;
    return <Comp className="h-5 w-5 text-white/80" />;
  };

  return (
    <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold">Processus</h1>
            <p className="mt-1 text-white/50">
              {steps.length} étape{steps.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-white/8 border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/12 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Ajouter une étape
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="admin-card flex h-64 items-center justify-center text-center">
            <div>
              <Cpu className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/60 text-sm">Aucune étape pour l'instant.</p>
              <p className="mt-1 text-white/40 text-xs">
                Cliquez sur "Ajouter une étape" pour commencer.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps
              .slice()
              .sort((a, b) => Number(a.number) - Number(b.number))
              .map((step) => (
                <div
                  key={step.id}
                  className="admin-card group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400 text-sm font-semibold">
                        {step.number}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                        {renderIcon(step.icon)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => resetForm(step)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(step.id, step.title)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white text-base font-medium">{step.title}</h3>
                  <p className="mt-2 text-white/50 text-sm">{step.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {ICON_LIST.filter((i) => i.name === step.icon).map((i) => (
                      <span
                        key={i.name}
                        className="rounded bg-white/5 px-2 py-0.5 text-[0.7rem] text-white/40"
                      >
                        {i.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

      {/* Modale */}
      {(editing || form.title !== "") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => {
            setEditing(null);
            setForm({ number: String(steps.length + 1).padStart(2, "0"), title: "", description: "", icon: "ChevronRight" });
          }}
        >
          <div
            className="admin-card w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-white text-lg font-semibold">
                {editing ? "Modifier l'étape" : "Nouvelle étape"}
              </h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ number: String(steps.length + 1).padStart(2, "0"), title: "", description: "", icon: "ChevronRight" });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Numéro</label>
                  <input
                    type="text"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    placeholder="01"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Titre</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Discover"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Understanding goals, requirements and project scope."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">Icône Lucide</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_LIST.map((i) => (
                    <button
                      key={i.name}
                      type="button"
                      onClick={() => setForm({ ...form, icon: i.name })}
                      className={`flex h-10 items-center justify-center rounded-lg border text-sm transition ${
                        form.icon === i.name
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      <i.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ number: String(steps.length + 1).padStart(2, "0"), title: "", description: "", icon: "ChevronRight" });
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
                  {editing ? "Modifier" : "Créer"}
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
