"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Home,
  LogOut,
  Mail,
  Menu,
  Settings,
  Star,
  User,
  X,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { MB } from "@/components/ui/icons";

interface AdminLayoutClientProps {
  children?: React.ReactNode;
  sidebar?: boolean;
  header?: boolean;
  data?: {
    projectCount?: number;
    featuredCount?: number;
    skillCount?: number;
    messageCount?: number;
    unreadCount?: number;
    clientCount?: number;
    satisfaction?: number;
    activities?: Array<{
      id: string;
      type: string;
      description: string;
      createdAt: string;
    }>;
  };
}

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: Home },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/projects", label: "Projets", icon: FolderOpen },
  { href: "/admin/skills", label: "Compétences", icon: Star },
  { href: "/admin/process", label: "Processus", icon: GitBranch },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayoutClient({
  children,
  sidebar,
  header,
  data,
}: AdminLayoutClientProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ id: string; message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("admin-drawer-open");
      return () => {
        document.body.classList.remove("admin-drawer-open");
      };
    }
  }, [drawerOpen]);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setToast({ id: Math.random().toString(36).slice(2), message: "Déconnexion réussie.", type: "success" });
    router.replace("/admin/login");
  };

  const showToast = (message: string, type?: "success" | "error") => {
    const id = Math.random().toString(36).slice(2);
    setToast({ id, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (sidebar) {
    return (
      <>
        {/* Drawer mobile */}
        <div className={"admin-sidebar-drawer" + (drawerOpen ? " open" : "")}>
          <header className="admin-sidebar-drawer-header flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MB className="h-7 w-7 text-green-500" />
              <span className="text-white font-semibold">MB</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="admin-btn-text p-1"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <nav className="admin-sidebar-drawer-body admin-sidebar">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = false; // le client ne connaît pas pathname ici (côté serveur on ne peut pas le passer facilement)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${active ? "active" : ""}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <footer className="admin-sidebar-drawer-footer">
            <button
              onClick={logout}
              className="admin-sidebar-link w-full text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
            <p className="mt-3 text-white/30 text-[0.7rem] text-center">Portfolio Mikael Bohime</p>
          </footer>
        </div>

        {/* Overlay mobile */}
        <div
          className={`admin-overlay ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />
      </>
    );
  }

  if (header) {
    return (
      <div className="flex items-center gap-4">
        {/* Bouton menu mobile */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="admin-btn-secondary flex items-center justify-center px-2 py-1 text-white/70 sm:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Badge messages non lus */}
        <Link
          href="/admin/messages"
          className="admin-sidebar-link flex items-center gap-2 bg-transparent px-2 py-1 text-white/70 hover:text-white transition"
        >
          <Mail className="h-4 w-4" />
          {data?.messageCount != null && (
            <span className="admin-badge admin-badge-new rounded-full px-2 py-0.5 text-[0.65rem] min-w-[1.4rem] justify-center">
              {data.messageCount}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={logout}
            className="admin-sidebar-link flex items-center gap-2 bg-transparent px-2 py-1 text-white/70 hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div className="min-h-screen admin-app">
        <div className="flex min-h-screen">
          {/* Sidebar desktop */}
          <aside className="hidden w-64 shrink-0 admin-sidebar lg:block">
            <div className="flex items-center gap-3 border-b border-[var(--admin-border)] p-4">
              <MB className="h-7 w-7 text-green-500" />
              <div>
                <p className="text-white font-semibold">MB</p>
                <p className="text-white/40 text-[0.65rem] uppercase tracking-wider">Admin</p>
              </div>
            </div>
            <nav className="flex flex-col">
              <div className="sidebar-section">
                <p className="admin-sidebar-section mb-2 px-4">Portfolio</p>
              </div>
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="admin-sidebar-link"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto p-4">
              <button
                onClick={logout}
                className="admin-sidebar-link w-full text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
              <p className="mt-3 text-white/30 text-[0.7rem] text-center">Portfolio Mikael Bohime</p>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="flex flex-1 flex-col w-full">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[var(--admin-border)] bg-black/30 px-6 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="admin-btn-secondary flex items-center justify-center px-2 py-1 text-white/70 sm:hidden"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <span className="flex items-center gap-3">
                  <MB className="h-6 w-6 text-green-500" />
                  <span className="text-white text-sm font-semibold">Mikael Bohime</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/messages"
                  className="admin-sidebar-link flex items-center gap-2 bg-transparent px-2 py-1 text-white/70 hover:text-white transition"
                >
                  <Mail className="h-4 w-4" />
                  {data?.messageCount != null && (
                    <span className="admin-badge admin-badge-new rounded-full px-2 py-0.5 text-[0.65rem] min-w-[1.4rem] justify-center">
                      {data.messageCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="admin-sidebar-link flex items-center gap-2 bg-transparent px-2 py-1 text-white/70 hover:text-red-400 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Déconnexion</span>
                </button>
              </div>
            </header>

            {/* Contenu */}
            <main className="flex-1 px-6 py-8">
              {children}
            </main>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="admin-toast">
            <div className={`admin-toast-item ${toast.type ?? "success"}`}>
              {toast.message}
            </div>
          </div>
        )}

        {/* Drawer mobile */}
        <div
          className={`admin-overlay ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />
        <div className={`admin-sidebar-drawer ${drawerOpen ? "open" : ""}`}>
          <header className="admin-sidebar-drawer-header flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MB className="h-7 w-7 text-green-500" />
              <span className="text-white font-semibold">MB</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="admin-btn-text p-1"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <nav className="admin-sidebar-drawer-body admin-sidebar">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-sidebar-link"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <footer className="admin-sidebar-drawer-footer">
            <button
              onClick={logout}
              className="admin-sidebar-link w-full text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
            <p className="mt-3 text-white/30 text-[0.7rem] text-center">Portfolio Mikael Bohime</p>
          </footer>
        </div>
      </div>
    );
  }

  return null;
}
