# SA’A repository instructions

Read PROJECT-CONTEXT.md, architecture.md, and docs/DECISIONS.md. Newer owner decisions override historical architecture.

- One Next.js App Router application. Root app/ owns routes; all UI components live in src/components/. No workspaces, apps/, or packages/.
- npm only, one root lockfile, exact dependency versions. Use dev/build/start scripts.
- Drizzle + SQLite is the approved initial local setup. MongoDB requires a separate migration, not an environment toggle.
- Preserve .env and never print secrets. Root .env loads through Next.js or @next/env for scripts.
- Explain dependency purpose and compatibility before installing. Providers still TBD must not be invented.
- Use Radix Primitives for applicable interactions; native inputs and CSS skeletons use shared tokens. Heroicons only for icons.
- Read .agents/skills/saa-liquid-glass/SKILL.md for UI changes. Official logo asset only; dark-blue hex remains TBD.
- Strict TypeScript; server validation and authorization; keep domain/database code out of presentation. Component target <=200 lines.
- No Services customer accounts. Contacts and Clients are distinct. Admin has no operational access until auth/RBAC exist.
- Run npm run typecheck, npm run lint, and npm run build after relevant changes. Verify migrations and seeds when changing persistence.
- Do not claim unimplemented provider integrations or starter pages are complete features.
