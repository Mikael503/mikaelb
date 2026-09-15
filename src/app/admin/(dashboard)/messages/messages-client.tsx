"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Filter,
  Check,
  Reply,
  Archive,
  Trash,
  X,
  Inbox,
  Mail,
  Clock,
  CheckCircle,
  RotateCcw,
  FolderArchive,
  ChevronDown,
} from "lucide-react";
import { MB } from "@/components/ui/icons";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

type ToastType = "success" | "error" | null;

const STATUS_LABELS: Record<Message["status"], string> = {
  new: "Nouveau",
  read: "Lu",
  replied: "Répondu",
  archived: "Archivé",
};

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Message["status"] | "all">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filtered = messages
    .filter((m) => filter === "all" || m.status === filter)
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = messages.filter((m) => m.status === "new").length;

  const setStatus = useCallback(
    async (id: string, status: Message["status"]) => {
      setSaving(true);
      try {
        const res = await fetch("/api/admin/messages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur.", "error");
          return;
        }
        const { message } = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === id ? message : m)));
        showToast(`Message marqué comme ${STATUS_LABELS[status].toLowerCase()}.`);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [showToast],
  );

  const handleDelete = useCallback(
    async (id: string, subject: string) => {
      if (!confirm(`Supprimer ce message ?`)) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          showToast(data.error ?? "Erreur.", "error");
          return;
        }
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) setSelected(null);
        showToast(`Message "${subject}" supprimé.`);
      } catch {
        showToast("Erreur réseau.", "error");
      } finally {
        setSaving(false);
      }
    },
    [selected, showToast],
  );

  const openReply = useCallback((m: Message) => {
    window.open(`mailto:${m.email}?subject=Réponse:%20${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.message)}`, "_blank");
    setStatus(m.id, "replied");
  }, [setStatus]);

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
            { href: "/admin/skills", label: "Compétences", icon: "⚡" },
            { href: "/admin/process", label: "Processus", icon: "⚙" },
            { href: "/admin/stats", label: "Statistiques", icon: "📊" },
            { href: "/admin/messages", label: "Messages", icon: "✉", active: true },
            { href: "/admin/settings", label: "Paramètres", icon: "⚙" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                item.href === "/admin/messages"
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
            <h1 className="text-white text-2xl font-semibold">Messages</h1>
            <p className="mt-1 text-white/50">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
              {unreadCount > 0 ? ` · ${unreadCount} non lu{unreadCount !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou sujet..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 px-3 py-2 text-white placeholder-white/30 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
            {(["all", "new", "read", "replied", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                {f === "all" ? "Tous" : STATUS_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-card flex h-64 items-center justify-center text-center">
            <div>
              <Inbox className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/60 text-sm">
                {messages.length === 0
                  ? "Aucun message pour l'instant."
                  : "Aucun message ne correspond à la recherche."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col lg:flex-row gap-6">
            {/* Liste */}
            <div className="lg:w-80 flex flex-col">
              <div className="admin-card flex flex-1 flex-col border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {filtered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className={`admin-sidebar-link w-full text-left px-4 py-3 transition ${
                        selected?.id === m.id
                          ? "bg-white/5 text-white border-l-2 border-l-green-500"
                          : "border-l-2 border-l-transparent hover:bg-white/5"
                      } ${m.status === "new" ? "font-medium" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">
                          {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span
                          className={`text-[0.65rem] uppercase ${
                            m.status === "new"
                              ? "text-green-400"
                              : m.status === "replied"
                              ? "text-cyan-400"
                              : m.status === "archived"
                              ? "text-white/30"
                              : "text-white/40"
                          }`}
                        >
                          {STATUS_LABELS[m.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white truncate">{m.subject}</p>
                      <p className="mt-0.5 text-xs text-white/40 truncate">{m.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Détail */}
            <div className="flex-1">
              {selected ? (
                <div className="admin-card p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-white text-lg font-semibold">{selected.subject}</h2>
                      <div className="mt-1 flex items-center gap-3 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {selected.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {selected.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(selected.createdAt).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {selected.status === "new" && (
                        <button
                          onClick={() => setStatus(selected.id, "read")}
                          disabled={saving}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/80 text-white transition hover:bg-green-600/90 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Marquer comme lu"
                        >
                          {saving ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {selected.status !== "archived" && (
                        <>
                          <button
                            onClick={() => openReply(selected)}
                            disabled={saving}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600/80 text-white transition hover:bg-cyan-600/90 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Répondre"
                          >
                            <Reply className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStatus(selected.id, "archived")}
                            disabled={saving}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Archiver"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(selected.id, selected.subject)}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/80 text-white transition hover:bg-red-600/90 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <hr className="border-white/5 my-4" />
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/80 whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                    <hr className="flex-1 border-white/5" />
                    <span>ID: {selected.id.slice(0, 12)}...</span>
                  </div>
                </div>
              ) : (
                <div className="admin-card flex h-48 items-center justify-center text-center">
                  <p className="text-white/40 text-sm">
                    Sélectionnez un message pour le voir.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

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
