import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, foreignKey, check } from 'drizzle-orm/sqlite-core';
import { id, timestamps, demo, enumCheck, nonnegative } from './helpers';
import { businessUnits, users } from './core';
import { clients, contacts } from './services';

export const projects = sqliteTable('projects', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), clientId: text('client_id').notNull(),
  reference: text('reference').notNull().unique(), name: text('name').notNull(), description: text('description').notNull(),
  managerId: text('manager_id').references(() => users.id),
  status: text('status', { enum: ['PLANNED','ACTIVE','COMPLETED','CANCELLED'] }).notNull().default('PLANNED'),
  startDate: integer('start_date',{mode:'timestamp_ms'}), endDate: integer('end_date',{mode:'timestamp_ms'}),
  isDemo: demo(), ...timestamps(),
}, t => [foreignKey({ columns:[t.clientId,t.businessUnitId], foreignColumns:[clients.id,clients.businessUnitId] }),
  uniqueIndex('projects_id_unit_unique').on(t.id,t.businessUnitId), index('projects_unit_status_idx').on(t.businessUnitId,t.status),
  enumCheck('project_status_check',t.status,['PLANNED','ACTIVE','COMPLETED','CANCELLED']), check('project_dates_check',sql`${t.endDate} is null or ${t.startDate} is null or ${t.endDate} >= ${t.startDate}`)]);
export const trainingSessions = sqliteTable('training_sessions', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), clientId: text('client_id'),
  projectId: text('project_id'), title: text('title').notNull(), theme: text('theme').notNull(), venue: text('venue'),
  facilitatorId: text('facilitator_id').references(() => users.id), startDate: integer('start_date',{mode:'timestamp_ms'}).notNull(), endDate: integer('end_date',{mode:'timestamp_ms'}).notNull(),
  status: text('status',{enum:['PLANNED','IN_PROGRESS','COMPLETED','CANCELLED']}).notNull().default('PLANNED'),
  isDemo: demo(), ...timestamps(),
}, t => [foreignKey({columns:[t.clientId,t.businessUnitId],foreignColumns:[clients.id,clients.businessUnitId]}), foreignKey({columns:[t.projectId,t.businessUnitId],foreignColumns:[projects.id,projects.businessUnitId]}),
  index('training_unit_date_idx').on(t.businessUnitId,t.startDate), enumCheck('training_status_check',t.status,['PLANNED','IN_PROGRESS','COMPLETED','CANCELLED']), check('training_dates_check',sql`${t.endDate} >= ${t.startDate}`)]);
export const trainingParticipants = sqliteTable('training_participants', {
  trainingId: text('training_id').notNull().references(() => trainingSessions.id), contactId: text('contact_id').notNull().references(() => contacts.id),
  attendance: text('attendance',{enum:['REGISTERED','ATTENDED','ABSENT']}).notNull().default('REGISTERED'),
}, t => [primaryKey({columns:[t.trainingId,t.contactId]}), enumCheck('attendance_check',t.attendance,['REGISTERED','ATTENDED','ABSENT'])]);
export const printingJobs = sqliteTable('printing_jobs', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), clientId: text('client_id').notNull(),
  reference: text('reference').notNull().unique(), title: text('title').notNull(), specifications: text('specifications').notNull(), quantity: integer('quantity').notNull(),
  assignedTo: text('assigned_to').references(() => users.id), dueAt: integer('due_at',{mode:'timestamp_ms'}),
  status: text('status',{enum:['QUEUED','IN_PROGRESS','READY','DELIVERED','CANCELLED']}).notNull().default('QUEUED'),
  isDemo: demo(), ...timestamps(),
}, t => [foreignKey({columns:[t.clientId,t.businessUnitId],foreignColumns:[clients.id,clients.businessUnitId]}),
  index('printing_unit_status_idx').on(t.businessUnitId,t.status), enumCheck('printing_status_check',t.status,['QUEUED','IN_PROGRESS','READY','DELIVERED','CANCELLED']),
  nonnegative('printing_quantity_integer',t.quantity), check('printing_quantity_positive',sql`${t.quantity} > 0`)]);
