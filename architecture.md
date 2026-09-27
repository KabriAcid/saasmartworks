> Current implementation override (2026-09-27): use one Next.js app with root app/ and src/components/, no monorepo. Initial local database: Drizzle + SQLite. Read docs/DECISIONS.md; older structure/database sections below are historical.

# SA'A SMART WORKS — Engineering & UI/UX Skill

> Repository-level implementation standard for humans and AI coding agents.
>
> This file is authoritative for implementation decisions unless a newer approved project specification explicitly overrides it.

## 1. Project Context

SA'A SMART WORKS is a modular business platform serving multiple business units.

Current and planned applications:

- `saasmartworks.com` — parent/corporate website.
- `services.saasmartworks.com` — Professional & Digital Services public application.
- `admin.saasmartworks.com` — authenticated internal administration application.
- `eatery.saasmartworks.com` — future Eatery customer application with authentication, ordering, wallet and Billstack integration.

The first implementation emphasis is the **Services application and Administration application**, while preserving architecture that can support the Eatery without a rewrite.

### Architectural philosophy

- Prefer a **modular monolith** over premature microservices.
- Prefer a **monorepo** with independently deployable applications and reusable packages.
- Organize business logic by domain/feature rather than by generic technical folders alone.
- Shared capabilities must be implemented once and reused.
- Public applications, administration, business logic, persistence and external integrations must have clear boundaries.
- Do not optimize for today's feature at the expense of tomorrow's known business requirements.

---

## 2. Non-Negotiable Engineering Principles

All implementation work must prioritize:

1. Correctness.
2. Security.
3. Maintainability.
4. Reusability.
5. Modularity.
6. Scalability.
7. Type safety.
8. Accessibility.
9. Performance.
10. Clear code over clever code.

Do not use shortcuts simply to make a feature appear complete.

### Never acceptable as a normal implementation strategy

- Giant components containing unrelated responsibilities.
- Copy-pasted business logic.
- Direct database operations inside presentation components.
- Client-side-only authorization.
- Trusting browser input because it was already validated in the UI.
- Hardcoded secrets.
- Scattered hardcoded brand colors.
- Silent `catch` blocks.
- Ignoring errors to satisfy TypeScript.
- Unexplained magic values.
- `any` used as an escape hatch when a proper type can reasonably be defined.
- Duplicating an existing shared component because making a new one is faster.
- Installing a package without evaluating whether it is needed.
- Temporary production hacks without an explicit documented reason.

---

## 3. Technology Direction

Primary direction:

- TypeScript
- React
- Next.js
- Tailwind CSS
- MongoDB
- Heroicons
- Vercel deployment
- Billstack for future Eatery virtual accounts/wallet funding

### MongoDB

MongoDB is the selected database direction.

- MongoDB Community may be used for local development.
- MongoDB Atlas may be used for remote/production environments.
- Browser code must never connect directly to MongoDB.
- Database credentials are server-only secrets.
- Use explicit validation even though MongoDB permits flexible document structures.
- Design indexes according to actual access patterns.
- Avoid unbounded embedded arrays.
- Prefer references for independently managed/unbounded entities.
- Prefer embedding for small, bounded values owned entirely by an aggregate when it improves consistency/read performance.

### Drizzle ORM compatibility gate

Drizzle ORM is the intended ORM preference, but **do not assume MongoDB support exists**.

Before implementing persistence with Drizzle:

1. Verify the current official Drizzle documentation and supported MongoDB path.
2. Do not use unofficial or experimental compatibility in production without explicit approval.
3. If Drizzle cannot safely support MongoDB, preserve MongoDB and raise the data-access-layer decision before proceeding.
4. Keep repository/domain boundaries independent enough that the persistence implementation can change without rewriting UI/business logic.

Never silently replace MongoDB with another database.

---

## 4. Dependency Installation Policy

**Do not run `npm install`, `pnpm add`, or otherwise introduce a dependency automatically just because a feature could use one.**

Before adding any package, determine:

