"use client";

import { useState, FormEvent, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { MB } from "@/components/ui/icons";

export default function AdminLoginClient() {
  const searchParams = useSearchParams();
  const redirectFrom = searchParams.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      if (!email || !password) {
        setError("Veuillez compléter email et mot de passe.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Impossible de se connecter.");
          return;
        }
        // Naviguer avec le navigateur pour que le cookie Set-Cookie soit pris en compte
        window.location.href = redirectFrom.startsWith("/admin") ? redirectFrom : "/admin";
      } catch {
        setError("Erreur réseau.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, redirectFrom],
  );

  const logout = useCallback(async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin/login";
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-10 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <MB className="h-7 w-7 text-green-500" />
      </div>
      <div className="max-w-sm text-center">
        <p className="text-white text-2xl font-semibold">Connexion Admin</p>
        <p className="mt-2 text-white/60">Portfolio Mikael — Espace d&apos;administration</p>
      </div>
      <form
        onSubmit={submit}
        className="w-full max-w-sm"
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <MB className="h-5 w-5 text-green-500" />
            <span className="text-white text-sm font-medium">Mikael Bohime</span>
          </div>
          <div className="mb-4">
            <label htmlFor="admin-email" className="mb-1 block text-white text-sm font-medium">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mikaelbohime.dev"
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/40 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="admin-password" className="mb-1 block text-white text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white placeholder-white/40 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/40"
            />
          </div>
          {error ? <p className="mb-4 text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-4 py-2.5 text-white font-medium transition hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </div>
        <p className="mt-6 text-white/50 text-xs text-center">
          Mot de passe configuré dans <span className="text-white/70">.env.local</span>
        </p>
      </form>
    </div>
  );
}
