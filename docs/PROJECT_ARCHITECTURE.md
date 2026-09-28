# SA'A SMART WORKS - Project Architecture

> **Status:** Current source of truth\
> **Last updated:** 28 September 2026\
> **Purpose:** Give developers and AI coding agents the current
> architectural direction of SA'A SMART WORKS. This document supersedes
> earlier plans that treated SA'A SMART EATERY as part of this codebase.

## 1. Project Scope

SA'A SMART WORKS is a professional-services platform with two primary
surfaces:

-   `saasmartworks.com` - public website for the company's services,
    information, contact flows, and customer inquiries.
-   `admin.saasmartworks.com` - protected administration portal for the
    owner/administrators to manage SA'A SMART WORKS, staff, operations,
    access control, finance, and internal records.

**SA'A SMART EATERY is a separate project.**

Do not introduce Eatery-specific features, entities, navigation,
permissions, dashboards, POS, orders, menu management, kitchen
workflows, inventory, delivery, or Eatery staff concepts into this
project unless a future requirement explicitly changes this decision.

## 2. Product Boundaries

### Public Website

The public website is customer-facing. Current areas include:

-   Home
-   About
-   Services
-   Individual service details
-   Contact
-   Inquiry/contact submission
-   Login entry point where applicable

There is currently no customer dashboard requirement.

### Admin Portal

The admin portal is an internal SA'A SMART WORKS management system.

Its responsibilities include:

-   Dashboard and operational overview
-   Employees/staff
-   Attendance and GPS-assisted attendance
-   User accounts
-   Roles and permissions
-   Departments
-   Branches/locations
-   Contacts and clients
-   Inquiries
-   Services and service categories
-   Projects
-   Training
-   Printing jobs
-   Finance
-   Vendors and procurement
-   Documents/files
-   Tasks
-   Reports
-   Notifications
-   System settings
-   Audit logs

Some of these domains already exist in the database; others are planned
requirements and must not be treated as implemented until their data
model and backend behavior are added.

## 3. Architecture Principle

The application is a single Next.js App Router codebase.

``` text
Browser
   |
   +-- Public Website
   |     `saasmartworks.com`
   |
   +-- Admin Portal
         `admin.saasmartworks.com`
              |
              +-- Authentication
              +-- Authorization / RBAC
              +-- Operational Modules
              +-- Staff Management
              +-- Finance
              +-- Administration
                     |
                     +-- PostgreSQL / Supabase
```

The domains may be deployed behind different hostnames while sharing the
same application/codebase where appropriate.

Do not create a multi-business switcher for this project. SA'A SMART
WORKS is the business being managed.

## 4. Current Technology Stack

-   Next.js 16.3.6
-   React 19.3.0
-   TypeScript 6.0.3
-   Node.js \>= 22.13
-   Tailwind CSS 4.3.3
-   Drizzle ORM 0.45.3
-   PostgreSQL via Supabase
-   `postgres` 3.4.9
-   Zod 4.6.5
-   `jose` 6.2.12
-   Heroicons 2.2.0
-   Radix UI where an accessible primitive is useful

## 5. Current Repository Shape

``` text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  services/page.tsx
  services/[slug]/page.tsx
  login/page.tsx

  admin/
    page.tsx
    layout.tsx

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

Extend this structure instead of creating parallel application
infrastructure without a clear reason.

## 6. Authentication

The current authentication direction uses:

-   Database-backed users
-   Password hashing with scrypt
-   JWT-based session handling
-   Session cookie
-   Approximately 8-hour session duration
-   Protected `/admin` routes
-   `SESSION_SECRET` of at least 32 bytes

Authentication answers:

> Who is this user?

Authorization must separately answer:

> What is this user allowed to access or perform?

These concerns must not be treated as the same thing.

## 7. Roles and Permissions

Roles and permissions are a foundational part of the admin portal and
should be implemented before broad permission-dependent UI work.

Current logical entities include:

``` text
users
roles
permissions
role_permissions
user_roles
```

The current `/admin` protection must not remain a simple "user has any
role" check as the final authorization model.

The target model is permission-driven access control.

Examples:

``` text
dashboard.view

