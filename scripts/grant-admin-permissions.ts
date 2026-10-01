import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { permissionCatalogue } from "../src/lib/auth/permissions";

async function main() {
  loadEnvConfig(process.cwd());
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("Database connection is not configured.");
  const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10 });
  try {
    await sql.begin(async tx => {
      const admins = await tx`select id from roles where name = 'Admin' for update`;
      if (admins.length !== 1) throw new Error("Expected exactly one existing Admin role.");
      for (const permission of permissionCatalogue) {
        await tx`insert into permissions (id, description) values (${permission.id}, ${permission.description}) on conflict (id) do nothing`;
        await tx`insert into role_permissions (role_id, permission_id) values (${admins[0].id}, ${permission.id}) on conflict (role_id, permission_id) do nothing`;
      }
      const grants = await tx`select permission_id from role_permissions where role_id = ${admins[0].id}`;
      if (!permissionCatalogue.every(item => grants.some(grant => grant.permission_id === item.id))) throw new Error("Admin permission assignment incomplete.");
    });
    console.log(`Applied ${permissionCatalogue.length} Admin grants transactionally. Other role assignments unchanged.`);
  } finally { await sql.end({ timeout: 2 }); }
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Permission update failed."); process.exitCode = 1; });
