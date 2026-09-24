import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getStoreFresh,
  saveStore,
  generateId,
} from "@/lib/data-store";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom est trop long"),
  email: z
    .string()
    .email("Adresse email invalide")
    .max(255, "L'email est trop long"),
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(200, "Le sujet est trop long"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(5000, "Le message est trop long"),
});

// Simple in-memory rate limiter
const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 submissions per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  const userSubmissions = submissions.get(ip) ?? [];
  const recent = userSubmissions.filter((t) => t > windowStart);
  submissions.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false;
  }

  recent.push(now);
  return true;
}

async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.log("Email non configuré (RESEND_API_KEY ou CONTACT_EMAIL manquant). Message stocké uniquement.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Erreur envoi email Resend:", res.status, body);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check honeypot
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    // Validate
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Entrée invalide.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    // Stocker le message dans le data-store (Supabase ou JSON local)
    const store = await getStoreFresh();
    const msg = {
      id: generateId(),
      name,
      email,
      subject,
      message,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };
    store.messages = [msg, ...store.messages];
    await saveStore(store);

    // Envoyer l'email
    await sendContactEmail(name, email, subject, message);

    return NextResponse.json({
      success: true,
      message: "Message reçu ! Je reviendrai vers vous rapidement.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}
