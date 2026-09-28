import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, foreignKey, check } from 'drizzle-orm/sqlite-core';
import { id, timestamps, demo, enumCheck, nonnegative } from './helpers';
import { businessUnits, users } from './core';

export const serviceCategories = sqliteTable('service_categories', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id),
  slug: text('slug').notNull().unique(), name: text('name').notNull(),
}, t => [uniqueIndex('categories_id_unit_unique').on(t.id, t.businessUnitId)]);
export const services = sqliteTable('services', {
  id: id(), categoryId: text('category_id').notNull().references(() => serviceCategories.id),
  slug: text('slug').notNull(), name: text('name').notNull(), description: text('description').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true), sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps(),
}, t => [uniqueIndex('services_category_slug_unique').on(t.categoryId, t.slug), uniqueIndex('services_id_category_unique').on(t.id, t.categoryId), nonnegative('services_sort_order_check', t.sortOrder)]);
export const contacts = sqliteTable('contacts', {
  id: id(), name: text('name').notNull(), email: text('email').notNull(), phone: text('phone'), organization: text('organization'),
  isDemo: demo(), ...timestamps(),
}, t => [index('contacts_email_idx').on(t.email)]);
export const clients = sqliteTable('clients', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id),
  contactId: text('contact_id').notNull().references(() => contacts.id), reference: text('reference').notNull().unique(),
  status: text('status', { enum: ['ACTIVE', 'INACTIVE'] }).notNull().default('ACTIVE'),
  notes: text('notes'), isDemo: demo(), ...timestamps(),
}, t => [uniqueIndex('clients_contact_unit_unique').on(t.contactId,t.businessUnitId), uniqueIndex('clients_id_unit_unique').on(t.id,t.businessUnitId), enumCheck('client_status_check',t.status,['ACTIVE','INACTIVE'])]);
export const inquiries = sqliteTable('inquiries', {
  id: id(), reference: text('reference').notNull().unique(), contactId: text('contact_id').notNull().references(() => contacts.id),
  businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), categoryId: text('category_id').notNull(),
  serviceId: text('service_id'), subject: text('subject').notNull(),
  status: text('status', { enum: ['NEW','OPEN','AWAITING_CUSTOMER','RESOLVED','CLOSED'] }).notNull().default('NEW'),
  assignedTo: text('assigned_to').references(() => users.id), isDemo: demo(), ...timestamps(),
}, t => [
  foreignKey({ columns: [t.categoryId,t.businessUnitId], foreignColumns: [serviceCategories.id,serviceCategories.businessUnitId] }),
  foreignKey({ columns: [t.serviceId,t.categoryId], foreignColumns: [services.id,services.categoryId] }),
  index('inquiries_unit_status_date_idx').on(t.businessUnitId,t.status,t.createdAt), index('inquiries_contact_idx').on(t.contactId), index('inquiries_assignee_idx').on(t.assignedTo),
  enumCheck('inquiry_status_check', t.status, ['NEW','OPEN','AWAITING_CUSTOMER','RESOLVED','CLOSED']),
]);
export const inquiryMessages = sqliteTable('inquiry_messages', {
  id: id(), inquiryId: text('inquiry_id').notNull().references(() => inquiries.id),
  authorType: text('author_type', { enum: ['CONTACT','STAFF'] }).notNull(),
  contactAuthorId: text('contact_author_id').references(() => contacts.id), staffAuthorId: text('staff_author_id').references(() => users.id),
  body: text('body').notNull(), emailDeliveryStatus: text('email_delivery_status', { enum: ['PENDING','SENT','FAILED','NOT_APPLICABLE'] }).notNull().default('NOT_APPLICABLE'),
  isDemo: demo(), ...timestamps(),
}, t => [index('messages_inquiry_date_idx').on(t.inquiryId,t.createdAt),
  check('message_author_check', sql`(${t.authorType} = 'CONTACT' and ${t.contactAuthorId} is not null and ${t.staffAuthorId} is null) or (${t.authorType} = 'STAFF' and ${t.staffAuthorId} is not null and ${t.contactAuthorId} is null)`),
  enumCheck('message_delivery_check',t.emailDeliveryStatus,['PENDING','SENT','FAILED','NOT_APPLICABLE']),
]);
export const inquiryAssignments = sqliteTable('inquiry_assignments', {
  id: id(), inquiryId: text('inquiry_id').notNull().references(() => inquiries.id),
  assignedTo: text('assigned_to').notNull().references(() => users.id), assignedBy: text('assigned_by').notNull().references(() => users.id),
  ...timestamps(),
});
