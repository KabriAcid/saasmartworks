import { loadEnvConfig } from "@next/env";
import { seedDatabase } from "./seeds";
import { openDatabase } from "../src/db/client";
import { seedSupabaseDatabase } from "./supabase-db";

loadEnvConfig(process.cwd());
async function main() {
	const password = process.env.SEED_PASSWORD;
	if (!password || password.length < 8)
		throw new Error("SEED_PASSWORD must be supplied via the environment.");
	const target = process.env.DB_TARGET ?? "auto";
	if (target === "supabase" || (target === "auto" && !!process.env.POSTGRES_URL && !process.env.TURSO_DATABASE_URL)) {
		await seedSupabaseDatabase(password);
		console.log("Supabase sample records seeded; existing rows were left intact.");
		return;
	}
	const { client, db } = openDatabase();
	try {
		await seedDatabase(db, password);
		console.log(
			"Sample records seeded; existing records/passwords were not overwritten.",
		);
	} finally {
		client.close();
	}
}
main().catch((error) => {
	console.error(
		"Seed failed. Check configuration, migration state and SEED_PASSWORD. No credentials were logged.",
	);
	if (error instanceof Error) console.error(error.message);
	process.exitCode = 1;
});
