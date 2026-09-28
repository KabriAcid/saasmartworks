import { sql } from 'drizzle-orm';
import { check, integer, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const id = () => text('id').primaryKey();
export const timestamps = () => ({
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`).$onUpdate(() => new Date()),
});
export const demo = () => integer('is_demo', { mode: 'boolean' }).notNull().default(false);
export function enumCheck(name: string, column: AnySQLiteColumn, values: readonly string[]) {
  return check(name, sql`${column} in (${sql.join(values.map(value => sql`${sql.raw("'" + value.replaceAll("'", "''") + "'")}`), sql`, `)})`);
}
export function nonnegative(name: string, column: AnySQLiteColumn) {
  return check(name, sql`typeof(${column}) = 'integer' and ${column} >= 0 and ${column} <= 9007199254740991`);
}
