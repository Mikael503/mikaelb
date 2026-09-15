import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware minimaliste — compatible Edge Runtime.
 *
 * IMPORTANT : ne pas importer @/lib/auth ici (node:fs / node:crypto ne sont
 * pas supportés dans le runtime Edge et faisaient planter le bundle du
 * middleware, qui ne s'exécutait donc jamais).
 *
 * Rôles :
 *  - exposer le chemin courant au layout serveur via le header x-pathname ;
 *  - le contrôle de session reste assuré par src/app/admin/layout.tsx
 *    (redirection vers /admin/login) et par chaque route /api/admin/* qui
 *    appelle getSessionFromRequest() (réponse 401).
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-proxy-ran", "1");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
