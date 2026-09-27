import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const businessUnits = sqliteTable('business_units', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(false),
});

export const serviceCategories = sqliteTable('service_categories', {
  id: text('id').primaryKey(),
  businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});
