import { getSessionFromNextCookies } from "@/lib/auth";
import { getStore, fakeProfile } from "@/lib/data-store";
import { redirect } from "next/navigation";
import {
  FolderOpen,
  Star,
  Mail,
  BarChart3,
  Settings,
  GitBranch,
  User,
  Home,
  Clock,
} from "lucide-react";

export default async function AdminPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStore();
  const {
    profile = fakeProfile(),
    projects = [],
    skills = [],
    processSteps = [],
    stats = [],
    messages = [],
    settings = {},
  } = store;

  const projectCount = projects.length;
  const featuredCount = projects.filter((p) => p.featured === true).length;
  const skillCount = skills.length;
  const messageCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "new").length;
  const clientCount = Array.isArray(profile.clients) ? profile.clients.length : Number(profile.clients ?? 0);
  const satisfaction = Number(
    stats.find((s) => s.label.toLowerCase().includes("satisfaction"))?.value ?? 0,
  );

  const activities = store.activity ?? [];

  const QUICK_LINKS = [
    { label: "Tableau de bord", href: "/admin", icon: Home },
    { label: "Profil", href: "/admin/profile", icon: User },
    { label: "Projets", href: "/admin/projects", icon: FolderOpen },
    { label: "Compétences", href: "/admin/skills", icon: Star },
    { label: "Processus", href: "/admin/process", icon: GitBranch },
    { label: "Statistiques", href: "/admin/stats", icon: BarChart3 },
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "Paramètres", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Tableau de bord</h1>
        <p className="mt-1 text-white/50">Aperçu général de ton portfolio.</p>
      </div>

            {/* Cartes statistiques */}
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
              <StatCard label="Projets" value={projectCount} accent />
              <StatCard label="Projets en vedette" value={featuredCount} accent suffix="★" />
              <StatCard label="Compétences" value={skillCount} accent />
              <StatCard
                label="Messages"
                value={messageCount}
                accent
                subtitle={unreadCount > 0 ? `${unreadCount} non lus` : undefined}
              />
              <StatCard label="Clients" value={clientCount} accent />
              <StatCard label="Satisfaction" value={satisfaction} accent suffix="%" />
            </div>

            {/* Activité récente */}
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-white text-lg font-semibold">
                <Clock className="h-5 w-5 text-green-500" />
                Activité récente
              </h2>
              {activities.length === 0 ? (
                <div className="admin-card p-6 text-center">
                  <p className="text-white/60 text-sm">Aucune activité récente.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {activities.slice(0, 10).map((a) => (
                    <li
                      key={a.id}
                      className="admin-card p-4 flex items-start gap-3 text-sm"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[0.65rem] font-semibold uppercase text-white/50">
                        {a.type === "project" ? "P" : a.type === "profile" ? "Pr" : "Ms"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-white">{a.description}</p>
                        <p className="text-white/40 text-xs">
                          {new Date(a.createdAt).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      </li>
                    ))}
                </ul>
              )}
            </section>

            {/* Liens rapides */}
            <section>
              <h2 className="mb-4 text-white text-lg font-semibold">Espaces</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {QUICK_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="admin-card p-4 flex items-center gap-3 text-white hover:bg-white/5 transition"
                    >
                      <Icon className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  );
                })}
              </div>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent = false,
  subtitle,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
  subtitle?: string;
}) {
  return (
    <div
      className={`admin-card p-5 ${
        accent ? "border-green-500/20 shadow-[0_0_0_1px_rgba(124,182,138,0.06)]" : ""
      }`}
    >
      <p className="text-white/50 text-sm">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-3xl font-semibold ${accent ? "text-green-500" : "text-white"}`}>
          {value}
        </span>
        {suffix ? <span className="text-white/60 text-sm">{suffix}</span> : null}
      </div>
      {subtitle ? <p className="mt-1 text-white/40 text-xs">{subtitle}</p> : null}
    </div>
  );
}
