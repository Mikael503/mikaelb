import { NextResponse } from "next/server";
import { hashPasswordSync, verifyPassword, createSession, adminEmail } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    // Validation simple
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }

    if (!process.env.ADMIN_PASSWORD_HASH) {
      // Mode démo : tout mot de passe non vide fonctionne avec l'email admin par défaut
      if (email !== adminEmail) {
        return NextResponse.json({ error: "Identifiant inconnu." }, { status: 401 });
      }
      const { session, cookieValue } = await createSession(email);
      const response = NextResponse.json({ ok: true });
      response.cookies.set("admin_session", cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (email !== adminEmail) {
      return NextResponse.json({ error: "Identifiant inconnu." }, { status: 401 });
    }

    // Vérification du hash stocké
    const { hash, salt } = JSON.parse(
      Buffer.from(process.env.ADMIN_PASSWORD_HASH, "base64").toString("utf-8"),
    ) as { hash: string; salt: string };
    if (!verifyPassword(password, hash, salt)) {
      return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
    }

    const { session, cookieValue } = await createSession(email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
