# SAASMARTWORKS

The SAASMARTWORKS platform is a single Next.js application for the company's public Services experience and its future central administration system. The project is being built as a modular monolith, with shared infrastructure designed to support multiple business units over time.

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
- Drizzle ORM with SQLite through libSQL for the initial local database
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
npm run db:seed
npm run dev
```

Open <http://localhost:3000> for Services and <http://localhost:3000/admin> for Admin.

The database defaults to `file:./local.db` when `DATABASE_URL` is not set. If your existing `.env` sets `DATABASE_URL` to another database, preserve its other values and deliberately set only `DATABASE_URL=file:./local.db` for local SQLite development. Do not overwrite an existing `.env` with `.env.example`; the example is a reference, and existing provider credentials must remain private. The generated local database file is ignored by Git.

On Windows PowerShell, use `npm.cmd` if script execution policy prevents running `npm` commands. See [docs/SETUP.md](docs/SETUP.md) for additional environment and project-structure notes.

## Database Workflow

The current schema and database client live in `src/db/`. SQL migration history is generated into `drizzle/` and should be committed; the local SQLite database file should not be committed.

```sh
npm run db:generate
npm run db:migrate
npm run db:seed
```

Update the Drizzle schema before generating migrations. The current migration and seed cover business units and service categories only. Seeding is repeatable and does not create users, clients, or credentials.

SQLite file storage is for local development and is not durable production storage on Vercel. Production persistence and migration operations need a deliberate storage and deployment decision. Existing MongoDB/Atlas configuration is not used by this adapter; switching to MongoDB requires a separate migration, not just an environment-variable change.

## Available Scripts

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `npm run dev`         | Start the Next.js development server                     |
| `npm run build`       | Create a production build                                |
| `npm run start`       | Serve a production build                                 |
| `npm run typecheck`   | Run TypeScript without emitting files                    |
| `npm run lint`        | Run ESLint                                               |
| `npm run db:generate` | Generate SQL migrations from the schema                  |
| `npm run db:migrate`  | Apply migrations to the configured database              |
| `npm run db:seed`     | Insert the starter business units and service categories |

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

The database currently contains business units and service categories. Contacts, clients, inquiries, authentication and role-based access, email, file storage, and operational Admin modules remain future work. Service and Eatery integrations are not activated by adding environment variables alone. The project does not yet have a production database configuration.

Read [docs/DECISIONS.md](docs/DECISIONS.md) for current owner-approved decisions and [architecture.md](architecture.md) for broader architectural context. Where the older architecture document conflicts with current decisions, `docs/DECISIONS.md` and the repository instructions take precedence.
