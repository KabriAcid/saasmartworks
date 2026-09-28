# SA'A SMART WORKS - Codebase Context

> **Audience:** Developers, GitHub Copilot, coding agents, and future
> maintainers\
> **Last updated:** 28 September 2026\
> **Purpose:** Fast technical orientation before modifying the
> repository.

## 1. Current Product

This repository is for **SA'A SMART WORKS**, not SA'A SMART EATERY.

It contains:

-   The public SA'A SMART WORKS services website.
-   The protected SA'A SMART WORKS administration portal.

Expected production surfaces:

``` text
saasmartworks.com
admin.saasmartworks.com
```

Eatery is a separate project. Ignore old Eatery/multi-business
assumptions when working here.

## 2. Stack

``` text
Framework:       Next.js 16.3.6 App Router
UI Runtime:      React 19.3.0
Language:        TypeScript 6.0.3
Runtime:         Node >=22.13
Styling:         Tailwind CSS 4.3.3
Database ORM:    Drizzle ORM 0.45.3
Database:        PostgreSQL / Supabase
Postgres Client: postgres 3.4.9
Validation:      Zod 4.6.5
Authentication:  jose 6.2.12 + scrypt password hashing
Icons:           Heroicons 2.2.0
UI Primitives:   Radix UI where useful
```

TypeScript is strict.

Path alias:

``` text
@/* -> src/*
```

Do not use `@/app/...` as though `app/` were under `src/`.

## 3. Repository Structure

Current high-level structure:

``` text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  services/page.tsx
  services/[slug]/page.tsx
  login/page.tsx
  admin/page.tsx
  admin/layout.tsx
  globals.css
  layout.tsx

src/
  components/
    admin/
    auth/
    services/
    shared/
    ui/

  config/
    env.ts

  db/
    client.ts
    schema/
    queries/
      dashboard.ts

  lib/
    auth/
    passwords.ts

  validation/

proxy.ts
```

Before adding a new file, inspect the nearest existing module and shared
directories. Extend existing conventions rather than creating parallel
infrastructure.

## 4. Public Website

Current public routes include:

``` text
/
 /about
 /contact
 /services
 /services/[slug]
 /login
```

The public website presents SA'A SMART WORKS services and receives
customer/contact interest.

There is no current customer portal requirement.

## 5. Admin Portal

Admin routes live under:

``` text
/admin
```

The portal is intended to manage SA'A SMART WORKS operations and staff.

Current/target modules include:

``` text
Dashboard
Employees
Attendance & GPS
Departments
Branches / Locations
User Accounts
Roles & Permissions
Contacts
Clients
Inquiries
Projects
Training
Printing Jobs
Services
Service Categories
Quotations
Invoices
Payments
Expenses
Vendors
Procurement
Tasks
Documents
Reports
Notifications
Settings
Audit Logs
```

Do not add Eatery navigation.

## 6. Current Admin Shell

The current admin UI has three important shell pieces:

``` text
AdminSidebar
AdminTopbar
AdminShell
```

Current visual direction:

-   Dark sidebar
-   Floating translucent/glass topbar
-   Light application surface
-   Centered/max-width content region
-   Heroicons preferred

The old `/admin` home content is a placeholder and will be replaced by
the actual dashboard.

### Sidebar Direction

The sidebar should evolve into a centralized, data-driven navigation
system.

Do not hardcode permission checks independently across many JSX blocks.

Preferred concept:

``` ts
type NavigationItem = {
  label: string;
  href: string;
  icon: IconComponent;
  permission?: PermissionKey;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};
```

Navigation is filtered from the current user's effective permissions.

The same navigation data should later support desktop and mobile
navigation rather than maintaining two unrelated menus.

## 7. Authentication Context

Current authentication uses:

-   Database users
-   scrypt password hashing
-   JWT session
-   Session cookie
-   Protected admin routes
-   Approximate 8-hour session
-   `SESSION_SECRET`

`SESSION_SECRET` must be at least 32 bytes.

Never commit production secrets.

Never expose server secrets through `NEXT_PUBLIC_*`.

### Current Authorization Caveat

The existing admin guard has been identified as too broad if it accepts
any role assignment as sufficient for `/admin`.

The target is explicit authorization.

Do not assume:

``` text
authenticated + has any role = administrator
```

Instead, use roles/permissions to determine access.

## 8. RBAC Model

The logical schema already contains:

``` text
users
roles
permissions
role_permissions
user_roles
```

The application should build on these rather than inventing a second
access-control system.

Roles are collections of permissions.

Users receive roles.

UI visibility can be based on effective permissions.

Examples:

``` text
dashboard.view
employees.view
employees.manage
attendance.view
attendance.manage
users.view
users.manage
roles.view
roles.manage
inquiries.view
inquiries.manage
clients.view
clients.manage
projects.view
projects.manage
finance.view
settings.manage
audit_logs.view
```

Treat these as naming examples until the project's canonical permission
list is finalized.

### Security Rule

Frontend permission checks improve UX.

They do not replace server authorization.

Routes, queries, mutations, server actions, and APIs must independently
validate permissions.

## 9. Current Logical Data Domains

### Identity and Access

``` text
users
roles
permissions
role_permissions
user_roles
```

### Staff

``` text
employees
```

Employees may optionally be connected to a user account.

### Service Catalog

``` text
services
```

### Customer Relationship

``` text
contacts
clients
inquiries
inquiry_messages
inquiry_assignments
```

Contact and Client are different concepts.

### Operations

``` text
projects
training
training_participants
printing_jobs
```

### Finance

``` text
quotations
quotation_items
invoices
invoice_items
payments
expenses
```

Financial amounts currently use minor-unit integer fields in relevant
records.

### Platform / Administration

