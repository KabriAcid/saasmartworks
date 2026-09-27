import { loadEnvConfig } from '@next/env';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { openDatabase } from '../src/db/client';

loadEnvConfig(process.cwd());

async function main() {
  const { client, db } = openDatabase();
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations applied.');
  } finally {
    client.close();
  }
}

main().catch(() => {
  console.error('Migration failed. Check database configuration and migration files.');
  process.exitCode = 1;
});
