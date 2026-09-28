import { z } from "zod";

export function databaseEnvironment() {
	const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
	const parsed = z
		.object({ DATABASE_URL: z.string().url() })
		.safeParse({ DATABASE_URL: url });
	if (!parsed.success)
		throw new Error(
			"Set POSTGRES_URL to a valid Supabase PostgreSQL connection URL.",
		);
	const value = parsed.data;
	if (!/^postgres(ql)?:\/\//i.test(value.DATABASE_URL))
		throw new Error("POSTGRES_URL must use the PostgreSQL protocol.");
	return value;
}

export function supabaseEnvironment() {
	return {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
		anonKey:
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
			process.env.SUPABASE_ANON_KEY ||
			"",
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	};
}
