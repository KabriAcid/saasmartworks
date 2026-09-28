# SA'A SMART WORKS Platform Plan

## Product Direction

Build one multi-business platform for SA'A SMART WORKS and SA'A SMART EATERY. Keep each business unit's dashboard, records, and permissions scoped so users see only the operations they are authorized to access. Start with the existing single Next.js application; subdomain routing is a later deployment step, not a prerequisite for unit separation.

## Phase 1: Platform Foundation

- Confirm the Supabase PostgreSQL schema and migration state before changing hosted data.
- Add business-unit and branch/location context to admin navigation and data access.
- Define and enforce platform-level versus unit-level roles and permissions on the server.
- Support Super Admin, SA'A SMART WORKS Admin, Eatery Manager, cashier, kitchen staff, storekeeper, delivery staff, and employee access scopes.
- Complete account management: staff accounts, role assignment, account status, password-change flow, and audit events.
- Keep the admin portal at `/admin`; defer `admin.` and `eatery.` subdomains until host routing and deployment are configured.

## Phase 2: Main Admin Dashboard

- Add a business-unit selector for SA'A SMART WORKS and SA'A SMART EATERY.
- Show a unit-scoped overview with only metrics available to the signed-in user's permissions.
- Provide separate staff, user account, role/permission, department, and branch/location management.
- Build GPS attendance with explicit device-location permission, configured branch geofences, server-side validation, attendance history, and audit records. Treat browser coordinates as untrusted input; do not use GPS as the sole proof of identity or attendance.
- Replace placeholder navigation and dashboard data with implemented, authorized destinations.

## Phase 3: SA'A SMART WORKS Operations

- Manage public services and service categories.
- Add customers/clients, vendors, procurement, finance, documents, and tasks.
- Add unit-scoped reports, notifications, approvals, and audit-log views.
- Enforce permission checks in server actions and data queries, not only in navigation or route guards.

## Phase 4: SA'A SMART EATERY Operations

- Food catalogue: categories, menu items, prices, availability, add-ons, variations, images, and descriptions.
- Orders: online, walk-in, phone, and WhatsApp channels; order history and pending, preparing, ready, delivered, and cancelled states.
- Sales and POS: payment methods, discounts, refunds, receipts, and end-of-day reconciliation.
- Inventory: ingredients and finished goods, stock movements, wastage, expiry, low-stock alerts, and valuation.
- Kitchen: order queue, preparation status, and preparation times.
- Delivery: personnel, addresses, charges, assignment, status, and tracking.
- Customers: profiles, order history, feedback, spending, and loyalty/rewards.
- Staff: roles, shifts, attendance, and performance.
- Reports: sales, products, food cost, expenses, margins, inventory usage, wastage, orders, and staff performance.
- Keep Eatery operations and financial records inaccessible to SA'A SMART WORKS-only roles unless explicitly granted.

## Phase 5: Deployment and Hardening

- Configure `admin.saasmartworks.com` and `eatery.saasmartworks.com` only after application routing, cookie/session behavior, and deployment are deliberately designed for subdomains.
- Add operational monitoring, backup/recovery, retention, and privacy policies for employee location and business data.
- Test tenant isolation, role boundaries, authentication, audit trails, financial reconciliation, and failure/recovery paths before production launch.

## Current State and Constraints

- The repository is one Next.js App Router application using Supabase PostgreSQL through Drizzle.
- `/admin` is the only admin page. Sidebar destinations for users, attendance, services, and categories are planned and do not yet have pages.
- The schema has business units and user-role assignments, but no complete branch, attendance, GPS, Eatery catalogue, order, POS, or inventory model.
- Login uses a signed session and the admin guard checks active status and a role assignment. Fine-grained permission enforcement, distributed login rate limiting, and forced password changes remain incomplete.
- The existing dashboard is a starter experience. Do not represent unimplemented metrics or integrations as live data.
- Preserve one application, one root `package.json`, components under `src/components/`, server-side validation/authorization, and server-only database credentials.