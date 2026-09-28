# Non-Eatery Database Modules

Implemented 2026-09-28. Drizzle definitions under src/db/schema/ are the persistence source of truth, exported through src/db/schema.ts. The first migration remains unchanged; 0001_non_eatery_modules adds the new tables and indexes without deleting existing data.

## Model groups

| Group | Tables |
| --- | --- |
| Organization and access | business_units, users, roles, permissions, role_permissions, user_roles, employees |
| Catalog and relationships | service_categories, services, contacts, clients |
| Inquiries | inquiries, inquiry_messages, inquiry_assignments |
| Operations | projects, training_sessions, training_participants, printing_jobs |
| Finance | quotations, quotation_items, invoices, invoice_items, payments, expenses |
| Shared infrastructure | files, notifications, settings, audit_logs |

28 application tables. Eatery has one inactive business-unit record only: no menu, orders, customers, wallets, or payment-provider tables. Users are staff identities. User-role grants are scoped to a business unit; the demo accounts receive Services access only. Employee records may link to a staff login but are a separate employment concept.

## Contracts and integrity

- src/types/modules.ts derives selected/inserted record types from Drizzle; database nullability is explicit. Use PublicUser when returning staff data; never serialize passwordHash.
- src/validation/module-schemas.ts derives internal record/insert schemas with drizzle-zod. These are internal persistence contracts, not unrestricted API request schemas or authorization.
- Public inquiry validation stays in src/validation/inquiry-input.ts; src/validation/inquiry.ts retains its existing exports. Nullable database columns differ deliberately from optional form fields.
- Inquiry message authors now use contactAuthorId or staffAuthorId, with a database check requiring exactly the matching author. The old polymorphic authorId is replaced with real foreign keys.
- Categories keep the original consultancy/digital/printing IDs. Service identifiers are stable, category-prefixed IDs. Existing public presentation slugs are not silently renamed; the static catalog still needs wiring to these records.
- Contacts are shared communication identities, not automatically Clients. Clients are unit-scoped relationships with uniqueness per contact/unit. Contact emails are indexed, not used to silently merge people.
- Composite foreign keys prevent linking an inquiry to another unit's category or a service from another category. Client ownership constrains projects, quotations, invoices and printing jobs. Payments must match their invoice's unit and currency.
- Database checks enforce status enums, valid author combinations, nonnegative integer amounts, positive item quantities, document arithmetic, and date ordering. Foreign keys default to restrictive deletion.
- createdAt/updatedAt are millisecond timestamps mapped to Date by Drizzle. updatedAt refreshes on Drizzle updates; raw SQL writers must update it explicitly.
- Operational demo records carry isDemo, with stable demo IDs and DEMO references. Child/join rows inherit demo context from parents. All contact addresses use reserved example domains.

## Financial model

Amounts are integer minor units with currency on financial documents and movements. The seed uses NGN: 100 minor units per naira. Line items snapshot their descriptions and prices. Header totals satisfy subtotal - discount + tax; item totals satisfy quantity * unit price. Integer quantities are the initial assumption; fractional billing units require a deliberate schema change.

Invoice status is DRAFT, ISSUED or VOID. Paid/outstanding state should be derived from confirmed payments, not maintained as a second conflicting balance. Sample invoice: NGN 150,000; confirmed payment: NGN 50,000; outstanding: NGN 100,000. Sample paid expense: NGN 12,500. No real money moved and no bank/provider calls were made.

Before adding mutation endpoints, enforce invoice line/header reconciliation, overpayment policy, issued-document immutability, valid status transitions, project/client consistency, transactional payment recording, and audit append-only behavior in domain services. Current schema checks do not implement those workflows or a general accounting ledger. Refunds/corrections require a specified reversal model; do not rewrite financial history to simulate them. No Eatery wallets are implemented.

## Seed accounts

| Email | Sample role | Unit |
| --- | --- | --- |
| admin@saa.example | Demo Administrator | Professional Services |
| manager@saa.example | Demo Services Manager | Professional Services |
| finance@saa.example | Demo Finance Officer | Professional Services |

Passwords come only from SEED_PASSWORD. Hashes use Node scrypt with a random 16-byte salt, N=131072, r=8, p=1 and a 64-byte derived key. Verification uses timingSafeEqual. Each account has mustChangePassword=true. Repeat seeds never reset passwords or grant additional roles beyond the defined sample grants. No sessions or authentication endpoints are implemented by these records; the existing login screen is still a prototype.

The role matrix is sample configuration, not a final staff policy. The sample Administrator has all seeded Services permissions; manager covers service operations; finance covers finance modules. A real staff account and finalized role policy should replace shared demo access before launch.

## Shared capabilities

Files stores metadata and optional owner links. The sample file is PENDING with zero bytes; it is not a real uploaded/downloadable document. No storage provider is configured. Seed inquiry replies are NOT_APPLICABLE for email delivery; seeding cannot send emails. Audit records must not hold passwords or credentials. Settings must not become a secret store. Notification URLs identify future routes and are not proof those screens exist.

## Running and verifying

Root `.env` is loaded without logging values. Application queries use `POSTGRES_URL`; Drizzle migrations prefer `POSTGRES_URL_NON_POOLING` and fall back to `POSTGRES_URL`.

- npm run db:generate: generate migration files from the schema.
- npm run db:migrate: apply migration history to the selected database.
- npm run db:seed: insert catalog and fictional sample records; requires SEED_PASSWORD.
- npm run db:verify: read-only counts, integrity checks, invoice-line reconciliation and dashboard queries.
- A database test workflow must use an isolated PostgreSQL database/schema and must never reset or drop the hosted Supabase project. Requires `SEED_PASSWORD` where applicable.

Do not reset or drop the hosted database to reproduce a seed. Use reviewed migrations. Seeds must run inside a transaction and skip existing keys, preserving edits. No default password is embedded in source or the environment example.

src/db/queries/dashboard.ts supplies unit-filtered query results for future Admin integration. It is an internal repository function, not an exposed endpoint: callers must establish the actor and enforce server-side permissions. Do not connect sensitive data to the unprotected /admin route.

During the agent session, the Windows sandbox could not execute tsx's OS-user lookup. Verification used a temporary TypeScript transpiler and Drizzle's migration-generation API; normal npm scripts remain standard for the developer environment.
