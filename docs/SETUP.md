# Development guide

Use Node 22.13+ (current environment: Node 24) and npm. Run npm ci with the committed lockfile. Preserve your existing .env; .env.example documents safe configuration. Next.js reads root environment files; database scripts use @next/env. Never prefix secrets with NEXT_PUBLIC_.

## Commands
- npm run dev: one app at http://localhost:3000; Admin at /admin.
- npm run build: production build; npm start: serve it.
- npm run typecheck and npm run lint: source checks.
- npm run db:generate: generate SQL migration history.
- npm run db:migrate: apply migrations to configured database.
- npm run db:seed: add two units and three categories; repeatable and non-overwriting.
- npx vercel --version: check locally installed CLI; no deployment has been performed.

On Windows PowerShell execution-policy restrictions, use npm.cmd rather than changing system security policy.

## Directory ownership
- app/: routing, layout, error/loading conventions, global CSS.
- src/components/: all UI, grouped as ui, shared, services, admin.
- src/config/: environment validation.
- src/db/: server-side database schema and access.
- src/validation/: input schemas.
- src/lib/ and src/types/: focused helpers/types as needed; avoid catch-all files.
- scripts/: migration and seed entry points.
- drizzle/: generated SQL migration history.
- public/: approved static assets; official logo still needed.
- .agents/skills/: project-specific agent guidance.

## Database and environments
Set `POSTGRES_URL` to the Supabase PostgreSQL pooled connection string for application requests. Set `POSTGRES_URL_NON_POOLING` to the direct connection string for Drizzle schema migrations when available. Never prefix database credentials with `NEXT_PUBLIC_`. Preserve existing `.env` values and remove obsolete provider variables only after confirming they are unused.

Drizzle migrations are PostgreSQL-only. The checked-in schema describes the application model; switching the connection does not migrate or reconcile existing hosted tables or data. Review generated migrations against the live schema before applying them.

## UI and remaining work
Radix Primitives powers applicable interactions; Button uses Slot composition. Input and Skeleton are native/CSS shared components, as those are not standalone Radix Primitives. No second theme system is installed.

Public and Admin routes are starter shells. Admin exposes no operational data or actions. Auth/RBAC, inquiries/replies, email, storage, complete schema, and Eatery remain unimplemented. Provider setup may require more than environment keys. Official logo and dark-blue hex remain pending.

## Database update: 2026-09-28
See MODULE-SCHEMAS.md for the 28-table schema and database conventions. Supabase PostgreSQL is the only configured provider. Seed passwords must be supplied through `SEED_PASSWORD` when a seed workflow is available.
