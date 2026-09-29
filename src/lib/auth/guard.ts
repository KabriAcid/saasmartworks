import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openDatabase } from "@/db/client";
import { roles, users, userRoles } from "@/db/schema";
import { sessionCookieName, verifySession } from "./session";
import { isMockAuthEnabled, mockUser } from "./mock";

export async function requireAdminUser() {
	if (isMockAuthEnabled()) return { ...mockUser };
	const token = (await cookies()).get(sessionCookieName)?.value;
	const session = token ? await verifySession(token) : null;
	if (!session?.sub) redirect("/login");

	const { db } = openDatabase();
	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: roles.name,
		})
		.from(users)
		.innerJoin(userRoles, eq(userRoles.userId, users.id))
		.innerJoin(roles, eq(roles.id, userRoles.roleId))
		.where(
			and(
				eq(users.id, session.sub),
				eq(users.status, "ACTIVE"),
				eq(roles.name, "Admin"),
			),
		)
		.limit(1);

	if (!user) redirect("/login");
	return user;
}