employees.view
employees.create
employees.update
employees.delete

attendance.view
attendance.manage

users.view
users.create
users.update
users.disable

roles.view
roles.manage

inquiries.view
inquiries.manage
inquiries.assign

clients.view
clients.manage

projects.view
projects.manage

finance.view
quotations.manage
invoices.manage
payments.manage
expenses.manage

settings.manage
audit_logs.view
```

Exact permission names should be finalized centrally rather than
scattered through components.

### Frontend Permission Behavior

Navigation and UI controls may hide or disable actions based on the
current user's permissions.

Example conceptual API:

``` ts
can("employees.view")
can("users.manage")
can("inquiries.assign")
```

However, hidden UI is not a security boundary.

Every protected backend operation and protected route must enforce
authorization independently.

## 8. Admin Navigation Direction

The admin sidebar is for SA'A SMART WORKS only.

Recommended information architecture:

``` text
OVERVIEW
  Dashboard

PEOPLE & ORGANIZATION
  Employees
  Attendance & GPS
  Departments
  Branches / Locations

ACCESS & SECURITY
  User Accounts
  Roles & Permissions

CUSTOMERS
  Contacts
  Clients
  Inquiries

SERVICE OPERATIONS
  Projects
  Training
  Printing Jobs

WEBSITE MANAGEMENT
  Services
  Service Categories

FINANCE
  Quotations
  Invoices
  Payments
  Expenses

OPERATIONS
  Vendors
  Procurement
  Tasks
  Documents

INSIGHTS
  Reports

SYSTEM
  Notifications
  Settings
  Audit Logs
```

The sidebar should be data-driven. Each navigation item should be able
to declare its required permission.

Conceptually:

``` ts
type NavigationItem = {
  label: string;
  href: string;
  icon: IconComponent;
  permission?: PermissionKey;
};
```

The rendering component should not contain business rules for every
item.

## 9. Admin Dashboard Direction

`/admin` is the SA'A SMART WORKS administration dashboard.

It should summarize the business without introducing Eatery data.

Potential dashboard areas:

-   New inquiries
-   Active clients
-   Active projects
-   Staff/attendance snapshot
-   Revenue and expenses
-   Outstanding invoices/payments
-   Quotations awaiting action
-   Project status
-   Recent inquiries
-   Printing/training operational status
-   Items needing attention
-   Recent audit activity

Dashboard data must eventually respect the current user's permissions.

A user who cannot access finance should not receive finance data merely
because the corresponding card is hidden in the browser.

## 10. Employee and Attendance Direction

Employees are distinct from login accounts.

An employee may optionally have a user account.

Attendance requirements include GPS/location-assisted attendance.

Preferred direction:

-   Employee clocks in/out.
-   Browser/device requests location permission.
-   Location and accuracy are captured at the attendance event.
-   Server validates the event against the configured work
    location/geofence where required.
-   Permission-denied and inaccurate-location states are handled
    explicitly.
-   Attendance records retain timestamps and relevant verification
    information.

Do not assume continuous employee location tracking unless the client
explicitly requires it.

## 11. Existing Operational Domains

The current logical schema already contains concepts for:

-   Users
-   Roles and permissions
-   Employees
-   Services
-   Contacts
-   Clients
-   Inquiries and inquiry messages
-   Inquiry assignments
-   Projects
-   Training
-   Printing jobs
-   Quotations and quotation items
-   Invoices and invoice items
-   Payments
-   Expenses
-   Files
-   Notifications
-   Settings
-   Audit logs

These should be reused and evolved instead of duplicated.

## 12. Planned Domains

The following requirements should currently be treated as planned unless
implemented in the repository/schema:

-   Departments
-   Branches / locations
-   Vendors
-   Procurement
-   Tasks
-   Expanded GPS attendance model
-   Fine-grained route/action authorization
-   Permission-aware navigation
-   Advanced reports

Before implementing these modules, define their data model,
relationships, permissions, validation, and lifecycle.

## 13. Financial Model

Existing finance concepts include:

``` text
Quotation
  -> Quotation Items

