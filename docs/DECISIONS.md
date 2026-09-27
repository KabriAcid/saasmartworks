# Current decisions — 2026-09-27

## Single application (supersedes earlier monorepo proposals)
Owner requested one Next.js app, root app/ routes, all UI components under src/components/, one package.json and one configuration. Services is /; Admin is /admin. No workspaces or internal packages. Subdomain routing/deployment is not configured yet.

## Persistence
Owner allowed Drizzle + SQLite for now. Local libSQL file storage is the initial adapter. Existing Atlas credentials remain unused and untouched. MongoDB requires a deliberate adapter/schema/data migration. A local SQLite file is not durable production storage on Vercel.

## UI and dependencies
Radix Primitives supports accessible interactions; native inputs and CSS skeletons stay lightweight. No extra theme system. Heroicons remains the icon library. Exact resolved versions and one lockfile. Vercel CLI is a development dependency; no deployment authorized by installation.

## Deferred
Authentication, email, storage, and Billstack providers/contracts are not implemented. Adding future keys alone cannot activate nonexistent integrations. Corporate/Eatery pages, inquiry workflows and full admin modules follow later.
