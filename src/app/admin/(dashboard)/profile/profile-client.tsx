"use client";

import { useState, useCallback } from "react";
import { Save, Image, Upload, X, Check, Mail, Phone, MapPin, Clock } from "lucide-react";

interface Profile {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  tagline: string;
  bio: string;
  longBio: string;
  photo: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  spotsLeft: number;
  cvUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  stats: {
    clients: number;
    projects: number;
    experience: number;
    satisfaction: number;
  };
}

type ToastType = "success" | "error" | null;

export default function ProfileClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [photoPreview, setPhotoPreview] = useState(profile.photo);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        const res = await fetch("/api/admin/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur lors de la sauvegarde.", "error");
          return;
        }
        const { profile: updated } = await res.json();
        setProfile(updated);
        showToast("Profil mis à jour avec succès.");
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [profile, showToast],
  );

  const updateField = useCallback(
    <K extends keyof Profile>(key: K, value: Profile[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Profil</h1>
          <p className="mt-1 text-white/50">
            Gérez les informations affichées sur votre portfolio.
          </p>
        </div>
      </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Prévisualisation photo */}
          <div className="admin-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-white text-lg font-semibold">
              <Image className="h-5 w-5 text-green-500" />
              Aperçu
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Photo de profil"
                    className="h-32 w-32 rounded-full border-2 border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 text-white/40 text-sm">
                    Photo non configurée
                  </div>
                )}
                {photoPreview && (
                  <button
                    onClick={() => {
                      setPhotoPreview("");
                      updateField("photo", "");
                    }}
                    className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white transition hover:bg-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("URL de la photo de profil :");
                  if (url) {
                    setPhotoPreview(url);
                    updateField("photo", url);
                  }
                }}
                className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <Upload className="h-4 w-4" />
                Changer la photo
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center gap-1 text-center">
              <span className="text-2xl font-bold text-white">
                {profile.name}
              </span>
              <span className="text-white/50 text-sm">{profile.role}</span>
              <span className="text-white/40 text-xs">{profile.tagline}</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-[0.75rem] text-white/50">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/70"
                >
                  GitHub
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/70"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/70"
                >
                  Twitter/X
                </a>
              )}
              {profile.socialLinks.email && (
                <a
                  href={profile.socialLinks.email}
                  className="hover:text-white/70"
                >
                  Email
                </a>
              )}
            </div>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="admin-card flex flex-1 flex-col gap-5 p-6 lg:col-span-2"
          >
            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <Save className="h-5 w-5 text-green-500" />
              Informations générales
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Initiales (2 lettres)
                </label>
                <input
                  type="text"
                  value={profile.initials}
                  maxLength={2}
                  onChange={(e) => updateField("initials", e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Rôle
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-white text-sm font-medium">
                Tagline
              </label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-white text-sm font-medium">
                Bio courte
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-white text-sm font-medium">
                Bio longue
              </label>
              <textarea
                value={profile.longBio}
                onChange={(e) => updateField("longBio", e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
              />
            </div>

            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <MapPin className="h-5 w-5 text-green-500" />
              Coordonnées
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-white text-sm font-medium">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Disponibilité
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={profile.availability}
                    onChange={(e) => updateField("availability", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Places restantes
                </label>
                <input
                  type="number"
                  min={0}
                  value={profile.spotsLeft}
                  onChange={(e) =>
                    updateField("spotsLeft", Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  URL du CV
                </label>
                <input
                  type="url"
                  value={profile.cvUrl}
                  onChange={(e) => updateField("cvUrl", e.target.value)}
                  placeholder="/cv/mikael-bohime.pdf"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
            </div>

            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <Mail className="h-5 w-5 text-green-500" />
              Réseaux sociaux
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  GitHub
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.github ?? ""}
                  onChange={(e) =>
                    updateField("socialLinks", {
                      ...profile.socialLinks,
                      github: e.target.value || undefined,
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.linkedin ?? ""}
                  onChange={(e) =>
                    updateField("socialLinks", {
                      ...profile.socialLinks,
                      linkedin: e.target.value || undefined,
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Twitter / X
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.twitter ?? ""}
                  onChange={(e) =>
                    updateField("socialLinks", {
                      ...profile.socialLinks,
                      twitter: e.target.value || undefined,
                    })
                  }
                  placeholder="https://twitter.com/..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Email (lien mailto)
                </label>
                <input
                  type="url"
                  value={profile.socialLinks.email ?? ""}
                  onChange={(e) =>
                    updateField("socialLinks", {
                      ...profile.socialLinks,
                      email: e.target.value || undefined,
                    })
                  }
                  placeholder="mailto:..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
            </div>

            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <span className="text-green-500">Statistiques</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Clients satisfaits
                </label>
                <input
                  type="number"
                  min={0}
                  value={profile.stats.clients}
                  onChange={(e) =>
                    updateField("stats", {
                      ...profile.stats,
                      clients: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Projets réalisés
                </label>
                <input
                  type="number"
                  min={0}
                  value={profile.stats.projects}
                  onChange={(e) =>
                    updateField("stats", {
                      ...profile.stats,
                      projects: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Années d'expérience
                </label>
                <input
                  type="number"
                  min={0}
                  value={profile.stats.experience}
                  onChange={(e) =>
                    updateField("stats", {
                      ...profile.stats,
                      experience: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-white text-sm font-medium">
                  Taux de satisfaction (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={profile.stats.satisfaction}
                  onChange={(e) =>
                    updateField("stats", {
                      ...profile.stats,
                      satisfaction: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setProfile(initialProfile);
                  setPhotoPreview(initialProfile.photo);
                }}
                className="rounded-lg px-4 py-2 text-sm text-white/60 transition hover:bg-white/5"
              >
                Réinitialiser
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
                Enregistrer
              </button>
            </div>
          </form>
        </div>

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
