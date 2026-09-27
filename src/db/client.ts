import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { databaseEnvironment } from '../config/env';
import * as schema from './schema';

export function openDatabase() {
  const env = databaseEnvironment();
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN || undefined,
  });
  return { client, db: drizzle(client, { schema }) };
}
