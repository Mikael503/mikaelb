import type { Metadata } from "next";
import { cookies } from "next/headers";

import AdminLoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Connexion Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLoginPage() {
  // Accès aux cookies => rendu dynamique (pas de prerender statique,
  // sinon le build échoue et un visiteur connecté verrait le formulaire).
  await cookies();
  return <AdminLoginClient />;
}
