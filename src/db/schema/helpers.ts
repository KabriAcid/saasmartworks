import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	check,
	text,
	type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const id = () => text("id").primaryKey();
export const timestamps = () => ({
	createdAt: bigint("created_at", { mode: "number" })
		.notNull()
		.default(sql`(extract(epoch from now()) * 1000)::bigint`),
	updatedAt: bigint("updated_at", { mode: "number" })
		.notNull()
		.default(sql`(extract(epoch from now()) * 1000)::bigint`)
		.$onUpdate(() => Date.now()),
});
export const demo = () => boolean("is_demo").notNull().default(false);
export function enumCheck(
	name: string,
	column: AnyPgColumn,
	values: readonly string[],
) {
	return check(
		name,
		sql`${column} in (${sql.join(
			values.map(
				(value) => sql`${sql.raw("'" + value.replaceAll("'", "''") + "'")}`,
			),
			sql`, `,
		)})`,
	);
}
export function nonnegative(name: string, column: AnyPgColumn) {
	return check(name, sql`${column} >= 0 and ${column} <= 9007199254740991`);
}
