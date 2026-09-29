import { randomUUID, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { openDatabase } from "@/db/client";
import { businessUnits, roles, userRoles, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { sessionCookieName, signSession, verifySession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Temporary registration", robots: { index: false, follow: false } };

const registrationSchema = z.object({
	email: z.string().trim().toLowerCase().pipe(z.email()),
	password: z.string().min(8).refine((value) => Buffer.byteLength(value, "utf8") <= 72),
});

const messages: Record<string, string> = {
	invalid: "Enter a valid email and a password of at least 8 characters (maximum 72 UTF-8 bytes).",
	denied: "Invalid setup key.",
	failed: "Registration failed. Share the diagnostic below so we can identify the cause.",
	exists: "That email already exists. Use the login page; existing accounts are never overwritten.",
};

async function register(formData: FormData) {
	"use server";
	const expected = process.env.TEMP_REGISTER_KEY;
	if (!expected || Buffer.byteLength(expected) < 32) notFound();
	const supplied = formData.get("setupKey");
	const suppliedBytes = Buffer.from(typeof supplied === "string" ? supplied : "");
	const expectedBytes = Buffer.from(expected);
	if (suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) {
		redirect("/register?result=denied");
	}
	const parsed = registrationSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
	if (!parsed.success) redirect("/register?result=invalid");
	const reference = randomUUID();
	let stage = "password hashing";
	let outcome = "failed";
	let diagnosticCode = "APPLICATION_ERROR";
	try {
		const passwordHash = await hashPassword(parsed.data.password);
		if (!(await verifyPassword(parsed.data.password, passwordHash))) throw new Error("Hash verification failed");
		stage = "JWT signing and verification";
		const userId = randomUUID();
		const token = await signSession(userId);
		if ((await verifySession(token))?.sub !== userId) throw new Error("Session verification failed");
		stage = "database connection";
		const { db } = openDatabase();
		await db.transaction(async (tx) => {
			stage = "existing email check";
			const [existing] = await tx.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
			if (existing) { outcome = "exists"; throw new Error("Existing account"); }
			// Required by the legacy FK only; this page introduces no business-unit access logic.
			stage = "required legacy organization record (exactly one record required)";
			const units = await tx.select({ id: businessUnits.id }).from(businessUnits).limit(2);
			if (units.length !== 1) throw new Error("Organization record requires configuration");
			stage = "Admin role creation";
			// Match the existing login and dashboard guard's stored role name.
			await tx.insert(roles).values({ id: randomUUID(), name: "Admin", description: "Full administration access" }).onConflictDoNothing({ target: roles.name });
			const [role] = await tx.select({ id: roles.id }).from(roles).where(eq(roles.name, "Admin")).limit(1);
			if (!role) throw new Error("Admin role unavailable");
			stage = "user creation";
			await tx.insert(users).values({
				id: userId, name: parsed.data.email.split("@")[0], email: parsed.data.email,
				passwordHash, status: "ACTIVE", mustChangePassword: false, isDemo: false,
			});
			stage = "role assignment";
			await tx.insert(userRoles).values({ userId, roleId: role.id, businessUnitId: units[0].id });
		});
		stage = "session cookie (account already committed; use login if this step fails)";
		(await cookies()).set(sessionCookieName, token, {
			httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60,
		});
		console.info("[temporary-register]", { reference, status: "created", redirect: "/admin" });
		outcome = "success";
	} catch (error) {
		// Never log raw DB errors: Drizzle can include SQL parameters, hashes and credentials.
		let code: string | undefined;
		let cause: unknown = error;
		for (let depth = 0; depth < 4 && cause && typeof cause === "object"; depth++) {
			if ("code" in cause && typeof cause.code === "string" && /^[A-Z0-9_]{2,40}$/.test(cause.code)) code = cause.code;
			cause = "cause" in cause ? cause.cause : undefined;
		}
		if (code === "23505" && stage === "user creation") outcome = "exists";
		diagnosticCode = code ?? "APPLICATION_ERROR";
		console.error("[temporary-register]", { reference, stage, code: diagnosticCode, status: outcome });
	}
	const query = new URLSearchParams({ result: outcome, stage, code: diagnosticCode, reference });
	redirect(outcome === "success" ? "/admin" : `/register?${query.toString()}`);
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ result?: string; stage?: string; code?: string; reference?: string }> }) {
	const key = process.env.TEMP_REGISTER_KEY;
	if (!key || Buffer.byteLength(key) < 32) notFound();
	const { result, stage, code, reference } = await searchParams;
	const diagnostic = z.object({
		stage: z.string().max(120),
		code: z.string().regex(/^[A-Z0-9_]{2,40}$/),
		reference: z.uuid(),
	}).safeParse({ stage, code, reference });
	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="register-heading">
				<p className="eyebrow">Temporary diagnostic page</p>
				<h1 id="register-heading">Create an Admin account</h1>
				<form className="auth-form" action={register}>
					<div className="auth-field"><label htmlFor="setup-key">Setup key</label><input id="setup-key" name="setupKey" type="password" autoComplete="off" required /></div>
					<div className="auth-field"><label htmlFor="register-email">Email</label><input id="register-email" name="email" type="email" autoComplete="email" required /></div>
					<div className="auth-field"><label htmlFor="register-password">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div>
					{result && Object.hasOwn(messages, result) && <p className="auth-error" role="alert">{messages[result]}</p>}
					{result === "failed" && diagnostic.success && (
						<div className="break-words text-sm" role="status">
							<p>Failed step: {diagnostic.data.stage}</p>
							<p>Error code: {diagnostic.data.code}</p>
							<p>Reference: {diagnostic.data.reference}</p>
						</div>
					)}
					<button className="button w-full" type="submit">Register and open dashboard</button>
				</form>
			</section>
		</main>
	);
}
