> Current implementation override (2026-09-27): use one Next.js app with root app/ and src/components/, no monorepo. Initial local database: Drizzle + SQLite. Read docs/DECISIONS.md; older structure/database sections below are historical.

# SAASMARTWORKS — Project Context & AI Engineering Guide

> **Purpose:** This document is the core source of truth for AI coding agents, developers, and future contributors working on the SAASMARTWORKS platform.
>
> Before making architectural decisions, installing dependencies, creating major features, or changing established patterns, read this document completely.
>
> **Project Status:** Planning / Initial Implementation  
> **Document Status:** Living document  
> **Last Major Context Update:** September 2026

---

# 1. Project Overview

## 1.1 What is SAASMARTWORKS?

SAASMARTWORKS is a growing multi-service business based in Maiduguri, Borno State, Nigeria.

The company was established in 2025.

The business currently consists of two major business units:

1. Professional & Digital Services
2. SA'A Eatery

The software must therefore NOT be designed as a website for only one department.

It should be designed as an extensible **SAASMARTWORKS Business Platform** capable of supporting multiple business units while sharing common infrastructure.

The initial development focus is the **Professional & Digital Services business** and the **central Administration system**.

The Eatery will be implemented later but MUST be considered in foundational architectural decisions.

---

# 2. Business Units

Business units are a first-class architectural concept.

The initial business units are:

```text
SAASMARTWORKS
│
├── Professional & Digital Services
│
└── SA'A Eatery
```

Conceptually:

```ts
BusinessUnit {
  id
  name
  slug
  type
  status
}
```

Example:

```text
Professional & Digital Services
slug: professional-services
type: SERVICES
status: ACTIVE
```

and:

```text
SA'A Eatery
slug: eatery
type: EATERY
status: INACTIVE
```

The Eatery may initially remain inactive in the application while its architecture is prepared.

Where appropriate, records such as inquiries, employees, clients, expenses, invoices and transactions should be associated with a `businessUnitId`.

Do NOT hardcode the entire system around Professional Services.

---

# 3. Application / Domain Architecture

The expected public structure is:

```text
saasmartworks.com
```

Parent/corporate website.

```text
services.saasmartworks.com
```

Professional & Digital Services website.

```text
eatery.saasmartworks.com
```

Future Eatery customer application.

```text
admin.saasmartworks.com
```

Central internal administration system.

These applications belong to the same overall platform.

They should NOT be treated as unrelated products.

---

# 4. Repository Architecture

Use a monorepo.

Preferred conceptual structure:

```text
saa-smart-works/
│
├── apps/
│   ├── services/
│   ├── admin/
│   ├── web/
│   └── eatery/
│
├── packages/
│   ├── database/
│   ├── auth/
│   ├── permissions/
│   ├── email/
│   ├── storage/
│   ├── validation/
│   ├── config/
│   ├── ui/
│   └── types/
│
├── docs/
│
├── AGENTS.md
├── PROJECT-CONTEXT.md
└── package.json
```

Not every application must be created immediately.

Initial development may begin with:

```text
apps/
├── services/
└── admin/

packages/
├── database/
├── auth/
├── permissions/
├── email/
├── validation/
├── config/
├── ui/
└── types/
```

The corporate website and Eatery can be introduced later.

---

# 5. Architectural Philosophy

The architecture should follow a:

**Modular Monolith + Domain-Oriented Architecture**

Do NOT prematurely introduce microservices.

We want:

- strong domain boundaries
- reusable infrastructure
- modular features
- independent frontend applications
- maintainable code
- clear ownership
- scalability
- predictable data flow

without unnecessary distributed-system complexity.

A future migration of specific modules into independent services should remain possible if actual scale requires it.

---

# 6. Professional & Digital Services

The Professional & Digital Services business currently provides several categories of services.

## 6.1 Management Consultancy

Services include:

- Capacity building
- Training of Trainers
- Participant training
- Organizational policy development
- Policy review
- Institutional strengthening
- Communication support
- Documentation support
- Proposal writing
- Concept note development
- Project monitoring
- Project management
- End-of-project documentation
- Filing
- Reporting
- Government regulatory compliance support

Training/capacity-building thematic areas may include:

- Child Protection
- Gender-Based Violence prevention
- Survivor-centered response
- Gender mainstreaming
- Inclusion
- Education in Emergencies
- Basic education approaches
- Teaching at the Right Level (TaRL)
- ABEP
- GRPTT
- WASH
- Livelihoods
- Economic recovery
- Nutrition
- Community sensitization

