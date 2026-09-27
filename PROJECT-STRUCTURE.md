# Project Structure

Shareable source-tree snapshot. It omits Git internals, dependencies, build output, local databases, and private environment files. `.env.example` is included; `.env` is not.

```text
.
+-- .agents/
|   \-- skills/
|       +-- nextjs-developer/
|       |   \-- SKILL.md
|       \-- saa-liquid-glass/
|           \-- SKILL.md
+-- app/
|   +-- admin/
|   |   +-- layout.tsx
|   |   \-- page.tsx
|   +-- error.tsx
|   +-- globals.css
|   +-- layout.tsx
|   +-- loading.tsx
|   +-- not-found.tsx
|   \-- page.tsx
+-- docs/
|   +-- DECISIONS.md
|   +-- SAA_SMART_WORKS_SRS_System_Architecture_v1.0.docx
|   \-- SETUP.md
+-- drizzle/
|   +-- meta/
|   |   +-- _journal.json
|   |   \-- 0000_snapshot.json
|   \-- 0000_needy_doorman.sql
+-- public/                         (static assets)
+-- scripts/
|   +-- migrate.ts
|   \-- seed.ts
+-- skills/
|   \-- apple-liquid-glass/
|       \-- SKILL.md
+-- src/
|   +-- components/
|   |   +-- admin/
|   |   |   \-- admin-home.tsx
|   |   +-- services/
|   |   |   \-- services-home.tsx
|   |   +-- shared/
|   |   |   +-- error-state.tsx
|   |   |   +-- loading-state.tsx
|   |   |   +-- logo.tsx
|   |   |   \-- not-found.tsx
|   |   \-- ui/
|   |       +-- button.tsx
|   |       +-- input.tsx
|   |       \-- skeleton.tsx
|   +-- config/
|   |   \-- env.ts
|   +-- db/
|   |   +-- client.ts
|   |   \-- schema.ts
|   +-- lib/
|   +-- types/
|   \-- validation/
|       \-- inquiry.ts
+-- .env.example
+-- .gitignore
+-- .npmrc
+-- AGENTS.md
+-- architecture.md
+-- dependency-audit.json
+-- drizzle.config.ts
+-- eslint.config.mjs
+-- next-env.d.ts
+-- next.config.ts
+-- package.json
+-- package-lock.json
+-- postcss.config.mjs
+-- PROJECT-CONTEXT.md
+-- PROJECT-STRUCTURE.md
+-- README.md
\-- tsconfig.json
```
