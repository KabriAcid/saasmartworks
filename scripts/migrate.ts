import { loadEnvConfig } from '@next/env';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { openDatabase } from '../src/db/client';
import { applySupabaseSchema } from './supabase-db';

loadEnvConfig(process.cwd());

async function main() {
  const target = process.env.DB_TARGET ?? 'auto';
  if (target === 'supabase' || (target === 'auto' && !!process.env.POSTGRES_URL && !process.env.TURSO_DATABASE_URL)) {
    await applySupabaseSchema();
    console.log('Supabase schema applied.');
    return;
  }

  const { client, db } = openDatabase();
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations applied.');
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error('Migration failed. Check database configuration and migration files.');
  if (error instanceof Error) console.error(error.message);
  process.exitCode = 1;
});