``` text
files
notifications
settings
audit_logs
```

## 10. Known Status Models

Existing logical statuses include concepts such as:

``` text
User:
ACTIVE
DISABLED

Employee:
ACTIVE
INACTIVE

Inquiry:
NEW
OPEN
AWAITING_CUSTOMER
RESOLVED
CLOSED

Project:
PLANNED
ACTIVE
COMPLETED
CANCELLED

Training:
PLANNED
IN_PROGRESS
COMPLETED
CANCELLED

Printing Job:
QUEUED
IN_PROGRESS
READY
DELIVERED
CANCELLED

Quotation:
DRAFT
SENT
ACCEPTED
DECLINED
EXPIRED

Invoice:
DRAFT
ISSUED
VOID

Payment:
PENDING
CONFIRMED
FAILED

Expense:
DRAFT
APPROVED
PAID
REJECTED
```

Do not create slightly different duplicate status strings in frontend
modules. Centralize status metadata and presentation.

## 11. New Requirements Not Yet Guaranteed in Schema

Treat these as requirements/planned work rather than existing
implementation:

``` text
Departments
Branches / Locations
Vendors
Procurement
Tasks
GPS/geofence attendance fields
Fine-grained authorization enforcement
Advanced reporting
```

Before implementing backend behavior for these areas, confirm/update the
schema.

## 12. Attendance Requirement

The client wants administrators to track employee attendance using
device GPS location.

Current preferred interpretation:

``` text
Employee
   |
Clock In / Clock Out
   |
Browser location permission
   |
Latitude / Longitude / Accuracy
   |
Server-side validation
   |
Configured workplace / geofence
   |
Attendance record
```

Do not silently turn this into continuous employee tracking.

The frontend must account for:

-   Location permission request
-   Permission denied
-   Location unavailable
-   Poor accuracy
-   Clock-in state
-   Clock-out state
-   Loading/verification state

Backend validation remains authoritative.

## 13. Frontend Implementation Contract

When asked to build a frontend module only:

1.  Ship client-side UI/components only.
2.  Do not modify DB queries, schemas, auth, environment configuration,
    or server actions unless explicitly requested.
3.  Put sample data in a central replaceable source.
4.  Render collections with stable data-driven patterns such as
    `.map()`.
5.  Pass data into reusable components through props.
6.  Use strict TypeScript.
7.  Avoid `any`.
8.  Reuse central types, constants, status maps, and formatters.
9.  Use Heroicons only.
10. Use inline Tailwind utilities for most styling.
11. Keep global CSS for genuinely shared/repetitive complex effects.
12. Include meaningful empty/loading/error states where appropriate.
13. Do not fabricate backend capabilities.
14. Keep comments concise and useful.

## 14. UI Tokens and Existing Shared Effects

Core colors:

``` text
Orange:  #FFA64D
Dark:    #172B3A
Ink:     #1F2933
Muted:   #66717D
Surface: #F6F7F8
White:   #FFFFFF
```

Existing shared shadow utility concepts include:

``` text
.admin-shadow-shell
.admin-shadow-soft
.admin-shadow-glow
.admin-shadow-popover
.admin-shadow-active
```

Prefer reusing these rather than recreating equivalent shadow stacks
inline everywhere.

## 15. Admin Design Language

The admin portal should feel:

-   Premium
-   Minimal
-   Calm
-   Dense enough for business operations
-   Modern without excessive decoration
-   Mobile responsive
-   Accessible

Use glass selectively for:

-   Top navigation
-   Floating surfaces
-   Popovers
-   Overlays

Do not make every card translucent.

## 16. Dashboard Data Semantics

The admin dashboard is for SA'A SMART WORKS only.

Likely dashboard sources:

``` text
Inquiries
Clients
Projects
Employees / Attendance
Quotations
Invoices
Payments
Expenses
Printing Jobs
Training
Audit Logs
```

Avoid ambiguous financial labels.

For example, confirmed payments minus paid expenses is not automatically
accounting profit.

## 17. Coding-Agent Checklist

Before changing code:

-   Read `PROJECT_ARCHITECTURE.md`.
-   Read this file.
-   Inspect the relevant existing files.
-   Search for existing shared components/types/utilities.
-   Determine whether the task is frontend-only or full-stack.
-   Do not add Eatery concepts.
-   Do not add a business switcher.
-   Do not duplicate existing infrastructure.
-   Preserve strict TypeScript.
-   Preserve current design language.
-   Keep authorization concerns explicit.

After changing code:

-   Confirm imports follow the actual repo structure.
-   Confirm there is no casual `any`.
-   Confirm responsive states.
-   Confirm loading/empty/error states where relevant.
-   Confirm permission-sensitive UI is driven by centralized permission
    data.
-   Confirm server-side authorization is not being falsely implied by
    frontend hiding.
-   Run the project's normal lint/type/build checks when the task
    permits.

## 18. Current Development Priority

The current admin implementation sequence is:

``` text
Roles & Permissions
        |
        v
Permission helpers / effective access
        |
        v
Permission-aware navigation
        |
        v
User Accounts
        |
        v
Employees
        |
        v
Attendance & GPS
        |
        v
Remaining admin modules
```

The immediate goal is to establish RBAC cleanly so later modules can
show/hide navigation and actions according to access without
retrofitting permission logic throughout the UI.

## 19. Superseded Assumptions

The following earlier ideas must be considered obsolete unless
explicitly reintroduced:

``` text
SA'A SMART EATERY inside this admin
Multi-business admin dashboard
Business-unit switcher in the sidebar
Eatery orders/POS/menu/kitchen/inventory/delivery modules
Eatery staff portal inside this codebase
Cross-business KPI dashboard
```

The current project is focused exclusively on SA'A SMART WORKS and its
administration.
