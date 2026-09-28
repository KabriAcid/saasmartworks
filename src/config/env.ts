import { z } from 'zod';

// Explicit target prevents a local DATABASE_URL from silently masking Turso credentials.
export function databaseEnvironment() {
  const target = process.env.DB_TARGET ?? 'auto';
  if (!['auto','local','turso'].includes(target)) throw new Error('DB_TARGET must be auto, local or turso.');
  const useTurso = target === 'turso' || (target === 'auto' && !!process.env.TURSO_DATABASE_URL);
  const url = useTurso ? process.env.TURSO_DATABASE_URL : (process.env.DATABASE_URL || 'file:./local.db');
  const token = useTurso ? (process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN) : process.env.DATABASE_AUTH_TOKEN;
  const parsed = z.object({DATABASE_URL:z.string().min(1),DATABASE_AUTH_TOKEN:z.string().optional()}).safeParse({DATABASE_URL:url,DATABASE_AUTH_TOKEN:token});
  if (!parsed.success) throw new Error('Missing database configuration for the selected target.');
  const value=parsed.data;
  if (!/^(file:|libsql:\/\/|https:\/\/)/.test(value.DATABASE_URL)) throw new Error('Unsupported database URL scheme.');
  if (target==='local' && !value.DATABASE_URL.startsWith('file:')) throw new Error('Local target requires a file URL.');
  if (useTurso && !value.DATABASE_URL.startsWith('libsql://') && !value.DATABASE_URL.startsWith('https://')) throw new Error('Turso target requires a remote URL.');
  if (!value.DATABASE_URL.startsWith('file:') && !value.DATABASE_AUTH_TOKEN) throw new Error('Remote database token is required.');
  if (process.env.NODE_ENV==='production' && value.DATABASE_URL.startsWith('file:')) throw new Error('Production requires durable remote storage.');
  return value;
}
