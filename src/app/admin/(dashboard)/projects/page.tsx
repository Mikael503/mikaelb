import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh, fakeProfile } from "@/lib/data-store";
import { redirect } from "next/navigation";
import ProjectsClient from "./projects-client";

export default async function ProjectsPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStoreFresh();
  const { projects = [] } = store;

  return (
    <ProjectsClient initialProjects={projects} />
  );
}
