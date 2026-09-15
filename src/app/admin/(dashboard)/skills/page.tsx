import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import SkillsClient from "./skills-client";

export default async function SkillsPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = getStoreFresh();
  const { skills = [] } = store;

  return (
    <SkillsClient initialSkills={skills} />
  );
}
