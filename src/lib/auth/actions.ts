"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { openDatabase } from "@/db/client";
import { roles, users, userRoles } from "@/db/schema";
import { verifyPassword, hashPassword } from "@/lib/passwords";
import { sessionCookieName, signSession } from "@/lib/auth/session";
import { loginSchema } from "@/validation/login";
import { isMockAuthEnabled, matchesMockCredentials } from "./mock";

export type LoginState = { message: string | null };
let dummyPasswordHash: Promise<string> | undefined;

function getDummyPasswordHash() {
	return (dummyPasswordHash ??= hashPassword(randomBytes(32).toString("hex")));
}

export async function login(
	_previousState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});
	if (!parsed.success) {
		return { message: "Enter a valid email address and password." };
	}

	if (isMockAuthEnabled()) {
		if (!matchesMockCredentials(parsed.data.email, parsed.data.password)) {
			return { message: "Invalid demo email or password." };
		}
		redirect("/admin");
	}

	let token: string;
	try {
		const { db } = openDatabase();
		const [user] = await db
			.select({
				id: users.id,
				passwordHash: users.passwordHash,
				status: users.status,
			})
			.from(users)
			.innerJoin(userRoles, eq(userRoles.userId, users.id))
			.innerJoin(roles, eq(roles.id, userRoles.roleId))
			.where(and(eq(users.email, parsed.data.email), eq(roles.name, "Admin")))
			.limit(1);

		const passwordMatches = await verifyPassword(
			parsed.data.password,
			user?.passwordHash ?? (await getDummyPasswordHash()),
		);
		if (!user || user.status !== "ACTIVE" || !passwordMatches) {
			return { message: "Invalid email or password." };
		}
		token = await signSession(user.id);
	} catch {
		return { message: "Sign-in is temporarily unavailable. Please try again." };
	}

	(await cookies()).set(sessionCookieName, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 8 * 60 * 60,
	});
	redirect("/admin");
}

export async function logout() {
	(await cookies()).delete(sessionCookieName);
	redirect("/login");
}
