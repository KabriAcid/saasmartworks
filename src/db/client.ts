import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { databaseEnvironment } from "@/config/env";
import * as schema from "./schema";

export function openDatabase() {
  const env = databaseEnvironment();
  const client = postgres(env.DATABASE_URL, { prepare: false });
  return { client, db: drizzle(client, { schema }) };
}
