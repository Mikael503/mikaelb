import { NextResponse } from "next/server";
import { getSessionFromRequest, getCookieFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  return NextResponse.json({ email: session.email, created: session.created, expires: session.expires });
}