- What exact problem does it solve?
- Can the platform/framework already solve the problem?
- Does the repository already contain an equivalent dependency or utility?
- Is the package actively maintained?
- Is it compatible with the project's Next.js/React/TypeScript versions?
- Does it unnecessarily increase client bundle size?
- Does it introduce security, licensing or maintenance concerns?
- Will it create vendor lock-in?
- Is the abstraction worth its long-term cost?

Prefer built-in platform capabilities and existing project dependencies when they adequately solve the requirement.

When a new dependency is justified, keep its usage behind a local abstraction when the dependency represents infrastructure or an external provider.

Examples:

- Email provider -> shared email adapter/service.
- File storage provider -> shared storage adapter/service.
- Billstack -> payment/virtual-account adapter.
- Authentication library -> shared authentication package.

Do not install multiple libraries that solve substantially the same problem without an approved reason.

---

## 5. Brand System

### Primary color

```css
--color-primary: #ffa64d;
```

Orange is the primary SA'A SMART WORKS brand color.

### Secondary color

The secondary brand color is **dark blue**, but its exact approved hex value has not yet been supplied.

```css
--color-secondary: /* TBD: approved SA'A SMART WORKS dark blue */;
```

**Never invent or permanently hardcode a secondary dark-blue value.**

### Semantic tokens

Brand and design values must be exposed through semantic variables/tokens rather than scattered literal values.

Recommended conceptual token structure:

```css
:root {
	--color-primary: #ffa64d;
	--color-secondary: /* approved dark blue */;

	--color-background: ...;
	--color-surface: ...;
	--color-surface-elevated: ...;
	--color-surface-glass: ...;

	--color-text-primary: ...;
	--color-text-secondary: ...;
	--color-text-muted: ...;

	--color-success: ...;
	--color-warning: ...;
	--color-error: ...;
	--color-info: ...;

	--radius-button: ...;
	--radius-input: ...;
	--radius-card: ...;
	--radius-modal: ...;

	--shadow-card: ...;
	--shadow-card-hover: ...;
	--shadow-elevated: ...;

	--blur-glass: ...;
}
```

Use semantic tokens such as `--color-primary` rather than repeating `#ffa64d` throughout components.

Changing the brand theme should primarily require editing design tokens, not dozens of components.

---

## 6. Logo Component

The supplied SA'A SMART WORKS logo must be implemented through a reusable `Logo` component.

Do not duplicate logo markup/images across applications.

Conceptual API:

```tsx
<Logo />
<Logo size="sm" />
<Logo size="lg" />
<Logo variant="full" />
<Logo variant="mark" />
```

Only implement variants that the actual logo assets support.

The Logo component should:

- preserve aspect ratio;
- support accessible alternative text where appropriate;
- support responsive sizing;
- use optimized framework image handling when appropriate;
- centralize the asset path;
- avoid hardcoded page-specific dimensions;
- support suitable presentation against approved backgrounds.

If the logo changes later, applications should not require individual rewrites.

---

## 7. UI/UX Design Philosophy

The product uses an **Apple-inspired Liquid Glass design language** adapted into a distinct SA'A SMART WORKS identity.

Apple-inspired means adopting useful design principles — restraint, clarity, depth, hierarchy, motion quality and material treatment — **not cloning Apple interfaces**.

### Liquid Glass

Use:

- translucent surfaces;
- controlled backdrop blur;
- subtle surface highlights;
- layered visual depth;
- restrained transparency;
- high-quality shadows;
- smooth transitions.

Glass is an emphasis/material treatment, not a requirement for every container.

Never sacrifice text contrast or accessibility for glass effects.

### General visual direction

- Spacious, clean layouts.
- Strong hierarchy.
- Minimal visual noise.
- Clear primary actions.
- Premium but functional appearance.
- Consistent spacing rhythm.
- Thoughtful typography.
- Avoid unnecessary borders.
- Avoid excessive decorative gradients/effects.
- Prefer composition and whitespace over visual clutter.

---

## 8. Cards

Cards should generally be:

- borderless;
- softly rounded;
- elevated through layered/multiple shadows;
- visually separated through surface/depth rather than outlines;
- responsive;
- consistent across applications.

Use multi-layer shadows carefully to create natural depth rather than one harsh shadow.