The system should not hardcode these permanently into the frontend.

Services should eventually be manageable as data.

---

# 7. Digital Services

Digital services include:

- Digital support
- Troubleshooting
- Online applications
- E-registration
- Data entry
- Digital form processing
- Digital documentation
- Document formatting
- Document editing
- Digital literacy training
- Staff digital training
- Organizational digital training
- System upgrades
- System activation
- General digital optimization

---

# 8. Printing, Branding & Creative Design

Services include:

- Document printing
- Photocopying
- Scanning
- Document formatting
- Creative document design
- Official document layout
- Logo design
- Organizational profile design
- Banner design
- Banner printing
- T-shirt branding
- Promotional materials

These may eventually evolve into a dedicated Printing Jobs module.

---

# 9. Services Website

The Services website is public.

Customers DO NOT need accounts.

Do NOT build:

- customer signup
- customer login
- customer dashboard

for Professional Services unless requirements explicitly change.

Visitors should be able to:

- understand the business
- browse service categories
- browse services
- view company information
- contact SAASMARTWORKS
- submit inquiries

---

# 10. Inquiry System

The contact form must NOT simply send an email and discard the submission.

An inquiry is a real business entity.

Flow:

```text
Visitor
   ↓
Services Website
   ↓
Inquiry Form
   ↓
Validation + Sanitization
   ↓
Inquiry stored in database
   ↓
Admin notification
   ↓
Admin Dashboard
   ↓
Staff opens inquiry
   ↓
Staff replies
   ↓
Email sent to contact
```

The inquiry should remain visible and manageable inside the Administration application.

---

# 11. Inquiry Form

Expected fields include:

```text
Name
Email
Phone (optional)
Organization (optional)
Service Category
Specific Service
Subject
Message
```

Some fields may evolve.

Do not unnecessarily require optional information.

Every inquiry should have a unique reference.

---

# 12. Inquiry Statuses

Initial statuses:

```text
NEW
OPEN
AWAITING_CUSTOMER
RESOLVED
CLOSED
```

The UI can display friendly labels:

```text
New
Open
Awaiting Customer
Resolved
Closed
```

Do not tightly couple UI labels to database representation.

---

# 13. Inquiry Communication

Authorized administrators/staff should be able to:

- open inquiries
- read messages
- assign inquiries
- change status
- reply
- view previous messages
- search/filter inquiries

When an administrator replies:

```text
Admin Dashboard
      ↓
Inquiry Domain
      ↓
Email Service
      ↓
Email Provider
      ↓
Customer
```

The reply should also be stored in the conversation history.

Email functionality must be abstracted.

Do NOT embed a provider SDK throughout application code.

Prefer:

```text
Inquiry Module
      ↓
Email Service
      ↓
Email Provider Adapter
```

Possible providers may include SMTP, Resend or another service.

The final provider is currently TBD.

---

# 14. Contact vs Client

This distinction is important.

Someone submitting an inquiry is a:

**Contact**

They are NOT automatically a Client.

Conceptually:

```text
Contact
   ↓
Inquiry
```

One contact may submit multiple inquiries.

Later:

```text
Contact
   ↓
converted/associated
   ↓
Client
```

A Client may then have:

```text
Client
├── Projects
├── Training
├── Printing Jobs
├── Quotations
├── Invoices
├── Payments
└── Documents
```

Do not merge Contact and Client into one concept simply for convenience.

---

# 15. Administration Application

The Administration application is the central management system.

Expected navigation may eventually resemble:

```text
Overview

Professional Services
├── Services
├── Inquiries
├── Contacts
├── Clients
├── Projects
├── Training
└── Printing Jobs

Finance
├── Quotations
├── Invoices
├── Payments
└── Expenses

Organization
├── Employees
├── Business Units
├── Users
└── Roles

System
├── Settings
└── Audit Logs

Eatery
├── Dashboard
├── Orders
├── Menu
├── POS
├── Kitchen
└── Inventory
```

Not all modules belong to Phase 1.

Do not build future modules simply because they appear here.

---

# 16. Phase 1

Initial implementation should prioritize:

## Services

- Public Services website
- Service categories
- Services
- Service details
- Contact page
- Inquiry submission

## Administration

- Authentication
- Dashboard
- Inquiry management
- Inquiry replies
- Service management
- Contacts
- Basic client support
- Staff/users
- Roles
- Permissions
- Business units
- Settings
- Audit infrastructure

