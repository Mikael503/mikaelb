/**
 * Fonctions utilitaires pour obtenir un cookie depuis un objet compatible.
 * Gère indifféremment les cookies Next.js (RequestCookies) et les cookies
 * issus d'un Request standard (header).
 */
type CookieGetter = {
  get: (name: string) => string | undefined;
};

type CookieMutator = CookieGetter & {
  delete: (name: string) => void;
};

export function asGetter(cookies: CookieGetter): CookieGetter {
  return cookies;
}

export function asMutator(cookies: CookieMutator): CookieMutator {
  return cookies;
}

export type { CookieGetter, CookieMutator };
