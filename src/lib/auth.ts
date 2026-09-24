import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { asGetter, asMutator, type CookieGetter, type CookieMutator } from "./cookie-utils";
import { readFileSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SALT_LENGTH = 32;
const HASH_LENGTH = 64;
const ITERATIONS = 100_000;
const DIGEST = "sha512" as const;

export const cookieName = process.env.ADMIN_SESSION_COOKIE ?? "admin_session";
const cookieSecret = process.env.AUTH_SECRET ?? "fallback-change-me";
export const adminEmail = process.env.ADMIN_EMAIL ?? "admin@mikaelbohime.dev";

// ---------------------------------------------------------------------------
// Hashage du mot de passe (pbkdf2, natif, sans dépendance)
// ---------------------------------------------------------------------------

function hashPasswordRaw(password: string, salt: string): string {
  const derived = pbkdf2Sync(password, salt, ITERATIONS, HASH_LENGTH, DIGEST);
  return derived.toString("hex");
}

export function hashPasswordSync(password: string): { hash: string; salt: string } {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = hashPasswordRaw(password, salt);
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = hashPasswordRaw(password, salt);
  if (derived.length !== hash.length) return false;
  return timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export interface Session {
  id: string;
  email: string;
  created: string;
  expires: string;
}

export interface SessionsFile {
  [key: string]: Session;
}

// ---------------------------------------------------------------------------
// Sessions file helpers (pour les API qui ne peuvent pas utiliser next/headers)
// ---------------------------------------------------------------------------

function sessionsPath(): string {
  const base = process.env.ADMIN_DATA_PATH ?? "./data";
  return `${base}/sessions.json`;
}

export function readSessionsFile(): SessionsFile {
  const path = sessionsPath();
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as SessionsFile;
  } catch {
    return {};
  }
}

export function writeSessionsFile(sessions: SessionsFile): void {
  const path = sessionsPath();
  writeFileSync(path, JSON.stringify(sessions, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// Opérations session
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sessions SANS filesystem (stateless, compatible serverless/Netlify)
// ---------------------------------------------------------------------------
// Le token est autosuffisant : v1.<id>.<expiresMs>.<emailB64>.<signature>
// où signature = HMAC-SHA256(secret, "v1.<id>.<expiresMs>.<emailB64>").
// Aucune lecture/écriture disque → fonctionne sur filesystem éphémère.
// La déconnexion supprime simplement le cookie (pas de révocation serveur,
// la session expire d'elle-même au bout de 7 jours).

const SESSION_TTL_MS = 7 * 24 * 3600 * 1000;
const SIG_LENGTH = 32;

function b64urlEncode(s: string): string {
  return Buffer.from(s, "utf-8").toString("base64url");
}

function b64urlDecode(s: string): string {
  return Buffer.from(s, "base64url").toString("utf-8");
}

function signSessionPayload(payload: string): string {
  return createHmac("sha256", cookieSecret).update(payload).digest("hex").slice(0, SIG_LENGTH);
}

function signaturesEqual(a: string, b: string): boolean {
  const normA = a.slice(0, SIG_LENGTH).padEnd(SIG_LENGTH, "0");
  const normB = b.slice(0, SIG_LENGTH).padEnd(SIG_LENGTH, "0");
  return timingSafeEqual(Buffer.from(normA), Buffer.from(normB));
}

async function getSessionFromCookie(getter: () => string | undefined): Promise<Session | null> {
  const token = getter();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return null;
  const [, id, expStr, emailB64, sig] = parts as [string, string, string, string, string];
  if (!id || !expStr || !emailB64 || !sig) return null;

  const payload = `v1.${id}.${expStr}.${emailB64}`;
  if (!signaturesEqual(sig, signSessionPayload(payload))) {
    return null;
  }

  const expiresMs = Number(expStr);
  if (!Number.isFinite(expiresMs) || expiresMs < Date.now()) {
    return null;
  }

  let email: string;
  try {
    email = b64urlDecode(emailB64);
  } catch {
    return null;
  }
  if (!email) return null;

  const expires = new Date(expiresMs).toISOString();
  return {
    id,
    email,
    created: new Date(expiresMs - SESSION_TTL_MS).toISOString(),
    expires,
  };
}

export async function getSession(requestLike?: {
  cookies: () => CookieGetter;
}): Promise<Session | null> {
  if (!requestLike) {
    return null;
  }
  const getter = () => asGetter(requestLike.cookies()).get(cookieName);
  return getSessionFromCookie(getter);
}

export async function getSessionFromNextCookies() {
  // Appelé depuis une Route Handler ou Server Action côté serveur Next.js
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookie = cookieStore.get ? cookieStore.get(cookieName) : undefined;
  const raw = cookie ? cookie.value : undefined;
  const getter = () => raw;
  return getSessionFromCookie(getter);
}

export async function createSession(email: string): Promise<{
  session: Session;
  cookieValue: string;
}> {
  const id = randomBytes(24).toString("hex");
  const expiresMs = Date.now() + SESSION_TTL_MS;
  const payload = `v1.${id}.${expiresMs}.${b64urlEncode(email)}`;
  const cookieValue = `${payload}.${signSessionPayload(payload)}`;

  const session: Session = {
    id,
    email,
    created: new Date().toISOString(),
    expires: new Date(expiresMs).toISOString(),
  };
  return { session, cookieValue };
}

export async function destroySession(requestLike?: {
  cookies: () => CookieMutator;
}): Promise<void> {
  const cookieStore = requestLike?.cookies ?? (() => {
    const c = require("next/headers").cookies;
    return c() as CookieMutator;
  });
  const store = asMutator(cookieStore());
  // Session stateless : la déconnexion = suppression du cookie.
  // Nettoyage best-effort de l'ancien fichier de sessions (local uniquement).
  try {
    const token = store.get(cookieName);
    if (token) {
      const sessions = readSessionsFile();
      const parts = token.split(".");
      const id = parts[0];
      if (id && sessions[id]) {
        const copy = { ...sessions };
        delete copy[id];
        writeSessionsFile(copy);
      }
    }
  } catch {
    // Filesystem indisponible (serverless) : rien à nettoyer.
  }
  store.delete(cookieName);
}

export function requireAdmin(requestLike?: {
  cookies: () => CookieGetter;
}): Promise<Session | null> {
  return getSession(requestLike);
}

// ---------------------------------------------------------------------------
// Cookie depuis un Request standard (pour les APIs / api routes)
// ---------------------------------------------------------------------------

export function getCookieFromRequest(request: Request): CookieGetter {
  const headers = new Headers(request.headers);
  const cookieHeader = headers.get("cookie") ?? "";
  const map: Record<string, string> = {};
  cookieHeader.split(";").forEach((c) => {
    const eqIdx = c.indexOf("=");
    if (eqIdx > 0) {
      const k = c.slice(0, eqIdx).trim();
      const v = c.slice(eqIdx + 1).trim();
      map[k] = v;
    }
  });
  return { get: (n: string) => map[n] ?? undefined };
}

// ---------------------------------------------------------------------------
// Adaptateur pour les routes /api (pas de next/headers ici)
// ---------------------------------------------------------------------------

export function getSessionFromRequest(request: Request): Promise<Session | null> {
  const cookie = getCookieFromRequest(request);
  return getSessionFromCookie(() => cookie.get(cookieName));
}