Do NOT allow future scope to delay Phase 1 unnecessarily.

---

# 17. Roles & Permissions

Do NOT use:

```ts
isAdmin: true;
```

as the primary authorization architecture.

Use RBAC.

Potential roles include:

```text
Super Administrator
Services Manager
Finance Officer
Printing Staff
Eatery Manager
Eatery Staff
```

Roles are examples and may change.

Permissions should be granular.

Examples:

```text
inquiries.view
inquiries.reply
inquiries.assign
inquiries.update
inquiries.close

services.view
services.create
services.update
services.publish
services.delete

contacts.view
contacts.manage

clients.view
clients.manage

users.view
users.manage

roles.view
roles.manage

settings.view
settings.manage

audit.view
```

Future examples:

```text
eatery.menu.manage
eatery.orders.view
eatery.orders.manage

wallets.view
wallets.adjust
wallet_transactions.view
```

Authorization MUST be enforced server-side.

Hiding a button is NOT authorization.

---

# 18. Authentication Populations

Eventually there will be two distinct authentication populations.

## Staff

Examples:

- Super Administrator
- Services Manager
- Finance Staff
- Printing Staff
- Eatery Staff

## Customers

Eatery customers.

Authentication means:

> Who are you?

Authorization means:

> What are you allowed to do?

Do not mix these concepts.

An Eatery customer must never gain staff privileges merely because both identities exist in the same platform.

---

# 19. Shared Core Capabilities

Shared infrastructure should include:

```text
Authentication
Users
Roles
Permissions
Business Units
Contacts
Inquiries
Notifications
Email
Files
Audit Logs
Settings
Validation
Configuration
```

Avoid recreating these capabilities independently inside every application.

---

# 20. File / Document Architecture

Files should use a shared abstraction.

Future attachments may belong to:

- Inquiry
- Client
- Project
- Training
- Printing Job
- Invoice
- Eatery operations

Possible consultancy documents include:

- Proposals
- Contracts
- Training materials
- Attendance sheets
- Photographs
- Reports
- Policies
- Supporting documents

Storage provider details should not leak throughout domain code.

Use a storage abstraction.

---

# 21. Audit Logging

Audit logging should exist early.

Important actions may include:

```text
User logged in
Role changed
Permission changed
Inquiry reassigned
Inquiry closed
Service changed
Invoice changed
Wallet adjustment made
Setting changed
```

Audit events should generally capture:

```text
Actor
Action
Entity type
Entity ID
Timestamp
Relevant metadata
```

Never store passwords, secrets or complete authentication tokens in audit logs.

Financial transaction history is separate from general audit logs.

---

# 22. Eatery — Future Scope

The Eatery is NOT the immediate implementation focus.

However, architecture must account for it.

Known requirements include:

- Customer registration
- Customer login
- Menu
- Menu categories
- Cart
- Checkout
- Order placement
- Customer wallet
- Virtual bank account
- Wallet deposits
- Wallet payment
- Order history

Future operational modules may include:

- POS
- Kitchen
- Inventory
- Pickup
- Delivery

These details remain under discovery.

Do NOT invent restaurant business rules.

---

# 23. Eatery Customer Wallet

Each eligible Eatery customer should eventually have a wallet.

A wallet should NOT be modeled merely as:

```ts
balance: 50000;
```

with arbitrary mutations.

Use a ledger architecture.

Conceptually:

```text
Wallet
   ↓
Wallet Transactions
```

Example transaction:

```ts
WalletTransaction {
  id
  walletId
  customerId

  type: CREDIT | DEBIT

  source:
    BANK_TRANSFER |
    ORDER |
    REFUND |
    ADJUSTMENT

  amount

  reference
  externalReference

  balanceBefore
  balanceAfter

  status

  metadata

  createdAt
}
```

The exact schema is not final.

The architectural principle IS final:

**Every financial movement must be traceable.**

---

# 24. Billstack Integration

Billstack is planned for Eatery wallet funding.

Expected conceptual flow:

```text
Customer registers
        ↓
Customer becomes eligible for wallet
        ↓
Billstack virtual account provisioned
        ↓
Virtual account assigned to customer
        ↓
Customer transfers money
        ↓
Billstack processes transaction
        ↓
Webhook sent to SA'A backend
        ↓
Webhook verified
        ↓
Event checked for duplication
        ↓
Wallet credit transaction created
        ↓
Wallet becomes funded
```

