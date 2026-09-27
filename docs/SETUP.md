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
DATABASE_URL=file:./local.db is the local SQLite default when the variable is absent. Do not replace an existing MongoDB DATABASE_URL silently: the validator rejects incompatible URLs. Atlas keys remain preserved for later decisions. DATABASE_AUTH_TOKEN is used only for a configured remote libSQL connection.

Migrations and seeds currently cover business units and categories only, not the complete business schema. Seeds do not create fake clients or admin passwords. Local SQLite files are not durable Vercel production storage. Remote storage and production migration policy require a separate decision.

## UI and remaining work
Radix Primitives powers applicable interactions; Button uses Slot composition. Input and Skeleton are native/CSS shared components, as those are not standalone Radix Primitives. No second theme system is installed.

Public and Admin routes are starter shells. Admin exposes no operational data or actions. Auth/RBAC, inquiries/replies, email, storage, complete schema, and Eatery remain unimplemented. Provider setup may require more than environment keys. Official logo and dark-blue hex remain pending.