Cards must not become the default wrapper around every piece of content. Use them where grouping/elevation improves comprehension.

---

## 9. Buttons

Buttons must have:

- comfortable horizontal and vertical padding;
- a radius smaller than typical card radius;
- clear hierarchy;
- consistent icon/text spacing;
- visible focus treatment;
- hover state;
- active state where appropriate;
- disabled state;
- loading state for asynchronous actions.

Expected reusable variants may include:

- primary;
- secondary;
- outline when justified;
- ghost;
- destructive.

Do not create one-off button styling inside feature components when the shared Button component can support the requirement.

---

## 10. Icons

Use **Heroicons** for standard application icons.

Do not introduce Lucide, Font Awesome or another general-purpose icon library unless explicitly approved.

Guidelines:

- Keep icon sizing consistent.
- Use outline/solid variants intentionally.
- Do not use icons where text is clearer.
- Icon-only controls require accessible labels/tooltips where necessary.
- Wrap recurring application-specific icon patterns into reusable components if appropriate.

---

## 11. Responsive Design

Design responsively from the beginning.

Every major interface must intentionally support:

- mobile;
- tablet;
- desktop.

Do not build a desktop-only interface and treat responsive behavior as cleanup work.

Navigation, tables, forms, dashboards, dialogs, sidebars and cards must each have deliberate small-screen behavior.

Admin functionality must remain practical on mobile even when desktop provides the richest layout.

---

## 12. Accessibility

Accessibility is part of implementation quality.

At minimum:

- use semantic HTML;
- associate labels with form controls;
- preserve keyboard navigation;
- implement visible focus states;
- use accessible names for icon-only actions;
- expose form errors meaningfully;
- maintain sufficient text/background contrast;
- avoid using color alone to communicate state;
- respect `prefers-reduced-motion`;
- ensure glass/transparency never reduces readability below acceptable levels.

---

## 13. Motion and Interaction

Motion should feel polished and restrained.

Prefer:

- short transitions;
- subtle elevation changes;
- opacity/transform transitions;
- purposeful loading feedback;
- small state-change animations.

Avoid:

- gratuitous entrance animations;
- excessive bouncing;
- long transitions that delay interaction;
- animation that obscures content or navigation.

Respect reduced-motion preferences.

---

## 14. Componentization Rules

### 200-line target

React components should generally remain **under 200 lines**.

This is a design pressure, not permission to split code arbitrarily.

When a component approaches/exceeds 200 lines, evaluate whether it contains:

- multiple visual sections;
- reusable UI primitives;
- business logic;
- data fetching;
- validation logic;
- unrelated state;
- repeated markup.

Extract meaningful units.

Do not create meaningless micro-components merely to satisfy a line count.

### Separation of concerns

Presentation components should primarily render UI and coordinate user interaction.

Move appropriate logic into:

- domain services;
- server-side services/actions;
- repositories;
- validation schemas;
- hooks;
- utility functions;
- shared packages.

Do not place database queries directly inside reusable UI primitives.

---

## 15. Shared UI System

The monorepo should maintain a reusable UI package, conceptually:

```text
packages/
└── ui/
    ├── components/
    │   ├── logo/
    │   ├── button/
    │   ├── card/
    │   ├── input/
    │   ├── textarea/
    │   ├── select/
    │   ├── checkbox/
    │   ├── dialog/
    │   ├── badge/
    │   ├── avatar/
    │   ├── empty-state/
    │   ├── page-header/
    │   └── data-table/
    ├── tokens/
    ├── styles/
    └── index.ts
```

Only create primitives that are actually needed. Do not pre-build a huge design system without product use cases.

Before creating a component:

1. Search for an existing equivalent.
2. Determine whether an existing primitive can be composed.
3. Extend an existing component when the new behavior belongs to it.
4. Create a new component only when it represents a distinct reusable concept.

---

## 16. Suggested Monorepo Structure

Final structure may evolve, but maintain clear boundaries similar to:

```text
saa-smart-works/
├── apps/
│   ├── services/
│   ├── admin/
│   ├── web/
│   └── eatery/
│
├── packages/
│   ├── ui/
│   ├── database/
│   ├── auth/
│   ├── permissions/
│   ├── email/
│   ├── storage/
│   ├── validation/
│   ├── config/
│   └── types/
│
└── tooling/
```

