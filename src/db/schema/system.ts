import { sql } from "drizzle-orm";
import {
	sqliteTable,
	text,
	integer,
	index,
	uniqueIndex,
	check,
} from "drizzle-orm/sqlite-core";
import { id, timestamps, demo, enumCheck, nonnegative } from "./helpers";
import { businessUnits, users } from "./core";
import { clients, inquiries } from "./services";
import { projects, trainingSessions, printingJobs } from "./operations";
import { invoices, expenses } from "./finance";

export const files = sqliteTable(
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
		sizeBytes: integer("size_bytes").notNull(),
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
			sql`(${t.clientId} is not null)+(${t.inquiryId} is not null)+(${t.projectId} is not null)+(${t.trainingId} is not null)+(${t.printingJobId} is not null)+(${t.invoiceId} is not null)+(${t.expenseId} is not null) <= 1`,
		),
	],
);
export const notifications = sqliteTable(
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
		readAt: integer("read_at", { mode: "timestamp_ms" }),
		isDemo: demo(),
		...timestamps(),
	},
	(t) => [index("notifications_user_unread_idx").on(t.userId, t.readAt)],
);
export const settings = sqliteTable(
	"settings",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		key: text("key").notNull(),
		value: text("value", { mode: "json" }).$type<unknown>().notNull(),
		updatedBy: text("updated_by")
			.notNull()
			.references(() => users.id),
		...timestamps(),
	},
	(t) => [uniqueIndex("settings_unit_key_unique").on(t.businessUnitId, t.key)],
);
export const auditLogs = sqliteTable(
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
		metadata: text("metadata", { mode: "json" }).$type<
			Record<string, unknown>
		>(),
		isDemo: demo(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		index("audit_unit_date_idx").on(t.businessUnitId, t.createdAt),
		index("audit_entity_idx").on(t.entityType, t.entityId),
	],
);
