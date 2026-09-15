import { NextResponse } from "next/server";
import { getSessionFromRequest, getCookieFromRequest, readSessionsFile, writeSessionsFile, cookieName } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Aucune session." }, { status: 401 });
  }
  // Supprimer la session côté serveur
  const cookie = getCookieFromRequest(request);
  const token = cookie.get(cookieName);
  if (token) {
    const parts = token.split(".");
    const id = parts[0];
    if (id) {
      const sessions = readSessionsFile();
      if (sessions[id]) {
        const copy = { ...sessions };
        delete copy[id];
        writeSessionsFile(copy);
      }
    }
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", { maxAge: 0, path: "/" });
  return response;
}
