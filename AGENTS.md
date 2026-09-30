# SA’A repository instructions

Read PROJECT-CONTEXT.md, architecture.md, and docs/DECISIONS.md. Newer owner decisions override historical architecture.

- One Next.js App Router application. Root app/ owns routes; all UI components live in src/components/. No workspaces, apps/, or packages/.
- npm only, one root lockfile, exact dependency versions. Use dev/build/start scripts.
- Supabase PostgreSQL through Drizzle is the approved database. Never switch database providers with an environment toggle.
- Preserve .env and never print secrets. Root .env loads through Next.js or @next/env for scripts.
- Explain dependency purpose and compatibility before installing. Providers still TBD must not be invented.
- Use Radix Primitives for applicable interactions; native inputs and CSS skeletons use shared tokens. Heroicons only for icons.
- Read .agents/skills/saa-liquid-glass/SKILL.md for UI changes. Official logo asset only; dark-blue hex remains TBD.
- Strict TypeScript; server validation and authorization; keep domain/database code out of presentation. Component target <=200 lines.
- No Services customer accounts. Contacts and Clients are distinct. Admin has no operational access until auth/RBAC exist.
- Run npm run typecheck, npm run lint, and npm run build after relevant changes. Verify migrations and seeds when changing persistence.
- Do not claim unimplemented provider integrations or starter pages are complete features.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
