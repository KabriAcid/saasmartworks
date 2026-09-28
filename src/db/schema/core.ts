import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
} from "drizzle-orm/pg-core";
import { id, timestamps, demo, enumCheck } from "./helpers";

export const businessUnits = pgTable("business_units", {
	id: id(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	active: boolean("active").notNull().default(false),
});
export const users = pgTable(
	"users",
	{
		id: id(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		passwordHash: text("password_hash").notNull(),
		status: text("status", { enum: ["ACTIVE", "DISABLED"] })
			.notNull()
			.default("ACTIVE"),
		mustChangePassword: boolean("must_change_password").notNull().default(true),
		isDemo: demo(),
		...timestamps(),
	},
	(t) => [
		enumCheck("user_status_check", t.status, ["ACTIVE", "DISABLED"]),
		check("user_email_normalized", sql`${t.email} = lower(trim(${t.email}))`),
	],
);
export const roles = pgTable("roles", {
	id: id(),
	name: text("name").notNull().unique(),
	description: text("description").notNull(),
	...timestamps(),
});
export const permissions = pgTable("permissions", {
	id: id(),
	description: text("description").notNull(),
});
export const rolePermissions = pgTable(
	"role_permissions",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => roles.id),
		permissionId: text("permission_id")
			.notNull()
			.references(() => permissions.id),
	},
	(t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);
export const userRoles = pgTable(
	"user_roles",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		roleId: text("role_id")
			.notNull()
			.references(() => roles.id),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
	},
	(t) => [
		primaryKey({ columns: [t.userId, t.roleId, t.businessUnitId] }),
		index("user_roles_unit_idx").on(t.businessUnitId),
	],
);
export const employees = pgTable(
	"employees",
	{
		id: id(),
		businessUnitId: text("business_unit_id")
			.notNull()
			.references(() => businessUnits.id),
		userId: text("user_id")
			.unique()
			.references(() => users.id),
		employeeNumber: text("employee_number").notNull().unique(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		jobTitle: text("job_title").notNull(),
		status: text("status", { enum: ["ACTIVE", "INACTIVE"] })
			.notNull()
			.default("ACTIVE"),
		isDemo: demo(),
		...timestamps(),
	},
	(t) => [
		index("employees_unit_idx").on(t.businessUnitId),
		enumCheck("employee_status_check", t.status, ["ACTIVE", "INACTIVE"]),
	],
);
