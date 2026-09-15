import type { Metadata } from "next";

import { getSessionFromNextCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./admin-layout-client";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — Portfolio Mikael Bohime",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  // Mode complet : sidebar desktop + header + contenu + drawer mobile.
  // (Le mode `sidebar` seul ne rend que le drawer et IGNORerait children.)
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
