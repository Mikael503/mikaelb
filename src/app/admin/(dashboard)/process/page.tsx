import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import ProcessClient from "./process-client";

export default async function ProcessPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = getStoreFresh();
  const { processSteps = [] } = store;

  return (
    <ProcessClient initialSteps={processSteps} />
  );
}