Within an application, prefer feature/domain organization where practical:

```text
src/
├── app/
├── features/
│   ├── inquiries/
│   ├── services/
│   ├── contacts/
│   └── dashboard/
├── components/
│   └── app-specific-shared-components/
├── lib/
└── styles/
```

Do not allow generic folders such as `utils/` or `components/` to become dumping grounds.

---

## 17. Business Module Boundaries

Expected domains include:

### Shared/Core

- authentication;
- users;
- roles and permissions;
- business units;
- contacts;
- notifications;
- email;
- files/storage;
- settings;
- audit logs.

### Professional & Digital Services

- service catalog;
- inquiries;
- clients;
- consultancy projects;
- training;
- digital services;
- printing/branding jobs;
- quotations/invoices when introduced.

### Eatery — Future

- customers;
- menu;
- cart;
- orders;
- kitchen/POS/inventory as requirements mature;
- wallets;
- wallet ledger;
- Billstack integration.

Modules must not reach into another module's persistence implementation casually. Expose intentional services/interfaces.

---

## 18. Business Units

Treat business units as first-class domain entities.

Initial units:

1. Professional & Digital Services.
2. Eatery.

Where relevant, operational entities should be scoped by `businessUnitId` or the equivalent domain reference.

Do not hardcode Professional Services as the only business unit simply because it is implemented first.

---

## 19. Forms, Validation and Sanitization

Every form must consider both **user experience validation** and **authoritative server validation**.

### Client side

Use client validation to:

- provide immediate feedback;
- reduce unnecessary submissions;
- improve usability.

### Server side

Server validation is authoritative.

Never trust:

- form fields;
- query parameters;
- URL parameters;
- cookies containing user-controlled values;
- API request bodies;
- webhook payloads;
- uploaded file metadata.

Validate types, ranges, formats and domain invariants.

Sanitize content when necessary for its destination/context.

Do not blindly strip characters from all input. Validation and output encoding must reflect how the data will be used.

Prefer shared typed schemas where doing so does not compromise server security or architecture.

---

## 20. Authentication and Authorization

Authentication and authorization are different concerns.

### Authentication

Answers: **Who is the user?**

### Authorization

Answers: **What is the user allowed to do?**

Staff and future Eatery customers are distinct account populations/roles even if they share authentication infrastructure.

Never assume an authenticated customer is authorized for admin functionality.

### RBAC

Use granular permissions such as:

```text
inquiries.view
inquiries.reply
inquiries.assign
inquiries.close

services.view
services.create
services.update
services.publish

users.view
users.manage
roles.view
roles.manage
```

Authorization must be enforced server-side.

Hiding a button is UX, not security.

---

## 21. Security Requirements

Apply secure-by-design engineering.

At minimum:

- server-side validation;
- server-side authorization;
- least privilege;
- secure session/cookie configuration;
- protected environment secrets;
- rate limiting for abuse-prone endpoints;
- bot/abuse controls on public forms where appropriate;
- safe error messages;
- audit logging for material administrative actions;
- dependency review;
- secure webhook verification;
- no sensitive data in normal logs;
- no database credentials in client bundles.

Do not reveal stack traces, provider secrets or internal implementation details to end users.

---

## 22. Error Handling

Every asynchronous feature must deliberately account for:

- loading;
- success;
- empty state;
- recoverable failure;
- unrecoverable failure where relevant.

Do not swallow exceptions.

Log enough structured context to diagnose production failures without logging secrets or unnecessary sensitive information.

User-facing errors should explain what the user can do next when possible.

---

## 23. Email Architecture

Email must be treated as shared infrastructure.

Business modules should call a project abstraction rather than importing a provider SDK throughout the codebase.

Conceptually:

```text
Inquiry Module
      ↓
Email Service
      ↓
Provider Adapter
      ↓
Email Provider
```

This enables provider replacement without rewriting business modules.

Phase 1 requires admin-originated inquiry replies to reach the customer's email and be persisted in inquiry conversation history.