Then:

```text
Customer places order
        ↓
Order total calculated
        ↓
Wallet funds verified
        ↓
Atomic/consistent debit operation
        ↓
Wallet transaction created
        ↓
Order payment confirmed
```

---

# 25. Financial Engineering Rules

Financial operations require stricter engineering standards.

Mandatory principles:

- Never trust client-provided payment status.
- Verify provider webhooks.
- Implement webhook idempotency.
- Duplicate webhook delivery must NOT duplicate credits.
- Maintain unique provider transaction references.
- Prevent concurrent double-spending.
- Do not use floating-point arithmetic for monetary calculations.
- Prefer integer minor units or another exact-money representation.
- Refunds should create new ledger transactions.
- Do not rewrite historical ledger entries to simulate refunds.
- Administrative adjustments must be traceable.
- Support future reconciliation.
- Log important financial events securely.
- Use database consistency mechanisms appropriate to MongoDB.

Financial correctness takes priority over convenience.

---

# 26. Technology Direction

Current intended stack:

```text
Next.js
React
TypeScript
Tailwind CSS
MongoDB
Zod
Vercel
Heroicons
```

Potential technologies:

```text
Authentication provider/library — TBD
Email provider — TBD
File storage provider — TBD
```

Future:

```text
Billstack
```

---

# 27. Database

MongoDB is the database choice.

This is currently a strong/non-negotiable project preference.

Development may use:

```text
MongoDB Community
```

locally.

Production is expected to use:

```text
MongoDB Atlas
```

MongoDB Atlas network access has been configured to allow the necessary remote connectivity.

Do not expose MongoDB directly to browser clients.

Database access must occur server-side.

---

# 28. Drizzle ORM Important Constraint

The project owner intends to use Drizzle ORM.

However:

**Do NOT assume Drizzle + MongoDB compatibility.**

At the time the architecture was discussed, official Drizzle documentation did not list MongoDB among its officially supported database dialects.

Therefore this remains an architectural decision gate.

Before implementing persistence:

1. Verify current official Drizzle MongoDB support.
2. Determine whether a stable supported MongoDB path exists.
3. If not, recommend an appropriate MongoDB data-access solution.
4. Do NOT silently switch the project away from MongoDB.
5. Do NOT silently install another ORM.

MongoDB remains the database preference.

The data-access implementation remains TBD until compatibility is resolved.

---

# 29. MongoDB Modeling Principles

Follow deliberate MongoDB modeling.

Use embedding when:

- data is small
- bounded
- owned by one aggregate
- usually loaded together

Use references when:

- data grows independently
- data is shared
- collections require independent querying
- relationships are operationally meaningful

Avoid unbounded embedded arrays.

Examples such as:

```text
Inquiry Messages
Wallet Transactions
Audit Logs
```

should not grow forever inside one parent document.

Use indexes deliberately.

Potential indexes may include:

```text
email
slug
reference
businessUnitId
status
createdAt
externalReference
```

Compound indexes should reflect real query patterns.

---

# 30. UI/UX Philosophy

The application uses a:

**Premium Apple-inspired Liquid Glass design language**

Important:

This means Apple-inspired design principles.

It does NOT mean blindly cloning Apple.

The interface must remain recognizably:

**SAASMARTWORKS**

Design goals:

- premium
- modern
- spacious
- clean
- calm
- professional
- fluid
- layered
- responsive
- accessible

---

# 31. Brand Colors

Primary:

```css
#FFA64D
```

Orange is the primary brand/action color.

Secondary:

```text
Dark Blue — exact hex TBD
```

DO NOT invent the dark-blue value.

Wait until the project owner supplies it.

---

# 32. Semantic Design Tokens

Do NOT scatter hardcoded colors throughout components.

Wrong:

```css
background: #ffa64d;
```

repeated across many files.

Prefer semantic variables:

```css
:root {
	--color-primary: #ffa64d;
	--color-secondary: /* TBD */;

	--color-background: ...;

	--surface-base: ...;
	--surface-elevated: ...;
	--surface-glass: ...;

	--text-primary: ...;
	--text-secondary: ...;
	--text-muted: ...;

	--radius-button: ...;
	--radius-card: ...;

	--shadow-card: ...;
	--shadow-elevated: ...;
}
```

Components consume semantic tokens.

Example:

```css
background: var(--color-primary);
```

The objective:

A future brand refresh should mostly involve changing tokens rather than rewriting components.

