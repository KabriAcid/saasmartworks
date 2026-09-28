import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

loadEnvConfig(process.cwd());

const target = process.env.DB_TARGET ?? 'auto';
const isSupabase =
	target === 'supabase' ||
	(target === 'auto' && !!process.env.POSTGRES_URL && !process.env.TURSO_DATABASE_URL);

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: isSupabase ? 'postgresql' : 'sqlite',
	dbCredentials: isSupabase
		? { url: process.env.POSTGRES_URL || process.env.SUPABASE_URL || '' }
		: { url: process.env.DATABASE_URL || 'file:./local.db' },
});