Do not assume full inbound mailbox synchronization unless it is separately implemented and specified.

---

## 24. External Integrations

All external services should be wrapped behind local interfaces/adapters where practical.

Examples:

- Billstack;
- email provider;
- object storage;
- authentication provider where applicable.

Adapters should centralize:

- credentials/configuration;
- request construction;
- response normalization;
- provider-specific errors;
- retries/timeouts where appropriate;
- webhook verification where applicable.

Business logic should operate on project/domain concepts rather than provider-specific payloads whenever practical.

---

## 25. Wallet & Financial Engineering — Future Eatery

Wallet functionality is financial infrastructure and must not be implemented as ordinary CRUD.

### Ledger rule

Maintain an append-only wallet transaction ledger.

Do not treat a mutable `balance` field without transaction history as sufficient accounting.

Transactions should represent events such as:

- deposit credit;
- order debit;
- refund credit;
- authorized administrative adjustment.

### Financial requirements

- Use exact money representation; never floating-point arithmetic for currency.
- Ensure wallet debit operations cannot overspend.
- Protect against concurrent double spending.
- Verify Billstack webhook authenticity.
- Make webhook handling idempotent.
- Store unique external transaction/event references.
- Replaying the same deposit event must never credit twice.
- Refunds/adjustments create new ledger entries; do not rewrite financial history.
- Support reconciliation between provider records and internal ledger records.
- Audit sensitive financial operations.

Do not implement wallet functionality until Billstack's current API/webhook contract has been verified.

---

## 26. TypeScript Standards

Use strict TypeScript.

- Prefer meaningful domain types.
- Avoid `any` unless interacting with an unavoidable untyped boundary, and narrow immediately.
- Prefer `unknown` for untrusted values until validated.
- Avoid unsafe type assertions used merely to silence compiler errors.
- Keep types close to their owning domain when they are domain-specific.
- Share types only when multiple packages genuinely share the contract.
- Do not create global catch-all type files that become dumping grounds.

---

## 27. Naming and Code Conventions

Use predictable, descriptive naming.

- Components: `PascalCase`.
- Functions/variables: `camelCase`.
- Constants: follow project convention; use uppercase for true constants where appropriate.
- Boolean names should read naturally: `isLoading`, `hasPermission`, `canReply`.
- Event handlers should communicate intent: `handleSubmit`, `handleClose`.
- Permission identifiers use stable dot notation.

Avoid vague names such as:

- `data2`;
- `temp`;
- `stuff`;
- `helper` without context;
- `handleThing`.

Prefer self-documenting code. Comments should explain **why**, constraints or non-obvious decisions — not narrate obvious syntax.

---

## 28. Data Access Boundaries

Presentation components must not own persistence logic.

Preferred conceptual flow:

```text
UI
 ↓
Application / Server Action / Route
 ↓
Domain Service
 ↓
Repository / Data Access Layer
 ↓
MongoDB
```

Not every trivial operation requires unnecessary abstraction layers, but business logic and persistence details must remain clearly separated.

Keep data-access APIs narrow and intentional.

---

## 29. Testing Expectations

Test according to risk.

Prioritize automated tests for:

- validation schemas;
- authorization rules;
- domain invariants;
- inquiry state transitions;
- critical data-access behavior;
- external-provider adapters;
- future wallet ledger operations;
- webhook idempotency;
- concurrent/insufficient-balance wallet behavior.

Critical user journeys should receive integration/end-to-end coverage where practical.

Do not write meaningless tests solely to increase a coverage number.

---

## 30. Performance Rules

- Prefer server rendering where it improves public-site performance/SEO.
- Avoid unnecessary client components.
- Keep client JavaScript intentional.
- Avoid importing large libraries for tiny utilities.
- Optimize images appropriately.
- Paginate potentially large admin collections.
- Avoid N+1 query patterns.
- Add indexes based on real query patterns.
- Avoid fetching fields/data that a view does not need.
- Debounce expensive search interactions where appropriate.

Performance optimization must remain evidence-based; do not create premature complexity for hypothetical scale.

---

## 31. AI/Coding-Agent Working Rules

Before changing code, an AI coding agent must:

