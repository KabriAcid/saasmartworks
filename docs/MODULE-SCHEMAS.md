# Module Schemas

The executable Zod contracts for these modules live in `src/validation/module-schemas.ts`, while the shared TypeScript interfaces live in `src/types/modules.ts`. This document explains how those contracts map to persistence. Zod validates application data; it does not generate SQL migrations. The Drizzle definitions in `src/db/schema.ts` remain the migration source.

## Status

- `business_units` and `service_categories` are implemented in `src/db/schema.ts`.
- The service catalog currently uses seeded categories and in-code capability lists. Service records are not yet persisted.
- Contact and inquiry forms are presentation-only. Their tables are planned but not implemented.
- Navigation, shared UI, and admin shell are presentation modules with no direct tables.

Use the exported Zod schemas and inferred types for seed data, form parsing, and repository boundaries. When a planned table is approved, add its Drizzle table beside the corresponding Zod contract and generate a migration.

## Core And Services

### `business_units` — implemented

| Column   | Type    | Rules                         |
| -------- | ------- | ----------------------------- |
| `id`     | text    | Primary key                   |
| `slug`   | text    | Required, unique              |
| `name`   | text    | Required                      |
| `active` | boolean | Required, defaults to `false` |

### `service_categories` — implemented

| Column             | Type | Rules                                       |
| ------------------ | ---- | ------------------------------------------- |
| `id`               | text | Primary key                                 |
| `business_unit_id` | text | Required foreign key to `business_units.id` |
| `slug`             | text | Required, unique                            |
| `name`             | text | Required                                    |

### `services` — planned

A persisted service catalog record should replace capability-only presentation data.

| Column        | Type      | Rules                                           |
| ------------- | --------- | ----------------------------------------------- |
| `id`          | text      | Primary key                                     |
| `category_id` | text      | Required foreign key to `service_categories.id` |
| `slug`        | text      | Required, unique within a category              |
| `name`        | text      | Required                                        |
| `description` | text      | Required                                        |
| `active`      | boolean   | Required, defaults to `true`                    |
| `sort_order`  | integer   | Required, defaults to `0`                       |
| `created_at`  | timestamp | Required                                        |
| `updated_at`  | timestamp | Required                                        |

## Contacts And Inquiries

Contacts and clients are different concepts. An inquiry creates or references a contact; it does not automatically create a client.

### `contacts` — planned

| Column         | Type      | Rules             |
| -------------- | --------- | ----------------- |
| `id`           | text      | Primary key       |
| `name`         | text      | Required          |
| `email`        | text      | Required, indexed |
| `phone`        | text      | Optional          |
| `organization` | text      | Optional          |
| `created_at`   | timestamp | Required          |
| `updated_at`   | timestamp | Required          |

### `inquiries` — planned

| Column             | Type      | Rules                                                                   |
| ------------------ | --------- | ----------------------------------------------------------------------- |
| `id`               | text      | Primary key                                                             |
| `reference`        | text      | Required, unique, user-facing reference                                 |
| `contact_id`       | text      | Required foreign key to `contacts.id`                                   |
| `business_unit_id` | text      | Required foreign key to `business_units.id`                             |
| `category_id`      | text      | Required foreign key to `service_categories.id`                         |
| `service_id`       | text      | Optional foreign key to `services.id`                                   |
| `subject`          | text      | Required                                                                |
| `status`           | text      | Required enum: `NEW`, `OPEN`, `AWAITING_CUSTOMER`, `RESOLVED`, `CLOSED` |
| `assigned_to`      | text      | Optional future foreign key to an admin user                            |
| `created_at`       | timestamp | Required                                                                |
| `updated_at`       | timestamp | Required                                                                |

Recommended indexes: `reference`, `contact_id`, `status`, `assigned_to`, and `created_at`.

### `inquiry_messages` — planned

| Column                  | Type      | Rules                                                        |
| ----------------------- | --------- | ------------------------------------------------------------ |
| `id`                    | text      | Primary key                                                  |
| `inquiry_id`            | text      | Required foreign key to `inquiries.id`                       |
| `author_type`           | text      | Required enum: `CONTACT`, `STAFF`                            |
| `author_id`             | text      | Optional reference to the author record                      |
| `body`                  | text      | Required                                                     |
| `email_delivery_status` | text      | Required enum: `PENDING`, `SENT`, `FAILED`, `NOT_APPLICABLE` |
| `created_at`            | timestamp | Required                                                     |

## Form Contract

The current inquiry form field names are defined by `src/validation/inquiry.ts`:

- `name`
- `email`
- `phone` (optional)
- `organization` (optional)
- `categoryId`
- `serviceId`
- `subject`
- `message`

The `message` field belongs in `inquiry_messages` when the inquiry workflow is implemented; it should not be discarded after submission.

## Presentation-Only Modules

The following modules do not need database tables:

- Shared navigation and glass navbar
- Shared footer and layout shell
- Loading, error, and not-found states
- Public page presentation components
- Admin route shell before authentication and authorization exist
