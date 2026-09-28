import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openDatabase } from "@/db/client";
import { users, userRoles } from "@/db/schema";
import { sessionCookieName, verifySession } from "./session";

export async function requireAdminUser() {
	const token = (await cookies()).get(sessionCookieName)?.value;
	const session = token ? await verifySession(token) : null;
	if (!session?.sub) redirect("/login");

	const { db } = openDatabase();
	const [user] = await db
		.select({ id: users.id })
		.from(users)
		.innerJoin(userRoles, eq(userRoles.userId, users.id))
		.where(and(eq(users.id, session.sub), eq(users.status, "ACTIVE")))
		.limit(1);

	if (!user) redirect("/login");
	return user;
}
