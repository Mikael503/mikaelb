import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
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
  const derived = require("node:crypto").pbkdf2Sync(password, salt, ITERATIONS, HASH_LENGTH, DIGEST);
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

async function getSessionFromCookie(getter: () => string | undefined): Promise<Session | null> {
  const token = getter();
  if (!token) return null;

  // Le token est <id_complet>.<signature>
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const id = parts[0];
  if (!id) return null;

  // Vérifier la signature
  const sig = parts[1];
  if (!sig) return null;
  const expected = createHmac("sha256", cookieSecret).update(id).digest("hex").slice(0, 16);
  const sigPadded = sig.padEnd(16, "0").slice(0, 16);
  if (!timingSafeEqual(Buffer.from(sigPadded), Buffer.from(expected))) {
    return null;
  }

  const sessions = readSessionsFile();
  const session = sessions[id];
  if (!session) return null;
  if (new Date(session.expires) < new Date()) {
    const copy = { ...sessions };
    delete copy[id];
    writeSessionsFile(copy);
    return null;
  }
  return session;
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
  const session: Session = {
    id: randomBytes(24).toString("hex"),
    email,
    created: new Date().toISOString(),
    expires: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
  };
  const sessions = readSessionsFile();
  sessions[session.id] = session;
  writeSessionsFile(sessions);

  const sig = createHmac("sha256", cookieSecret).update(session.id).digest("hex").slice(0, 16);
  const cookieValue = `${session.id}.${sig}`;

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
  store.delete(cookieName);
}

// ---------------------------------------------------------------------------
// Vérification du cookie (valide si structure <id>.<sig>)
// ---------------------------------------------------------------------------

function verifyCookieToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [id, sig] = parts;
  if (!id || !sig) return null;
  const expected = createHmac("sha256", cookieSecret).update(id).digest("hex").slice(0, 16);
  const sigPadded = sig.padEnd(16, "0").slice(0, 16);
  if (!timingSafeEqual(Buffer.from(sigPadded), Buffer.from(expected))) {
    return null;
  }
  return id;
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
