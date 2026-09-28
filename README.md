# SA'A SMART WORKS

The SA'A SMART WORKS platform is a single Next.js application for the company's public Services experience and its future central administration system. The project is being built as a modular monolith, with shared infrastructure designed to support multiple business units over time.

> **Project status:** Initial implementation. The Services and Admin routes are starter experiences; authentication, operational administration, and inquiry workflows are not yet implemented.

## Applications

| Route    | Purpose                         | Status                                    |
| -------- | ------------------------------- | ----------------------------------------- |
| `/`      | Professional & Digital Services | Starter experience                        |
| `/admin` | Central administration          | Starter experience; no operational access |

Customers do not need accounts to use the future Services experience. The platform is intended to support SA'A Eatery later, but Eatery features are not currently implemented.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Drizzle ORM with Supabase PostgreSQL
- Zod for runtime validation
- npm with exact dependency versions and a committed lockfile

## Getting Started

### Requirements

- Node.js 22.13 or newer
- npm

### Install and run

```sh
npm ci
npm run db:migrate
npm run dev
```

Open <http://localhost:3000> for Services and <http://localhost:3000/admin> for Admin.

Set `POSTGRES_URL` to the Supabase PostgreSQL pooled connection string. Set `POSTGRES_URL_NON_POOLING` to the direct connection string for migrations when available. Do not overwrite an existing `.env` with `.env.example`; preserve provider credentials and keep database URLs server-only.

On Windows PowerShell, use `npm.cmd` if script execution policy prevents running `npm` commands. See [docs/SETUP.md](docs/SETUP.md) for additional environment and project-structure notes.

## Database Workflow

The current schema and database client live in `src/db/`. PostgreSQL migration history is generated into `drizzle/` and should be reviewed and committed.

```sh
npm run db:generate
npm run db:migrate
```

Update the Drizzle schema before generating migrations. Existing Supabase data is not modified by changing the adapter; review generated migration SQL against the hosted schema before applying it. No seed command is available unless its script exists in the repository.

## Available Scripts

| Command               | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Start the Next.js development server        |
| `npm run build`       | Create a production build                   |
| `npm run start`       | Serve a production build                    |
| `npm run typecheck`   | Run TypeScript without emitting files       |
| `npm run lint`        | Run ESLint                                  |
| `npm run db:generate` | Generate SQL migrations from the schema     |
| `npm run db:migrate`  | Apply migrations to the configured database |

## Project Structure

```text
app/                 Next.js routes and application-level UI
src/components/      Shared, Services, Admin, and UI components
src/config/          Environment validation
src/db/              Database schema and connection
src/validation/      Input validation schemas
scripts/             Database migration and seed entry points
drizzle/             Generated SQL migrations and metadata
docs/                Setup notes and architectural decisions
```

## Current Scope and Next Work

The schema contains the planned application tables, but Contacts, Clients, inquiries, authentication and role-based access, email, file storage, and operational Admin modules remain future work. Service and Eatery integrations are not activated by adding environment variables alone.

Read [docs/DECISIONS.md](docs/DECISIONS.md) for current owner-approved decisions and [architecture.md](architecture.md) for broader architectural context. Where the older architecture document conflicts with current decisions, `docs/DECISIONS.md` and the repository instructions take precedence.
