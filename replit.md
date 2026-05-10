# Traveloop

A personalized multi-city travel planning platform where users create itineraries, track budgets, manage packing lists, and share trips publicly.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/traveloop run dev` — run the frontend (port 22872)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — session signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter routing + TanStack Query + Tailwind + shadcn/ui
- API: Express 5 (artifacts/api-server)
- Auth: Replit Auth (OIDC/PKCE) via `@workspace/replit-auth-web`
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table schemas (trips, stops, activities, cities, packing, notes, auth)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/traveloop/src/` — React frontend
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — generated Zod schemas for server validation (do not edit)
- `lib/replit-auth-web/` — browser auth hook (`useAuth`)

## Architecture decisions

- Contract-first: OpenAPI spec drives codegen for both client hooks and server Zod schemas
- Auth sessions stored in PostgreSQL via Replit Auth OIDC/PKCE
- Share slugs generated with a simple random alphanumeric function (nanoid.ts)
- Numeric/decimal fields stored as text in Postgres (Drizzle numeric type) and parsed to float in routes
- Cities and activity templates are pre-seeded reference data; user-created activities live in the `activities` table

## Product

- Dashboard with trip stats and recent trips
- Create/edit multi-city trips with start/end dates, budget, and public sharing toggle
- Itinerary builder: add city stops with dates, assign activities to each stop
- Budget breakdown per stop with comparison to user-set budget
- Packing checklist grouped by category with one-click pack/unpack
- Trip notes/journal per trip
- City explorer with activity template suggestions
- Public shareable trip view at `/share/:shareSlug`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- Always run `pnpm --filter @workspace/db run push` after changing schema files
- Numeric DB fields (cost, totalBudget, costIndex) come back as strings from Drizzle — always `parseFloat()` before returning in routes
- Express 5 wildcard routes must be named: `/{*splat}` not `*`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
