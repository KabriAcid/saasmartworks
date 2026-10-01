import "server-only";
import { createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { openDatabase } from "@/db/client";
import { users, roles, userRoles, rolePermissions } from "@/db/schema";
import { sessionCookieName, verifySession } from "./session";

export class AuthError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function credentialVersion(hash: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("Invalid session configuration");
  return createHmac("sha256", secret).update(hash).digest("hex");
}
export async function identityForToken(token?: string) {
  const claims = token ? await verifySession(token) : null;
  if (!claims?.sub) throw new AuthError(401, "UNAUTHENTICATED", "Please sign in.");
  const { db } = openDatabase();
  const [user] = await db.select().from(users).where(eq(users.id, claims.sub)).limit(1);
  if (!user || user.status !== "ACTIVE" || claims.credentialVersion !== credentialVersion(user.passwordHash)) throw new AuthError(401, "UNAUTHENTICATED", "Please sign in again.");
  const assignments = await db.select({ role: roles.name, unit: userRoles.businessUnitId, permission: rolePermissions.permissionId })
    .from(userRoles).innerJoin(roles, eq(roles.id, userRoles.roleId)).leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id)).where(eq(userRoles.userId, user.id));
  const units = [...new Set(assignments.map(row => row.unit))];
  const unit = process.env.AUTH_BUSINESS_UNIT_ID ?? (units.length === 1 ? units[0] : undefined);
  if (!unit || !units.includes(unit)) throw new AuthError(403, "FORBIDDEN", "No access to this administration portal.");
  const scoped = assignments.filter(row => row.unit === unit);
  return {
    user: { id: user.id, name: user.name, email: user.email, mustChangePassword: user.mustChangePassword },
    businessUnitId: unit,
    roles: [...new Set(scoped.map(row => row.role))],
    permissions: [...new Set(scoped.flatMap(row => row.permission ? [row.permission] : []))],
  };
}
export async function requireSession() {
  return identityForToken((await cookies()).get(sessionCookieName)?.value);
}
export async function requirePermission(permission: string) {
  const identity = await requireSession();
  if (identity.user.mustChangePassword) throw new AuthError(403, "PASSWORD_CHANGE_REQUIRED", "Change your password first.");
  if (!identity.permissions.includes(permission)) throw new AuthError(403, "FORBIDDEN", "You do not have permission for this action.");
  return identity;
}