1. Inspect the relevant existing files and architecture.
2. Search for reusable components/utilities before creating new ones.
3. Understand the owning domain/module.
4. Check whether the requested change affects shared behavior.
5. Evaluate whether a new dependency is truly required.

During implementation:

- Follow established project conventions.
- Make the smallest coherent architectural change, not the fastest patch.
- Preserve type safety.
- Preserve accessibility.
- Preserve server-side security boundaries.
- Reuse tokens and components.
- Keep components focused.
- Avoid unrelated refactors unless necessary for correctness.

The agent must **not**:

- silently change architecture;
- silently replace MongoDB;
- silently change brand colors;
- invent the secondary dark-blue hex;
- switch from Heroicons to another icon library;
- duplicate the logo implementation;
- install packages casually;
- disable linting/type checks to make code pass;
- remove validation because the UI already validates;
- bypass authorization to complete a feature;
- introduce `any` simply to eliminate compiler errors;
- generate giant components when meaningful decomposition exists.

If a requested implementation conflicts with this document, explicitly identify the conflict before proceeding.

---

## 32. Pre-Implementation Checklist

Before implementing a feature, verify:

- [ ] Which business unit owns it?
- [ ] Which domain/module owns it?
- [ ] Is there an existing component/service/schema to reuse?
- [ ] Does it require authentication?
- [ ] Which permissions protect it?
- [ ] What input is untrusted?
- [ ] What validation is required?
- [ ] Does it touch sensitive or financial data?
- [ ] Does it require audit logging?
- [ ] Does it require an external provider?
- [ ] Is a new dependency actually necessary?
- [ ] What are loading, empty, success and error states?
- [ ] What is the mobile behavior?
- [ ] Are accessibility requirements addressed?

---

## 33. Definition of Done

A feature is not complete merely because the happy path works.

Before considering work done, confirm as applicable:

### Architecture

- [ ] Correct domain/module owns the implementation.
- [ ] No unnecessary cross-module coupling was introduced.
- [ ] Shared functionality was reused rather than duplicated.

### Code quality

- [ ] TypeScript passes without unsafe shortcuts.
- [ ] Components are focused and normally below the 200-line target.
- [ ] No unnecessary duplicated logic.
- [ ] Naming is clear.
- [ ] No secrets or magic production values are hardcoded.

### UI/UX

- [ ] Brand tokens are used.
- [ ] Reusable Logo component is used where applicable.
- [ ] Heroicons are used for standard icons.
- [ ] Mobile, tablet and desktop behavior is intentional.
- [ ] Loading, empty, success and error states exist where required.
- [ ] Keyboard/focus/accessibility behavior has been considered.
- [ ] Liquid-glass effects preserve readability.

### Security

- [ ] Untrusted input is validated server-side.
- [ ] Sanitization/output handling is appropriate.
- [ ] Authorization is enforced server-side.
- [ ] Sensitive actions are protected/rate-limited/audited where appropriate.
- [ ] No secrets or sensitive payloads leak into client code or logs.

### Data

- [ ] Data model follows established MongoDB modeling rules.
- [ ] Required indexes/uniqueness rules are considered.
- [ ] Persistence errors are handled.
- [ ] Financial data follows ledger/idempotency requirements when applicable.

### Verification

- [ ] Relevant automated tests pass.
- [ ] Lint/type checks pass.
- [ ] Critical user flow was manually verified when appropriate.
- [ ] Documentation/specification was updated if the implementation changed an architectural decision.

---

## 34. Current Brand Decisions

Confirmed:

```text
Primary:   #FFA64D
Secondary: Dark blue (exact approved hex TBD)
Icons:     Heroicons
Style:     Apple-inspired Liquid Glass
Cards:     Borderless, rounded, layered/multi-shadow depth
Buttons:   Comfortable padding, smaller radius than cards
Logo:      Reusable Logo component; asset to be supplied
```

Until the missing brand information is supplied, **do not guess it**.

---

## 35. Governing Principle

When multiple implementations are possible, prefer the solution that is:

**secure, clear, reusable, maintainable and appropriately simple — in that order — while respecting the approved SA'A SMART WORKS architecture and visual identity.**
