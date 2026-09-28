import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { databaseEnvironment } from "@/config/env";
import * as schema from "./schema";

function createDatabase() {
	const env = databaseEnvironment();
	const client = postgres(env.DATABASE_URL, { prepare: false });
	return { client, db: drizzle(client, { schema }) };
}

let database: ReturnType<typeof createDatabase> | undefined;

export function openDatabase() {
	database ??= createDatabase();
	return database;
}
