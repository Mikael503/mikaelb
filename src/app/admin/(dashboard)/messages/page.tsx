import { getSessionFromNextCookies } from "@/lib/auth";
import { getStoreFresh } from "@/lib/data-store";
import { redirect } from "next/navigation";
import MessagesClient from "./messages-client";

export default async function MessagesPage() {
  const session = await getSessionFromNextCookies();
  if (!session) redirect("/admin/login");

  const store = await getStoreFresh();
  const { messages = [] } = store;

  return (
    <MessagesClient initialMessages={messages} />
  );
}
