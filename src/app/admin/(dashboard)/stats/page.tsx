import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import StatsClient from "./stats-client";

export default async function StatsPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStoreFresh();
  const { stats = [] } = store;

  return (
    <StatsClient initialStats={stats} />
  );
}
