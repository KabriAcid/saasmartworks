import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes, randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { openDatabase } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { credentialsSchema, changePasswordSchema } from "@/validation/auth";
import { AuthError, credentialVersion, identityForToken } from "./authorization";
import { signSession, sessionCookieName } from "./session";

const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 8 * 60 * 60 };
const attempts = new Map<string, { count: number; until: number }>();
let dummyHash: Promise<string> | undefined;
function limit(key: string) {
  const now = Date.now();
  for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry);
  const value = attempts.get(key) ?? { count: 0, until: now + 15 * 60 * 1000 };
  if (value.count >= 10 || attempts.size >= 10000) throw new AuthError(429, "RATE_LIMITED", "Too many attempts. Try again later.");
  value.count++; attempts.set(key, value);
}
export async function authHandler(request: NextRequest, operation: "login" | "logout" | "me" | "change-password") {
  const requestId = randomUUID();
  let stage = "request";
  const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
  try {
    if (request.method !== "GET" && request.headers.get("origin") !== request.nextUrl.origin) throw new AuthError(403, "INVALID_ORIGIN", "Request origin is not allowed.");
    if (operation === "logout") { const response = json({ data: { loggedOut: true } }); response.cookies.set(sessionCookieName, "", { ...cookieOptions, maxAge: 0 }); return response; }
    if (operation === "me") return json({ data: await identityForToken(request.cookies.get(sessionCookieName)?.value) });
    if (!request.headers.get("content-type")?.includes("application/json")) throw new AuthError(415, "INVALID_CONTENT_TYPE", "Use application/json.");
    const raw = await request.text();
    if (raw.length > 8192) throw new AuthError(413, "TOO_LARGE", "Request is too large.");
    let input: unknown;
    try { input = JSON.parse(raw); } catch { throw new AuthError(400, "INVALID_JSON", "Invalid JSON body."); }
    stage = "database-configuration";
    const { db } = openDatabase();
    if (operation === "login") {
      const parsed = credentialsSchema.safeParse(input);
      if (!parsed.success) throw new AuthError(422, "INVALID_INPUT", "Enter a valid email and password.");
      limit(`login:${parsed.data.email}`);
      stage = "user-query";
      const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
      dummyHash ??= hashPassword(randomBytes(24).toString("hex"));
      stage = "password-verification";
      const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? await dummyHash);
      if (!valid || !user || user.status !== "ACTIVE") throw new AuthError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
      stage = "session-signing";
      const token = await signSession(user.id, credentialVersion(user.passwordHash));
      stage = "permission-query";
      const identity = await identityForToken(token);
      const response = json({ data: identity }); response.cookies.set(sessionCookieName, token, cookieOptions); return response;
    }
    const identity = await identityForToken(request.cookies.get(sessionCookieName)?.value);
    limit(`password:${identity.user.id}`);
    const parsed = changePasswordSchema.safeParse(input);
    if (!parsed.success) throw new AuthError(422, "INVALID_INPUT", "Use a different password with at least 12 characters and at most 72 UTF-8 bytes.");
    const [user] = await db.select().from(users).where(eq(users.id, identity.user.id)).limit(1);
    if (!user || !await verifyPassword(parsed.data.currentPassword, user.passwordHash)) throw new AuthError(401, "INVALID_CREDENTIALS", "Current password is incorrect.");
    const passwordHash = await hashPassword(parsed.data.newPassword);
    const updated = await db.update(users).set({ passwordHash, mustChangePassword: false, updatedAt: Date.now() }).where(and(eq(users.id, user.id), eq(users.passwordHash, user.passwordHash), eq(users.status, "ACTIVE"))).returning({ id: users.id });
    if (!updated.length) throw new AuthError(409, "CONFLICT", "Account changed. Sign in again.");
    const token = await signSession(user.id, credentialVersion(passwordHash));
    const response = json({ data: await identityForToken(token) }); response.cookies.set(sessionCookieName, token, cookieOptions); return response;
  } catch (error) {
    if (error instanceof AuthError) return json({ error: { code: error.code, message: error.message } }, error.status);
    const cause = error instanceof Error ? error.cause : undefined;
    const code = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
    console.error("Authentication failed", { requestId, operation, stage, code: /^[A-Z0-9_]{1,40}$/.test(code) ? code : "UNKNOWN" });
    // Log the underlying exception, not Drizzle's query/parameter wrapper.
    const exception = cause instanceof Error ? cause : error;
    const redact = (value: string) => value
      .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[database URL redacted]")
      .replace(/(\nparams:)[\s\S]*/i, "$1 [redacted]");
    if (exception instanceof Error) {
      console.error(redact(`${exception.name}: ${exception.message}`));
      if (exception.stack) console.error(redact(exception.stack));
    } else {
      console.error("Authentication threw a non-Error value.");
    }
    return json({ error: { code: "UNAVAILABLE", message: "Authentication is temporarily unavailable. Please try again.", requestId } }, 503);
  }
}