Invoice
  -> Invoice Items
  -> Payments

Expenses
```

Money should continue to use integer minor units where the existing
schema does so.

Dashboard terminology must be precise. For example, do not label:

``` text
confirmed payments - paid expenses
```

as accounting profit unless the financial model actually supports that
conclusion. Prefer terms such as net cash movement or the exact
underlying metric.

## 14. Contacts vs Clients

A Contact is not automatically a Client.

A person/organization may first appear through an inquiry or contact
interaction and later become a client.

Do not collapse these concepts into one entity merely for UI
convenience.

## 15. Frontend Architecture Rules

Admin frontend work should be:

-   Client-side when the requested task is specifically UI
    implementation.
-   Props-driven.
-   Strictly typed.
-   Componentized where reuse or complexity justifies it.
-   Backed by centralized sample data during frontend-only work.
-   Designed so replacing mock data with backend data does not require
    rewriting rendering logic.
-   Built primarily with inline Tailwind utility classes.
-   Built with Heroicons only for icons.
-   Responsive and accessible.
-   Equipped with relevant loading, empty, and error states.
-   Free of invented backend behavior.

Avoid `any`.

Avoid hardcoding data inside deeply nested visual components.

Avoid creating a separate utility/status/type implementation for every
module when a shared one already exists.

## 16. UI Design Direction

The admin interface should be premium, restrained, and operationally
efficient.

Core palette:

``` text
Primary Orange: #FFA64D
Dark Blue:      #172B3A
Ink:            #1F2933
Muted:          #66717D
Surface:        #F6F7F8
Cards:          #FFFFFF
```

Design principles:

-   Premium minimalist
-   Apple-inspired glass treatment without cloning Apple
-   Dark administration sidebar
-   Floating/glass topbar
-   Borderless or very subtle cards
-   Multi-layer soft shadows
-   Smooth card radii
-   Buttons with smaller radii than large cards
-   Restrained motion
-   Reduced-motion support
-   Higher information density than the public website

## 17. AI Agent / Copilot Rules

When working on this repository:

1.  Treat this document as current architectural direction.
2.  Do not introduce SA'A SMART EATERY.
3.  Do not introduce a business-unit switcher as a product requirement.
4.  Preserve the existing Next.js App Router architecture.
5.  Inspect existing components/types/utilities before creating new
    equivalents.
6.  Use Heroicons for icons.
7.  Keep TypeScript strict.
8.  Do not modify authentication, database schema, environment
    variables, or server actions when a task is explicitly
    frontend-only.
9.  Keep sample data centralized and replaceable.
10. Do not claim a planned module is already implemented.
11. Authorization must eventually be enforced server-side as well as
    reflected in the UI.
12. Prefer incremental changes over unnecessary rewrites.

## 18. Immediate Implementation Order

Current priority:

``` text
1. Roles & Permissions
2. Permission model / access helpers
3. Permission-aware admin navigation
4. User Accounts
5. Employees
6. Attendance & GPS
7. Remaining operational modules
8. Dashboard refinement using authorized data
```

The exact order may change with client feedback, but Roles & Permissions
is currently the foundation for subsequent admin access behavior.

## 19. Explicitly Out of Scope

Unless requirements change, do not build the following in this project:

-   SA'A SMART EATERY
-   Eatery dashboard
-   Restaurant POS
-   Food/menu management
-   Restaurant orders
-   Kitchen management
-   Eatery inventory
-   Restaurant delivery management
-   Eatery-specific customers
-   Eatery staff/shifts
-   Eatery loyalty/rewards
-   Cross-business switcher

These belong to a separate project.