---

# 33. Logo

The project owner has an official SAASMARTWORKS logo.

Do NOT recreate the logo using arbitrary text.

Do NOT duplicate logo markup throughout the application.

Create a reusable:

```tsx
<Logo />
```

component.

Potential API:

```tsx
<Logo />
<Logo size="sm" />
<Logo size="md" />
<Logo size="lg" />
<Logo variant="full" />
<Logo variant="mark" />
```

Exact variants should reflect the actual provided logo assets.

The Logo component should be used across:

- Header
- Sidebar
- Authentication
- Footer
- Loading/branding surfaces
- Corporate website
- Services website
- Eatery where appropriate

The original asset should remain the source of truth.

---

# 34. Liquid Glass Design

The design should use Liquid Glass principles selectively.

Possible techniques:

- translucent surfaces
- controlled backdrop blur
- soft gradients
- layered depth
- subtle highlights
- restrained transparency
- ambient shadows
- smooth transitions
- elevated navigation surfaces

Do NOT turn every element into glass.

Glass should communicate:

- hierarchy
- depth
- navigation
- floating controls
- premium surfaces

Readability always has priority over transparency.

---

# 35. Uploaded Liquid Glass Skill

A generic Apple Liquid Glass design skill was provided as inspiration.

It contains useful concepts such as:

- spacious layouts
- premium surfaces
- layered depth
- glass effects
- subtle gradients
- polished interactions

However, its generic brand decisions MUST NOT override this project.

Ignore/override conflicting defaults such as:

```text
Apple blue #007AFF
generic colorful icons
mandatory thin borders
generic radius values
MockFlow-specific tooling
generic Apple branding
```

SAASMARTWORKS rules take precedence.

---

# 36. Cards

Cards should generally be:

- borderless
- layered
- clean
- spacious
- softly elevated

Use multi-layer shadows rather than visible borders for primary card separation.

Example philosophy:

```text
Background
   ↓
Soft broad shadow
   ↓
Secondary tighter shadow
   ↓
Card surface
   ↓
Content
```

Do not overuse shadows.

Cards should have a comfortable radius.

Avoid excessively pill-shaped cards.

---

# 37. Buttons

Buttons should:

- have generous spacing
- have comfortable horizontal padding
- have comfortable vertical padding
- use a smaller radius than cards
- have clear hierarchy
- provide hover state
- provide focus state
- provide disabled state
- provide loading state where applicable

Expected variants may include:

```text
Primary
Secondary
Ghost
Danger
```

Do not create unnecessary button variants.

---

# 38. Icons

Use:

**Heroicons**

Do NOT introduce Lucide as the standard icon library.

Do not mix multiple icon systems without a strong reason.

Icons should maintain consistent:

- stroke weight
- sizing
- alignment
- spacing

Application-specific reusable icon behavior may be wrapped in shared components.

---

# 39. Typography

Typography should feel:

- modern
- premium
- readable
- professional

Do not blindly use Apple's SF Pro simply because the design is Apple-inspired.

The final font system should align with the SAASMARTWORKS identity and technical licensing/availability requirements.

Use a consistent typography scale.

Avoid arbitrary font sizes throughout components.

---

# 40. Responsive Design

Responsive behavior is mandatory.

Design for:

- mobile
- tablet
- laptop
- desktop

Do NOT build desktop-only interfaces and attempt to repair mobile afterward.

Admin dashboards must remain practically usable on smaller screens.

Public websites should prioritize mobile performance and readability.

---

# 41. Accessibility

Accessibility is a core engineering requirement.

Use:

- semantic HTML
- labels
- keyboard navigation
- visible focus states
- accessible dialogs
- accessible form errors
- sufficient color contrast
- meaningful alt text
- proper button semantics

Liquid Glass must NEVER reduce text readability.

Support:

```css
prefers-reduced-motion
```

where meaningful.

---

# 42. Motion

Use restrained motion.

Good examples:

- subtle hover transitions
- modal transitions
- menu transitions
- navigation transitions
- controlled glass movement
- small state-change animations

Avoid:

- excessive bouncing
- distracting page animations
- unnecessary parallax
- animations delaying interaction

Motion should communicate state and hierarchy.

---

# 43. Shared UI Components

Do not repeatedly style raw elements independently.

Prefer shared primitives.

Examples:

