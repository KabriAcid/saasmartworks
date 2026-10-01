import { NextRequest, NextResponse } from "next/server";
import { verifySession, sessionCookieName } from "@/lib/auth/session";
import { identityForToken, AuthError } from "@/lib/auth/authorization";
import { routePermission } from "@/lib/auth/permissions";

export async function proxy(request: NextRequest) {
  const api = request.nextUrl.pathname.startsWith("/api/");
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!token || !await verifySession(token)) return api ? NextResponse.json({ error: { code: "UNAUTHENTICATED", message: "Please sign in." } }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));
  try {
    const identity = await identityForToken(token);
    if (identity.user.mustChangePassword) return api ? NextResponse.json({ error: { code: "PASSWORD_CHANGE_REQUIRED", message: "Change your password first." } }, { status: 403 }) : NextResponse.redirect(new URL("/change-password", request.url));
    const path = api ? request.nextUrl.pathname.replace(/^\/api/, "") : request.nextUrl.pathname;
    const permission = routePermission(path);
    if (!permission || !identity.permissions.includes(permission)) return NextResponse.json({ error: { code: "FORBIDDEN", message: "You do not have access to this page." } }, { status: 403 });
    return NextResponse.next();
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 503;
    if (!api && status === 401) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.json({ error: { code: status === 503 ? "UNAVAILABLE" : "FORBIDDEN", message: "Access unavailable." } }, { status });
  }
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
