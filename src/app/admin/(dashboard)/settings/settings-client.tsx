"use client";

import { useState, useCallback } from "react";
import { Save, Globe, Smartphone, Mail, Phone, MapPin, Check, X } from "lucide-react";

interface Settings {
  siteName?: string;
  siteUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgTitle?: string;
  seoOgDescription?: string;
  twitterHandle?: string;
  availability?: string;
  spotsLeft?: number;
  showProjects?: boolean;
  showStats?: boolean;
}

type ToastType = "success" | "error" | null;

export default function SettingsClient({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "social" | "portfolio">("general");

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur lors de la sauvegarde.", "error");
          return;
        }
        const { settings: updated } = await res.json();
        setSettings(updated);
        showToast("Paramètres enregistrés avec succès.");
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [settings, showToast],
  );

  const updateField = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const tabs = [
    { id: "general" as const, label: "Général", icon: SettingsIcon },
    { id: "seo" as const, label: "SEO", icon: Globe },
    { id: "social" as const, label: "Réseaux sociaux", icon: Smartphone },
    { id: "portfolio" as const, label: "Portfolio", icon: Mail },
  ] as const;

  return (
    <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-semibold">Paramètres</h1>
            <p className="mt-1 text-white/50">
              Configurez le portfolio et les réglages généraux.
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Tabs */}
          <div className="lg:w-48 shrink-0">
            <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    activeTab === tab.id
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu tab */}
          <div className="flex-1">
            {activeTab === "general" && (
              <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
                <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
                  <SettingsIcon className="h-5 w-5 text-green-500" />
                  Informations générales
                </h2>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Nom du site</label>
                  <input
                    type="text"
                    value={settings.siteName ?? "Portfolio Mikael Bohime"}
                    onChange={(e) => updateField("siteName", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">URL du site</label>
                  <input
                    type="url"
                    value={settings.siteUrl ?? "https://mikaelbohime.dev"}
                    onChange={(e) => updateField("siteUrl", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={settings.email ?? "hello@mikaelbohime.dev"}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Téléphone</label>
                    <input
                      type="tel"
                      value={settings.phone ?? "+33 6 00 00 00 00"}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Localisation</label>
                  <input
                    type="text"
                    value={settings.location ?? "France"}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div className="flex justify-end pt-2">
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
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {activeTab === "seo" && (
              <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
                <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
                  <Globe className="h-5 w-5 text-green-500" />
                  Référencement (SEO)
                </h2>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Title (meta title)</label>
                  <input
                    type="text"
                    value={settings.seoTitle ?? "Mikael Bohime | Portfolio Développeur Logiciel"}
                    onChange={(e) => updateField("seoTitle", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Description (meta description)</label>
                  <textarea
                    value={settings.seoDescription ?? "Développeur full-stack spécialisé dans les expériences digitales modernes, responsives et centrées sur l'utilisateur. Découvrez mes projets, mes compétences et contactez-moi."}
                    onChange={(e) => updateField("seoDescription", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
                  />
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="mb-3 text-white/60 text-sm font-medium">Open Graph</p>
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Title OG</label>
                    <input
                      type="text"
                      value={settings.seoOgTitle ?? "Mikael Bohime | Portfolio Développeur Logiciel"}
                      onChange={(e) => updateField("seoOgTitle", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Description OG</label>
                    <textarea
                      value={settings.seoOgDescription ?? "Développeur full-stack spécialisé dans les expériences digitales modernes, responsives et centrées sur l'utilisateur."}
                      onChange={(e) => updateField("seoOgDescription", e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
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
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {activeTab === "social" && (
              <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
                <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  Réseaux sociaux
                </h2>
                <div>
                  <label className="mb-1 block text-white text-sm font-medium">Twitter / X handle</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={settings.twitterHandle ?? "@mikaelbohime"}
                      onChange={(e) => updateField("twitterHandle", e.target.value)}
                      placeholder="@mikaelbohime"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/40">Sans le @, ex: mikaelbohime</p>
                </div>
                <div className="flex justify-end pt-2">
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
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {activeTab === "portfolio" && (
              <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
                <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
                  <Mail className="h-5 w-5 text-green-500" />
                  Affichage du portfolio
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Disponibilité</label>
                    <input
                      type="text"
                      value={settings.availability ?? "Disponible"}
                      onChange={(e) => updateField("availability", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-white text-sm font-medium">Places restantes</label>
                    <input
                      type="number"
                      min={0}
                      value={settings.spotsLeft ?? 2}
                      onChange={(e) => updateField("spotsLeft", Number(e.target.value))}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showProjects ?? true}
                      onChange={(e) => updateField("showProjects", e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-green-500 focus:ring-green-500/40"
                    />
                    <span className="text-white text-sm">Afficher les projets</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showStats ?? true}
                      onChange={(e) => updateField("showStats", e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-green-500 focus:ring-green-500/40"
                    />
                    <span className="text-white text-sm">Afficher les statistiques</span>
                  </label>
                </div>
                <div className="flex justify-end pt-2">
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
                    Enregistrer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

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

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
