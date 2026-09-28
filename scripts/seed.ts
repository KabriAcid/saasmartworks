import { loadEnvConfig } from "@next/env";
import { seedDatabase } from "./seeds";
import { openDatabase } from "../src/db/client";

loadEnvConfig(process.cwd());
async function main() {
	const password = process.env.SEED_PASSWORD;
	if (!password || password.length < 8)
		throw new Error("SEED_PASSWORD must be supplied via the environment.");
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
main().catch(() => {
	console.error(
		"Seed failed. Check configuration, migration state and SEED_PASSWORD. No credentials were logged.",
	);
	process.exitCode = 1;
});
