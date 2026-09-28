import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, foreignKey, check } from 'drizzle-orm/sqlite-core';
import { id, timestamps, demo, enumCheck, nonnegative } from './helpers';
import { businessUnits, users } from './core';
import { clients } from './services';
import { projects } from './operations';

export const quotations = sqliteTable('quotations', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), clientId: text('client_id').notNull(), projectId: text('project_id'),
  reference: text('reference').notNull().unique(), currency: text('currency').notNull().default('NGN'),
  status: text('status',{enum:["DRAFT","SENT","ACCEPTED","DECLINED","EXPIRED"]}).notNull().default('DRAFT'),
  subtotalMinor: integer('subtotal_minor').notNull(), discountMinor: integer('discount_minor').notNull().default(0), taxMinor: integer('tax_minor').notNull().default(0), totalMinor: integer('total_minor').notNull(),
  
  dueAt: integer('due_at',{mode:'timestamp_ms'}), isDemo: demo(), ...timestamps(),
}, t => [foreignKey({columns:[t.clientId,t.businessUnitId],foreignColumns:[clients.id,clients.businessUnitId]}), foreignKey({columns:[t.projectId,t.businessUnitId],foreignColumns:[projects.id,projects.businessUnitId]}),
  uniqueIndex('quotations_id_unit_currency_unique').on(t.id,t.businessUnitId,t.currency), index('quotations_unit_status_idx').on(t.businessUnitId,t.status),
  enumCheck('quotations_status_check',t.status,["DRAFT","SENT","ACCEPTED","DECLINED","EXPIRED"]), check('quotations_currency_check',sql`length(${t.currency}) = 3 and ${t.currency} = upper(${t.currency})`),
  nonnegative('quotations_subtotal_check',t.subtotalMinor),nonnegative('quotations_discount_check',t.discountMinor),nonnegative('quotations_tax_check',t.taxMinor),nonnegative('quotations_total_check',t.totalMinor),
  check('quotations_calculation_check',sql`${t.discountMinor} <= ${t.subtotalMinor} and ${t.totalMinor} = ${t.subtotalMinor} - ${t.discountMinor} + ${t.taxMinor}`),
]);
export const quotationItems = sqliteTable('quotation_items', {
  id:id(), quotationId:text('quotation_id').notNull().references(()=>quotations.id), description:text('description').notNull(),
  quantity:integer('quantity').notNull(), unitPriceMinor:integer('unit_price_minor').notNull(), totalMinor:integer('total_minor').notNull(),
}, t => [index('quotation_items_parent_idx').on(t.quotationId),nonnegative('quotation_item_price_check',t.unitPriceMinor),nonnegative('quotation_item_total_check',t.totalMinor),
  nonnegative('quotation_item_quantity_check',t.quantity),check('quotation_item_calculation_check',sql`${t.quantity} > 0 and ${t.totalMinor} = ${t.quantity} * ${t.unitPriceMinor}`)]);