```text
Logo
Button
Input
Textarea
Select
Checkbox
Radio
Card
Badge
Avatar
Modal
Dialog
Drawer
Dropdown
Tooltip
EmptyState
LoadingState
ErrorState
PageHeader
SectionHeader
DataTable
Pagination
FormField
```

Do NOT build all components upfront.

Create abstractions when actual usage justifies them.

Avoid premature design-system overengineering.

---

# 44. Componentization

Target:

**Components should generally remain under 200 lines.**

This is a design pressure, not an excuse to create meaningless micro-files.

When a component grows too large, consider extracting:

- subcomponents
- hooks
- domain logic
- validation schemas
- utility functions
- data-access logic
- constants

Do not place database/business logic inside presentation components.

A 210-line cohesive component may occasionally be preferable to five meaningless components.

Use engineering judgment.

---

# 45. Separation of Concerns

Avoid components that simultaneously:

```text
Render UI
+
Validate business rules
+
Access database
+
Send emails
+
Authorize users
+
Process payments
```

Separate responsibilities.

Conceptually:

```text
UI
↓
Application/Domain Layer
↓
Repository / Infrastructure
↓
Database / External Provider
```

The exact implementation should remain pragmatic within Next.js.

---

# 46. TypeScript

Use TypeScript strictly.

Avoid:

```ts
any;
```

as an escape hatch.

Prefer:

- explicit domain types
- inferred validated types
- discriminated unions
- typed API boundaries
- typed configuration
- predictable error types

Do not silence TypeScript errors simply to make compilation succeed.

---

# 47. Validation

All untrusted input must be validated.

Examples:

- forms
- route parameters
- query parameters
- API payloads
- webhook payloads
- environment configuration
- uploaded file metadata

Client-side validation improves UX.

It is NOT authoritative security validation.

Server-side validation is mandatory.

Zod is the current preferred validation direction.

Reuse schemas where practical.

---

# 48. Sanitization

Validation and sanitization are related but distinct.

Validate structure and constraints.

Sanitize where content may create security or formatting risks.

Never trust browser-provided data simply because TypeScript says it has a particular type.

TypeScript types disappear at runtime.

---

# 49. Error Handling

Do not silently swallow errors.

Bad:

```ts
try {
  ...
} catch {}
```

Errors should be:

- handled
- logged appropriately
- transformed into safe user-facing messages
- propagated where necessary

Never expose:

- database credentials
- stack traces
- API secrets
- provider secrets
- internal infrastructure information

to end users.

---

# 50. Async UI States

Every asynchronous interface must consider:

```text
Loading
Success
Empty
Error
```

Where relevant:

```text
Disabled
Retrying
Submitting
Submitted
```

Do not design only the ideal successful state.

---

# 51. Security Principles

Security must be architectural.

Apply:

- least privilege
- server-side authorization
- validation
- sanitization
- rate limiting
- secure sessions
- secret management
- webhook verification
- auditability
- safe logging
- dependency maintenance

Never rely exclusively on client-side controls.

---

# 52. Directory Structure

Use a clear scalable directory structure.

Do not dump everything into:

```text
components/
utils/
lib/
```

without domain organization.

Prefer domain/feature organization where appropriate.

Example:

```text
features/
├── inquiries/
├── services/
├── contacts/
├── clients/
└── users/
```

Each domain may contain appropriate:

```text
components
schemas
services
repositories
types
actions
queries
```

Do not mechanically create every folder for every feature.

Create only what is needed.

---

# 53. Coding Standards

Code should prioritize:

1. Correctness
2. Security
3. Clarity
4. Maintainability
5. Reusability
6. Performance where relevant

Avoid clever code when straightforward code is easier to understand.

Use descriptive naming.

Avoid unexplained magic values.

Prefer early returns when they improve readability.

Keep functions focused.

Avoid duplicated business logic.

---

# 54. No Shortcuts Policy

Do NOT:

- hardcode temporary production data
- bypass validation
- bypass authorization
- duplicate business logic
- ignore TypeScript errors
- hide failures
- introduce unexplained dependencies
- directly mutate financial balances
- put secrets in source code
- make architectural changes silently
- create giant components out of convenience
- create meaningless abstractions to satisfy line-count rules

Temporary development workarounds must be clearly identified.

---

# 55. Dependency Installation Policy

This rule is extremely important.

**Do NOT immediately run `npm install` whenever a problem appears.**

Before introducing a dependency:

