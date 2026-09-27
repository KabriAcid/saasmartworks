import { z } from 'zod';

const databaseSchema = z.object({
  DATABASE_URL: z.string().min(1).default('file:./local.db'),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});

export function databaseEnvironment() {
  const result = databaseSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error('Invalid database configuration: check DATABASE_URL and DATABASE_AUTH_TOKEN');
  }
  const url = result.data.DATABASE_URL;
  if (!url.startsWith('file:') && !url.startsWith('libsql://') && !url.startsWith('https://')) {
    throw new Error('DATABASE_URL must be a SQLite file or libSQL URL; MongoDB needs a separate adapter.');
  }
  if (process.env.NODE_ENV === 'production' && url.startsWith('file:')) {
    throw new Error('Configure durable remote database storage before production.');
  }
  return result.data;
}