export const invoices = sqliteTable('invoices', {
  id: id(), businessUnitId: text('business_unit_id').notNull().references(() => businessUnits.id), clientId: text('client_id').notNull(), projectId: text('project_id'),
  reference: text('reference').notNull().unique(), currency: text('currency').notNull().default('NGN'),
  status: text('status',{enum:["DRAFT","ISSUED","VOID"]}).notNull().default('DRAFT'),
  subtotalMinor: integer('subtotal_minor').notNull(), discountMinor: integer('discount_minor').notNull().default(0), taxMinor: integer('tax_minor').notNull().default(0), totalMinor: integer('total_minor').notNull(),
  quotationId: text('quotation_id').references(() => quotations.id),
  dueAt: integer('due_at',{mode:'timestamp_ms'}), isDemo: demo(), ...timestamps(),
}, t => [foreignKey({columns:[t.clientId,t.businessUnitId],foreignColumns:[clients.id,clients.businessUnitId]}), foreignKey({columns:[t.projectId,t.businessUnitId],foreignColumns:[projects.id,projects.businessUnitId]}),
  uniqueIndex('invoices_id_unit_currency_unique').on(t.id,t.businessUnitId,t.currency), index('invoices_unit_status_idx').on(t.businessUnitId,t.status),
  enumCheck('invoices_status_check',t.status,["DRAFT","ISSUED","VOID"]), check('invoices_currency_check',sql`length(${t.currency}) = 3 and ${t.currency} = upper(${t.currency})`),
  nonnegative('invoices_subtotal_check',t.subtotalMinor),nonnegative('invoices_discount_check',t.discountMinor),nonnegative('invoices_tax_check',t.taxMinor),nonnegative('invoices_total_check',t.totalMinor),
  check('invoices_calculation_check',sql`${t.discountMinor} <= ${t.subtotalMinor} and ${t.totalMinor} = ${t.subtotalMinor} - ${t.discountMinor} + ${t.taxMinor}`),
]);
export const invoiceItems = sqliteTable('invoice_items', {
  id:id(), invoiceId:text('invoice_id').notNull().references(()=>invoices.id), description:text('description').notNull(),
  quantity:integer('quantity').notNull(), unitPriceMinor:integer('unit_price_minor').notNull(), totalMinor:integer('total_minor').notNull(),
}, t => [index('invoice_items_parent_idx').on(t.invoiceId),nonnegative('invoice_item_price_check',t.unitPriceMinor),nonnegative('invoice_item_total_check',t.totalMinor),
  nonnegative('invoice_item_quantity_check',t.quantity),check('invoice_item_calculation_check',sql`${t.quantity} > 0 and ${t.totalMinor} = ${t.quantity} * ${t.unitPriceMinor}`)]);

export const payments = sqliteTable('payments', {
  id:id(), businessUnitId:text('business_unit_id').notNull().references(()=>businessUnits.id), invoiceId:text('invoice_id').notNull(),
  reference:text('reference').notNull().unique(), externalReference:text('external_reference').unique(), currency:text('currency').notNull(), amountMinor:integer('amount_minor').notNull(),
  method:text('method',{enum:['BANK_TRANSFER','CASH','OTHER']}).notNull(), status:text('status',{enum:['PENDING','CONFIRMED','FAILED']}).notNull().default('PENDING'),
  receivedAt:integer('received_at',{mode:'timestamp_ms'}), recordedBy:text('recorded_by').notNull().references(()=>users.id), isDemo:demo(), ...timestamps(),
},t=>[foreignKey({columns:[t.invoiceId,t.businessUnitId,t.currency],foreignColumns:[invoices.id,invoices.businessUnitId,invoices.currency]}),
  index('payments_invoice_idx').on(t.invoiceId),index('payments_unit_date_idx').on(t.businessUnitId,t.receivedAt),nonnegative('payment_amount_check',t.amountMinor),check('payment_amount_positive',sql`${t.amountMinor} > 0`),
  enumCheck('payment_method_check',t.method,['BANK_TRANSFER','CASH','OTHER']),enumCheck('payment_status_check',t.status,['PENDING','CONFIRMED','FAILED'])]);
export const expenses = sqliteTable('expenses', {
  id:id(), businessUnitId:text('business_unit_id').notNull().references(()=>businessUnits.id), projectId:text('project_id'),
  reference:text('reference').notNull().unique(), description:text('description').notNull(), category:text('category').notNull(),
  amountMinor:integer('amount_minor').notNull(),currency:text('currency').notNull().default('NGN'), incurredAt:integer('incurred_at',{mode:'timestamp_ms'}).notNull(),
  status:text('status',{enum:['DRAFT','APPROVED','PAID','REJECTED']}).notNull().default('DRAFT'), recordedBy:text('recorded_by').notNull().references(()=>users.id),
  isDemo:demo(), ...timestamps(),
},t=>[foreignKey({columns:[t.projectId,t.businessUnitId],foreignColumns:[projects.id,projects.businessUnitId]}),index('expenses_unit_date_idx').on(t.businessUnitId,t.incurredAt),nonnegative('expense_amount_check',t.amountMinor),check('expense_amount_positive',sql`${t.amountMinor} > 0`),enumCheck('expense_status_check',t.status,['DRAFT','APPROVED','PAID','REJECTED'])]);