1. Determine exactly what problem it solves.
2. Check whether the framework/platform already solves it.
3. Check whether an existing project dependency solves it.
4. Verify compatibility with the current Next.js/React/TypeScript stack.
5. Consider maintenance status.
6. Consider security implications.
7. Consider bundle impact where relevant.
8. Determine whether the package is truly necessary.
9. Explain why it is being introduced.

Only then install it.

Avoid dependency bloat.

Do not install several overlapping packages.

---

# 56. NPM Installation Gate for AI Agents

Before executing:

```bash
npm install ...
```

or:

```bash
pnpm add ...
```

the AI agent should state:

```text
Package:
Purpose:
Why existing tools are insufficient:
Where it will be used:
Compatibility considerations:
```

For major infrastructure dependencies, obtain project-owner approval before installation unless already explicitly approved.

---

# 57. Package Manager

Do not assume npm/pnpm/yarn/bun until the project chooses one.

Once selected, use it consistently.

Do not mix lockfiles.

---

# 58. Environment Variables

Secrets belong in environment variables.

Never commit:

- MongoDB passwords
- authentication secrets
- Billstack secrets
- email API keys
- storage credentials

Provide safe example configuration through:

```text
.env.example
```

without real credentials.

---

# 59. Deployment

Current direction:

```text
Vercel
```

Applications may be independently deployed.

Example:

```text
apps/services → services.saasmartworks.com
apps/admin    → admin.saasmartworks.com
apps/web      → saasmartworks.com
apps/eatery   → eatery.saasmartworks.com
```

Production and development configuration must remain separated.

---

# 60. Testing Philosophy

Critical logic should be testable independently from UI rendering.

Prioritize tests around:

- permissions
- validation
- inquiry workflow
- authentication boundaries
- data transformations
- financial transactions
- webhook idempotency
- wallet debits
- duplicate deposits
- insufficient balance
- refunds

Do not chase arbitrary test-coverage percentages.

Test important behavior.

---

# 61. AI Agent Operating Rules

Any AI coding agent working on this repository must:

1. Read this document before major implementation.
2. Inspect existing code before creating replacements.
3. Reuse existing components where appropriate.
4. Respect established architecture.
5. Avoid inventing business requirements.
6. Ask when a missing requirement materially affects implementation.
7. Do not silently change architecture.
8. Do not silently replace technology choices.
9. Do not install dependencies without evaluation.
10. Do not create giant components for convenience.
11. Keep presentation and business logic appropriately separated.
12. Maintain security boundaries.
13. Preserve type safety.
14. Use existing design tokens.
15. Use the reusable Logo component.
16. Use Heroicons for standard UI icons.
17. Respect the Liquid Glass design language.
18. Preserve SA'A branding rather than generic Apple branding.
19. Implement responsive states.
20. Implement loading/error/empty states.
21. Validate server-side.
22. Enforce authorization server-side.
23. Update documentation when architectural decisions change.

---

# 62. Do Not Invent Requirements

When requirements are unclear:

Do NOT guess major business behavior.

Examples currently requiring further specification include:

- Eatery delivery
- Eatery pickup
- delivery pricing
- kitchen workflow
- inventory workflow
- POS details
- Eatery taxes/fees
- cancellation policy
- refund policy
- inbound email synchronization
- final authentication provider
- final email provider
- final storage provider

Mark such decisions as:

```text
TBD
```

or ask the project owner.

---

# 63. Current Known TBDs

## TBD-001 — Secondary Color

Primary:

```text
#FFA64D
```

Secondary:

```text
Dark blue — exact HEX pending
```

Do not invent the value.

---

## TBD-002 — MongoDB Data Access / Drizzle

MongoDB is required/preferred.

Drizzle ORM is intended.

Official MongoDB compatibility must be verified before implementation.

Do not assume compatibility.

---

## TBD-003 — Authentication

Final authentication implementation has not been selected.

Possible approaches may be evaluated later.

Do not install an authentication framework until architecture requirements are considered.

---

## TBD-004 — Email Provider

Provider is not finalized.

The domain must remain provider-independent.

---

## TBD-005 — Storage Provider

File storage provider is not finalized.

Maintain an abstraction boundary.

---

## TBD-006 — Eatery Operations

Detailed Eatery requirements require dedicated discovery before implementation.

---

## TBD-007 — Billstack

Billstack is the intended provider for customer virtual accounts/wallet funding.

Its current API, webhook requirements and production procedures must be verified before implementation.

Do not invent API contracts.

---

# 64. Implementation Roadmap

## Phase 0 — Foundation

