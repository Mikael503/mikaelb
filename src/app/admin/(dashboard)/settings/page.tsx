import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStoreFresh();
  const { settings = {} } = store;

  return (
    <SettingsClient initialSettings={settings} />
  );
}
