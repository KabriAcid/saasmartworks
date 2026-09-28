# Current decisions — 2026-09-27

## Single application (supersedes earlier monorepo proposals)

Owner requested one Next.js app, root app/ routes, all UI components under src/components/, one package.json and one configuration. Services is /; Admin is /admin. No workspaces or internal packages. Subdomain routing/deployment is not configured yet.

## Persistence

The owner selected Supabase PostgreSQL accessed through Drizzle. The Postgres schema in `src/db/schema/` is the application contract. Runtime connections use `POSTGRES_URL`; schema migrations prefer `POSTGRES_URL_NON_POOLING`. Do not add alternate database adapters without an explicit owner decision. Existing Atlas credentials remain unused and untouched.

## UI and dependencies

Radix Primitives supports accessible interactions; native inputs and CSS skeletons stay lightweight. No extra theme system. Heroicons remains the icon library. Exact resolved versions and one lockfile. Vercel CLI is a development dependency; no deployment authorized by installation.

## Deferred

Authentication, email, storage, and Billstack providers/contracts are not implemented. Adding future keys alone cannot activate nonexistent integrations. Corporate/Eatery pages, inquiry workflows and full admin modules follow later.

## 2026-09-28: Supabase PostgreSQL

Owner selected Supabase PostgreSQL as the sole database provider. Drizzle uses PostgreSQL table builders and the postgres-js driver. The 28-table model is documented in MODULE-SCHEMAS.md. Eatery remains an inactive unit only. New record types derive from Drizzle; internal Zod contracts derive through drizzle-zod 0.8.3. Passwords use built-in Node scrypt, with no plaintext seed password in source. Changing the adapter does not migrate or reconcile hosted data automatically.
