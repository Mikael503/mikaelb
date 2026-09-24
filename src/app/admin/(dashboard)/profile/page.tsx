import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStoreFresh();
  const { profile } = store;

  return (
    <ProfileClient initialProfile={profile} />
  );
}
