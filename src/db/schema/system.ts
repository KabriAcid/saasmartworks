import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	jsonb,
	pgTable,
	text,
	integer,
	index,
	uniqueIndex,
	check,
} from "drizzle-orm/pg-core";
import { id, timestamps, demo, enumCheck, nonnegative } from "./helpers";
import { businessUnits, users } from "./core";
import { clients, inquiries } from "./services";
import { projects, trainingSessions, printingJobs } from "./operations";
import { invoices, expenses } from "./finance";

export const files = pgTable(
	"files",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		uploadedBy: text("uploaded_by")
			.notNull()
			.references(() => users.id),
		name: text("name").notNull(),
		mimeType: text("mime_type").notNull(),
		sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
		storageKey: text("storage_key").notNull().unique(),
		status: text("status", { enum: ["PENDING", "AVAILABLE", "DELETED"] })
			.notNull()
			.default("PENDING"),
		clientId: text("client_id").references(() => clients.id),
		inquiryId: text("inquiry_id").references(() => inquiries.id),
		projectId: text("project_id").references(() => projects.id),
		trainingId: text("training_id").references(() => trainingSessions.id),
		printingJobId: text("printing_job_id").references(() => printingJobs.id),
		invoiceId: text("invoice_id").references(() => invoices.id),
		expenseId: text("expense_id").references(() => expenses.id),
		isDemo: demo(),
		...timestamps(),
	},
	(t) => [
		index("files_unit_idx").on(t.businessUnitId),
		nonnegative("file_size_check", t.sizeBytes),
		enumCheck("file_status_check", t.status, [
			"PENDING",
			"AVAILABLE",
			"DELETED",
		]),
		check(
			"file_single_owner_check",
			sql`(${t.clientId} is not null)::int + (${t.inquiryId} is not null)::int + (${t.projectId} is not null)::int + (${t.trainingId} is not null)::int + (${t.printingJobId} is not null)::int + (${t.invoiceId} is not null)::int + (${t.expenseId} is not null)::int <= 1`,
		),
	],
);
export const notifications = pgTable(
	"notifications",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		title: text("title").notNull(),
		body: text("body").notNull(),
		href: text("href"),
		readAt: bigint("read_at", { mode: "number" }),
		isDemo: demo(),
		...timestamps(),
	},
	(t) => [index("notifications_user_unread_idx").on(t.userId, t.readAt)],
);
export const settings = pgTable(
	"settings",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		key: text("key").notNull(),
		value: jsonb("value").$type<unknown>().notNull(),
		updatedBy: text("updated_by")
			.notNull()
			.references(() => users.id),
		...timestamps(),
	},
	(t) => [uniqueIndex("settings_unit_key_unique").on(t.businessUnitId, t.key)],
);
export const auditLogs = pgTable(
	"audit_logs",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		actorId: text("actor_id").references(() => users.id),
		action: text("action").notNull(),
		entityType: text("entity_type").notNull(),
		entityId: text("entity_id").notNull(),
		metadata: jsonb("metadata").$type<Record<string, unknown>>(),
		isDemo: demo(),
		createdAt: bigint("created_at", { mode: "number" })
			.notNull()
			.default(sql`(extract(epoch from now()) * 1000)::bigint`),
	},
	(t) => [
		index("audit_unit_date_idx").on(t.businessUnitId, t.createdAt),
		index("audit_entity_idx").on(t.entityType, t.entityId),
	],
);