Establish:

- repository
- monorepo
- package manager
- TypeScript
- code quality
- shared configuration
- design tokens
- UI foundation
- Logo component
- database decision
- environment structure
- authentication architecture
- Business Unit model

---

## Phase 1 — Services + Admin MVP

Build:

### Services

- public website
- service categories
- service details
- contact/inquiry form

### Admin

- authentication
- dashboard
- inquiries
- inquiry replies
- services management
- contacts
- business units
- users
- roles
- permissions
- settings
- audit foundation

---

## Phase 2 — Professional Operations

Potential modules:

- Clients
- Consultancy Projects
- Training
- Printing Jobs
- Documents
- Quotations
- Invoices
- Payments
- Expenses

Scope must be confirmed before implementation.

---

## Phase 3 — Corporate Website

Build/refine:

```text
saasmartworks.com
```

as the parent corporate experience connecting business units.

---

## Phase 4 — Eatery

After dedicated discovery:

- customer authentication
- menu
- cart
- checkout
- orders
- order management

---

## Phase 5 — Wallet & Billstack

Implement carefully:

- wallets
- virtual accounts
- Billstack
- webhooks
- ledger
- deposits
- order debits
- refunds
- reconciliation

Financial functionality requires additional review/testing before production.

---

# 65. Definition of Done

A feature is NOT complete merely because it visually works.

Before considering a production feature complete, verify where applicable:

### Functionality

- Requirements are satisfied.
- Edge cases are handled.

### Architecture

- Correct domain owns the logic.
- Existing abstractions are reused.
- No unnecessary duplication exists.

### Type Safety

- TypeScript passes.
- No unjustified `any`.

### Validation

- Inputs are validated.
- Server validation exists.

### Security

- Authorization is enforced server-side.
- Sensitive information is protected.
- Rate limiting is applied where appropriate.

### UI

- Responsive behavior works.
- Design tokens are used.
- Heroicons are used.
- Logo component is reused.
- SA'A design language is maintained.

### UX

- Loading state exists.
- Error state exists.
- Empty state exists where applicable.
- Success feedback is clear.

### Accessibility

- Keyboard interaction works.
- Labels are present.
- Focus state is visible.
- Contrast is acceptable.

### Data

- Queries are appropriate.
- Required indexes are considered.
- Data integrity is preserved.

### Observability

- Important failures can be diagnosed.
- Sensitive data is not leaked to logs.

### Testing

- Important domain behavior is tested.

### Documentation

- Architecture/TBD documentation is updated if decisions changed.

---

# 66. Core Principle

When choosing between:

```text
Fast hack
```

and:

```text
Clear, secure, reusable implementation
```

choose the clear and secure implementation.

However, do not confuse quality with unnecessary complexity.

The objective is:

> Simple where possible. Robust where necessary.

---

# 67. Final Instruction to AI Coding Agents

You are working on a real business platform.

Do not treat this as a disposable demo.

Before implementing a feature:

1. Understand the business requirement.
2. Determine which domain owns it.
3. Inspect existing implementation.
4. Identify reusable components/services.
5. Identify validation/security requirements.
6. Evaluate whether dependencies are actually necessary.
7. Implement the smallest robust solution.
8. Test important behavior.
9. Verify responsive and error states.
10. Update documentation when decisions materially change.

If this document conflicts with an old implementation shortcut, do not automatically preserve the shortcut.

If this document conflicts with a newer explicit decision from the project owner, the newer decision takes precedence and this document should be updated.

---

# 68. Immediate Starting Point

At the current project stage, DO NOT begin by installing a large collection of dependencies.

The next engineering sequence should be approximately:

```text
1. Initialize repository
2. Choose workspace/package-manager strategy
3. Establish apps/packages structure
4. Establish TypeScript/configuration
5. Add brand tokens
6. Add official logo asset + reusable Logo component
7. Establish shared UI foundations
8. Resolve MongoDB data-access strategy
9. Resolve authentication architecture
10. Build Services application shell
11. Build Admin application shell
12. Begin Services + Inquiry vertical slice
```

The first meaningful vertical slice should prove:

```text
Visitor
  ↓
Services Website
  ↓
Inquiry Form
  ↓
Validation
  ↓
Database
  ↓
Admin Dashboard
  ↓
Inquiry
  ↓
Admin Reply
  ↓
Email
```

Once this works cleanly, expand the platform incrementally.

---

# END OF PROJECT CONTEXT

```

```
